package com.jmmb.los.pb.documentupload;

import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Base64;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.lang3.StringUtils;

// import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import com.jmmb.los.pb.api.dto.DocUploadDTO;
import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.ibps.dto.procedure.APProcedureInputCall;
import com.jmmb.los.pb.ibps.service.IbpsPushService;
import com.jmmb.los.pb.util.FileTypeCheckerUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.newgen.wfdesktop.xmlapi.WFCallBroker;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
public class DocumentUploadService {

	@Autowired
	private DocumentUploadRepository repo;
	
	@Autowired
    private IbpsPushService ibpsPushService;
	
	@Autowired
    private IBPSConfig iBPSConfig;

	public DocUploadDTO uploadToOD(DocUploadDTO request, String arn) throws JsonProcessingException {
		log.info("In the uploadToOD method");
		
		performFileSanity(request,arn);	
		return request;
	}

	private void performFileSanity(DocUploadDTO request,String arn ) {
		try{
			log.info("Perform magic number check");
		byte[] data = Base64.getDecoder().decode(request.getData().getBytes());
        FileTypeCheckerUtil.validateFileType(data , request.getDocumentName());  
        request.setWorkitemNumber(arn);
        insertInTable(request);
        DocumentUploadResponse odResponse = repo.fetchResponseFromOD(getRequest(request, arn));
		request.setDocIndex(Integer.toString(odResponse.getDocIndex()));
		// request.setODIndex(odResponse.getImageIndex());
		
	}
		catch(Exception e){
			request.setError(true);
			log.info("Error in document upload");
			}
		
	}

	public DocUploadDTO downloadFromOD(DocUploadDTO request, String arn) throws JsonProcessingException {
		log.info("In the uploadToOD method");
		DocumentDownloadResponse odResponse = repo.fetchDocumentFromOD(getDownloadRequest(request, arn));
		// request.setODIndex(odResponse.getImageIndex());
		request.setData(odResponse.getDocument());
		return request;
	}

	private String getRequest(DocUploadDTO request, String arn) throws JsonProcessingException {
		DocumentUploadRequest odRequest = new DocumentUploadRequest();
		// String docName =
		// request.getImages().get(0).getName()+"."+request.getImages().get(0).getFileExtension();
		String docName = request.getDocumentName();
		// odRequest.setData(Base64.getEncoder().encodeToString(request.getImages().get(0).getData()));
		odRequest.setData(request.getData());
		odRequest.setDocName(docName);
		odRequest.setWorkitemName(arn);
		odRequest.setPortalRequest("true");

		return new ObjectMapper().writeValueAsString(odRequest);
	}

	private String getDownloadRequest(DocUploadDTO request, String arn) throws JsonProcessingException {
		DocumentUploadRequest odRequest = new DocumentUploadRequest();
		odRequest.setDocIndex(Integer.parseInt(request.getDocIndex()));
		odRequest.setWorkitemName(arn);
		odRequest.setDocName(request.getDocumentName());
		String strRequest = new ObjectMapper().writeValueAsString(odRequest);
		return strRequest;
	}
	public void insertInTable(DocUploadDTO doc) {
		log.info("Entering data class method");
		String sessionId = null;

		String procName = "NG_SaveDataClassFromPortal";
		try {
			sessionId = ibpsPushService.createSession();
			log.info("Fetching Master Data from db");
			String[] params = new String[5];
			params[0] = doc.getWorkitemNumber();
			params[1] = doc.getDocumentType();
			params[2] = doc.getUploadedFor() + "["+doc.getOrder()+"]";
			params[3] = doc.getAccountRelationship();
			params[4] = doc.getNibNumber();

			String inputXMLRequest = prepareAPProcedureCall(procName, sessionId, params);
			String xmlOutputResponse = executeProcedure(inputXMLRequest);
			log.info("Validate Data XML received from db: {}", xmlOutputResponse);
			APProcedureWithColumnNames dbData = null;
			JAXBContext jaxbContext = JAXBContext.newInstance(APProcedureWithColumnNames.class);
			log.info("Unmarshalling the Validate Data XML");
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			xmlOutputResponse = xmlOutputResponse.replace("&", "&amp;");
			xmlOutputResponse = xmlOutputResponse.replace("<? Xml Version=\"1.0\"?>", "");
			dbData = (APProcedureWithColumnNames) jaxbUnmarshaller.unmarshal(new StringReader(xmlOutputResponse));
			log.info("Data received -{}", dbData);
			if (dbData.getMainCode().equalsIgnoreCase("0")) {
				log.info("DOC DATA SAVED SUCCESSFULLY");
			} else {
				throw new InvalidRequestException(dbData.getMessage(), Code.IBPS_APPROCEDURE_DATA_ERROR);
			}
		} catch (Exception e) {
			log.error("Error While Fetching Master Data");
			throw new InvalidRequestException(e.getMessage(), Code.DATABASE_EXCEPTION);
		}

	}

	private String prepareAPProcedureCall(@NonNull final String procName, @NonNull final String sessionId,
			@NonNull final String[] procParams) {
		log.info("Preparing APProcedureWithColumnNames");

		String params = "'" + StringUtils.join(procParams, "','") + "'";

		final Writer writer = new StringWriter();
		APProcedureInputCall request = new APProcedureInputCall();
		request.setEngineName(iBPSConfig.getEngineName());
		request.setParams(params);
		request.setProcedureName(procName);
		request.setSessionId(sessionId);

		try {
			JAXBContext jc = JAXBContext.newInstance(APProcedureInputCall.class);
			Marshaller m = jc.createMarshaller();
			m.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, true);

			m.marshal(request, writer);
		} catch (JAXBException e) {
			log.error("Error occurred while marshalling APProcedureWithColumnNames request. Request -{}", request);
		}
		log.info("Request:- {}", writer.toString());
		return writer.toString();
	}

	private String executeProcedure(String wfInputXml) {
		log.info("Executing APProcedureWithColumnNames with following request - {}", wfInputXml);
		String strOutputXml = null;
		try {
			strOutputXml = WFCallBroker.execute(wfInputXml, iBPSConfig.getJtsIpname(), iBPSConfig.getJtsPortname(), 1);

		} catch (Exception e) {
			log.error("Error occured while executing procedure using JTS connection-{}", e.getMessage());
		}
		log.info("Received following response - {}", strOutputXml);
		return strOutputXml;
	}
}
