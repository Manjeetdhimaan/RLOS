package com.jmmb.los.pb.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.Attributes;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.ibps.dto.masterdata.Record;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributeResponse;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributesRequest;
import com.jmmb.los.pb.ibps.service.IbpsPushService;
import com.jmmb.los.pb.util.Helper;
import com.jmmb.los.pb.util.JaxBUtil;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@ConditionalOnProperty(prefix = "expireScheduler", name = "enable")
public class ExpireSchedulerService {

    private static final String PORTAL_EXPIRE_APPLICATION = "NG_RLOS_PORTAL_EXPIRE_APPLICATION";
    private static final String DECISION = "PW_EXPIRE";

    @Autowired
    private IBPSConfig ibpsConfig;
    @Autowired
	private IbpsPushService ibpsPushService;

    @Scheduled(cron = "${expireScheduler.expireCron}")
    public void purgeScheduler() {
    	try {
        log.info("Inside Expire Scheduler");

        String sessionId = null;
        //final String sessionIdIbps = null;
        String cabName = ibpsConfig.getEngineName();
        String procName = PORTAL_EXPIRE_APPLICATION;

        Date date = DateUtils.addDays(new Date(), -30);
        
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        StringBuilder sb = new StringBuilder();
        sb.append("'").append(df.format(date)).append("'");

        String params = sb.toString();

        APProcedureWithColumnNames dbData = Helper.executeDbCall("", cabName, sessionId, procName, params, ibpsConfig);
        if (Objects.nonNull(dbData.getOutput())) {
            List<Record> recordList = Helper.iterateRecords(dbData.getOutput().getParam1());
            if (!recordList.isEmpty()) {
                log.info("Data received from record list are:" +recordList);
                recordList.forEach(n -> {
                    //TODO: Call ibps restful to expire the WI and move to another queue and set decision
                	try {
                	String sessionIdIbps = ibpsPushService.createSession();
                	ibpsPushService.lockWorkItem(sessionIdIbps, n.getCode());
                	SetAttributesRequest req = initiateSetAttributeReq(sessionIdIbps, n.getCode());
        			Attributes attributes = new Attributes();
        			attributes.setDecision(DECISION);
        			req.setAttributes(attributes);
        			String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
        			SetAttributeResponse attrRes = ibpsPushService.setAttributes(reqStr, sessionIdIbps);
        			if ("0".equals(attrRes.getException().getMainCode())) {
        				log.info("Decision set to "+DECISION+" for the Workitem {} completed successfully!", n.getCode());
        				ibpsPushService.completeWorkItem(n.getCode(), sessionIdIbps);
        			} else {
        				log.info("Initiating unlockWorkItem for workItem {}", n.getCode());
        				ibpsPushService.unlockWorkItem(n.getCode(), sessionIdIbps);
        			}
                    log.info("Workitem Number: {}", n.getCode());
                }
                	catch(Exception e) {
                		log.info("error in complete workitem call in expire schedular --"+ e);
                		}
                }	
                );
            } else {
                log.info("Record List is empty.");
            }
        } else {
            log.error("Data received from Query is: {}", dbData);
        }
    	}
    	catch(Exception e) {
    		log.info("error in expire schedular --"+ e);
    		
    	}
    }
    
    private SetAttributesRequest initiateSetAttributeReq(String sessionId, String workItemNumber) {
		SetAttributesRequest req = new SetAttributesRequest();
		req.setOption("WMAssignWorkItemAttributes");
		req.setEngineName(ibpsConfig.getEngineName());
		req.setSessionId(sessionId);
		req.setProcessInstanceId(workItemNumber);
		req.setWorkItemId(ibpsConfig.getWorkitemId());
		req.setProcessDefId(ibpsConfig.getProcessDefId());
		req.setActivityId(ibpsConfig.getInitiateFromActivityId());
		req.setUserDefVarFlag("Y");
		return req;
	}
}
