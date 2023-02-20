package com.jmmb.los.pb.service;

import java.util.List;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.dto.ApplicationPreferenceDTO;
import com.jmmb.los.pb.api.dto.EmailTemplate;
import com.jmmb.los.pb.config.ProcedureConfig;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.ibps.dto.masterdata.Record;
import com.jmmb.los.pb.util.Helper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class PreferenceService {

	// private static final String SAVE_PREFERENCE_PROCEDURE =
	// "NG_RLOS_PORTAL_SAVE_PREFERENCE";
	// private static final String LOAD_PREFERENCE_PROCEDURE =
	// "NG_RLOS_PORTAL_LOAD_PREFERENCE";

	@Autowired
	private ProcedureConfig procedureConfig;
	@Autowired
	private Helper helper;

	@Value("${email-properties.retrievalUrl}")
	private String retrievalUrl;

	@Autowired
	private EmailService emailService;

	public ApplicationPreferenceDTO savePreference(ApplicationPreferenceDTO preference, String wi, boolean saveAndExit,
			Boolean isComplete) {
		log.info("Invoking createPreference method in PreferenceService");		
		String procName = procedureConfig.getProcedureName().get("savePreferenceProcedure");		
		
		String[] params = new String[4];
		params[0] = wi;
		params[1] = checkStringForNull(preference.getVisitorIP(), "");
		params[2] = checkStringForNull(preference.getLastVisitedPage(), "");
		params[3] = isComplete ? "1" : "0";
		
		APProcedureWithColumnNames dbData = helper.executeProcedure(procName, params);
		if (Objects.nonNull(dbData.getOutput())) {
			List<Record> recordList = Helper.iterateRecords(dbData.getOutput().getParam1());
			if (recordList.isEmpty()) {
				log.error("No data received from db");
			} else {
				String code = recordList.get(0).getCode();
				log.info("Data saved in db with code -> {}", code);
			}
			if (saveAndExit) {
				if (emailService.triggerEmail(wi, EmailTemplate.SAVE_AND_EXIT, retrievalUrl)) {
					log.info("Save and Exit email sent for ARN: {}", wi);
				} else {
					log.info("Save and Exit email sending failed for ARN: {}", wi);
				}
			}
		}
		return preference;

	}

	private String checkStringForNull(String value, String defaultValue) {
		return value == null ? defaultValue : value;
	}

	public ApplicationPreferenceDTO loadPreference(String wi) {
		log.info("Invoking loadPreference method in PreferenceService");
		String procName = procedureConfig.getProcedureName().get("loadPreferenceProcedure");

		String[] params = new String[] {wi};

		APProcedureWithColumnNames dbData = helper.executeProcedure(procName, params);
		if (Objects.nonNull(dbData.getOutput())) {
			List<Record> recordList = Helper.iterateRecords(dbData.getOutput().getParam1());
			if (recordList.isEmpty()) {
				log.error("Record List from DB is empty");
				return null;
			} else {
				ApplicationPreferenceDTO applicationPreference = new ApplicationPreferenceDTO();
				applicationPreference.setLastVisitedPage(recordList.get(0).getLastPage());
				applicationPreference.setVisitorIP(recordList.get(0).getIp());
				applicationPreference.setStatus(recordList.get(0).getStatus());
				log.info("Data retrieved from db successfully with Last Page = {}, IP = {}, Status = {}",
						recordList.get(0).getLastPage(), recordList.get(0).getIp(), recordList.get(0).getStatus());
				return applicationPreference;
			}
		} else {
			log.info("DB Data exits with error", dbData);
			return null;
		}
	}

}
