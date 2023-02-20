package com.jmmb.los.pb.util;

import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.ibps.dto.masterdata.Params;
import com.jmmb.los.pb.ibps.dto.masterdata.Record;
import com.jmmb.los.pb.ibps.dto.procedure.APProcedureInputCall;
import com.newgen.wfdesktop.xmlapi.WFCallBroker;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class Helper {
	@Autowired
	private IBPSConfig iBPSConfig;
    
//    private Helper() {}

    public static APProcedureWithColumnNames executeDbCall(String arn, String cabName, String sessionId,
            String procName, String params, IBPSConfig iBPSConfig) {
        APProcedureWithColumnNames dbData = null;
        String sInputXML = "<?xml version=\"1.0\"?><APProcedureWithColumnNames_Input><Option>APProcedureWithColumnNames</Option>"
                + "<EngineName>" + cabName + "</EngineName><SessionId>" + sessionId + "</SessionId>" + "<ProcName>"
                + procName + "</ProcName>" + "<Params>" + params + "</Params>" + "</APProcedureWithColumnNames_Input>";
        try {
            log.info("Calling procedure {} for wi {} with input XML: {}", procName, arn, sInputXML);
            String masterXml = (WFCallBroker.execute(sInputXML, iBPSConfig.getJtsIpname(),
                    iBPSConfig.getJtsPortname(), 1)).replace("<? Xml Version=\"1.0\"?>",
                            "<?xml version=\"1.0\"?>");

            log.info("Data XML received from db: {}", masterXml);
            JAXBContext jaxbContext = JAXBContext.newInstance(APProcedureWithColumnNames.class);

            log.info("Unmarshalling the Data XML");
            Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();

            dbData = (APProcedureWithColumnNames) jaxbUnmarshaller.unmarshal(new StringReader(masterXml));
        } catch (JAXBException e) {
            log.error("Error in Unmarshalling Data XML ", e.getMessage());
            throw new InvalidRequestException(e.getMessage(), Code.IBPS_APPROCEDURE_DATA_ERROR);
        } catch (Exception e) {
            log.error("Error While Fetching Data");
            throw new InvalidRequestException(e.getMessage(), Code.DATABASE_EXCEPTION);
        }
        return dbData;
    }

    public static List<Record> iterateRecords(Params params) {
        if (Objects.nonNull(params) && Objects.nonNull(params.getRecords())
                && Objects.nonNull(params.getRecords().getRecord())) {
            return params.getRecords().getRecord();
        }
        return new ArrayList<>();
    }
    
    public APProcedureWithColumnNames executeProcedure(@NonNull final String procedureName, String [] procedureparams) {
    	String sessionId = null;
    	log.info("Inside executeProcedure() method");
    	List<String> s = new ArrayList<>();
    	for(String p : procedureparams) {
    		s.add(p.replace("\'", "\''"));
    	}
		String params = "'" + StringUtils.join(s, "','") + "'";
		final Writer writer = new StringWriter();
		APProcedureInputCall request = new APProcedureInputCall();
		request.setEngineName(iBPSConfig.getEngineName());
		request.setParams(params);
		request.setProcedureName(procedureName);
		request.setSessionId(sessionId);
		try {
			JAXBContext jc = JAXBContext.newInstance(APProcedureInputCall.class);
			Marshaller m = jc.createMarshaller();
			m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			m.marshal(request, writer);
		} catch (JAXBException e) {
			log.error("Error occurred while marshalling APProcedureWithColumnNames_Input XML. Request -{}", request);
		}
		log.info("Input XML: {}", writer.toString());
		String strOutputXml = null;
		try {
			strOutputXml = WFCallBroker.execute(writer.toString(), iBPSConfig.getJtsIpname(), iBPSConfig.getJtsPortname(), 1);
		} catch (Exception ex) {
			log.error("Error occured while executing procedure using JTS connection: {}", ex.getMessage());
		}
		log.info("Procedure response XML received: {}", strOutputXml);
		strOutputXml = strOutputXml.replace("&", "&amp;");
		strOutputXml = strOutputXml.replace("<? Xml Version=\"1.0\"?>", "");
		APProcedureWithColumnNames dbData = null;
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(APProcedureWithColumnNames.class);
			log.info("Unmarshalling procedure response XML");
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			dbData = (APProcedureWithColumnNames) jaxbUnmarshaller.unmarshal(new StringReader(strOutputXml));			
		} catch (JAXBException jEx) {
			log.info("Some error occured while unmarshalling procedure output response XML: {}", jEx.getMessage());
		}
		return dbData;
    }
    public APProcedureWithColumnNames executeValidationProcedure(@NonNull final String procedureName, String [] procedureparams) {
    	String sessionId = null;
    	log.info("Inside executeProcedure() method");
		String params =StringUtils.join(procedureparams, ",");
		final Writer writer = new StringWriter();
		APProcedureInputCall request = new APProcedureInputCall();
		request.setEngineName(iBPSConfig.getEngineName());
		request.setParams(params);
		request.setProcedureName(procedureName);
		request.setSessionId(sessionId);
		try {
			JAXBContext jc = JAXBContext.newInstance(APProcedureInputCall.class);
			Marshaller m = jc.createMarshaller();
			m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);
			m.marshal(request, writer);
		} catch (JAXBException e) {
			log.error("Error occurred while marshalling APProcedureWithColumnNames_Input XML. Request -{}", request);
		}
		log.info("Input XML: {}", writer.toString());
		String strOutputXml = null;
		try {
			strOutputXml = WFCallBroker.execute(writer.toString(), iBPSConfig.getJtsIpname(), iBPSConfig.getJtsPortname(), 1);
		} catch (Exception ex) {
			log.error("Error occured while executing procedure using JTS connection: {}", ex.getMessage());
		}
		log.info("Procedure response XML received: {}", strOutputXml);
		strOutputXml = strOutputXml.replace("&", "&amp;");
		strOutputXml = strOutputXml.replace("<? Xml Version=\"1.0\"?>", "");
		APProcedureWithColumnNames dbData = null;
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(APProcedureWithColumnNames.class);
			log.info("Unmarshalling procedure response XML");
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			dbData = (APProcedureWithColumnNames) jaxbUnmarshaller.unmarshal(new StringReader(strOutputXml));			
		} catch (JAXBException jEx) {
			log.info("Some error occured while unmarshalling procedure output response XML: {}", jEx.getMessage());
		}
		return dbData;
    }

}
