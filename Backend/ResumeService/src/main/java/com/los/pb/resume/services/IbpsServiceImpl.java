package com.los.pb.resume.services;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.Collections;
import java.util.Objects;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.los.pb.resume.config.IBPSConfig;
import com.los.pb.resume.config.ResumeConfig;
import com.los.pb.resume.dto.ApplicationDetailsDTO;
import com.los.pb.resume.dto.OtpDetails;
import com.los.pb.resume.ibps.xml.APProcedureInputCall;
import com.los.pb.resume.ibps.xml.APProcedureOutputCall;
import com.los.pb.resume.ibps.xml.DbOutput;
import com.los.pb.resume.ibps.xml.GetSessionResponse;
import com.los.pb.resume.ibps.xml.ProcedureCallDataDTO;
import com.los.pb.resume.ibps.xml.SessionDisconnectionResponse;
import com.newgen.wfdesktop.xmlapi.WFCallBroker;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
public class IbpsServiceImpl {

	private static final String SUCCESSFUL_MAIN_CODE = "0";
	private static final String USER_NAME = "userName";
	private static final String PASSWORD = "password";
	private static final String SESSION_ID = "sessionId";

	@Autowired
	private IBPSConfig ibpsConfig;
	@Autowired
	private RestTemplate restTemplate;
	@Autowired
	private ResumeConfig resumeConfig;

	/* Method to search customer if present in Database records */

	public ProcedureCallDataDTO searchCustomer(String procedureName, String[] paramArray)
			throws IOException, JAXBException, InstantiationException, IllegalAccessException {
		ProcedureCallDataDTO procedureResponse = null;
		String sessionId = StringUtils.EMPTY;
		try {
			sessionId = createSession();
			String inputXMLRequest = prepareAPProcedureCall(procedureName, sessionId, paramArray);
			String xmlOutputResponse = executeProcedure(inputXMLRequest);
			if (!Objects.isNull(xmlOutputResponse)) {
				APProcedureOutputCall data = unmarshallResponse(xmlOutputResponse);
				log.debug("Data received -{}" + data);
				if (Objects.nonNull(data) && Objects.nonNull(data.getOutput()) && "0".equals(data.getMainCode())) {
					procedureResponse = extractResponse(data.getOutput());
				}
			}
		} catch (Exception ex) {
			log.info("Some exception occured: {}", ex.getMessage());
		} finally {
			if (StringUtils.isNotEmpty(sessionId)) {
				disconnectSession(sessionId);
			}
		}
		return procedureResponse;
	}

	/*
	 * Method to fetch OTP if present in Database records against a specific ARN
	 */
	public ProcedureCallDataDTO fetchOtp(String procedureName, String[] paramArray) {
		ProcedureCallDataDTO procedureResponse = null;
		String sessionId = StringUtils.EMPTY;
		try {
			sessionId = createSession();
			String inputXMLRequest = prepareAPProcedureCall(procedureName, sessionId, paramArray);
			String xmlOutputResponse = executeProcedure(inputXMLRequest);
			if (!Objects.isNull(xmlOutputResponse)) {
				APProcedureOutputCall data = unmarshallResponse(xmlOutputResponse);
				if (Objects.nonNull(data) && Objects.nonNull(data.getOutput())
						&& Objects.nonNull(data.getOutput().getParam1())) {
					procedureResponse = extractResponse(data.getOutput());
					log.info("OTP details -{}", procedureResponse);
				}
			}
		} catch (Exception ex) {
			log.info("Some exception occured: {}", ex.getMessage());
		} finally {
			if (StringUtils.isNotEmpty(sessionId)) {
				disconnectSession(sessionId);
			}
		}
		return procedureResponse;
	}

	/*
	 * Method to update OTP flag to "VERIFIED" in Database records against a
	 * specific ARN and OTP
	 */
	public void updateOtpFlag(@NonNull final String procName, @NonNull final String procParams) {
		String[] params = { procParams, "", "", "" };
		String sessionId = StringUtils.EMPTY;
		try {
			sessionId = createSession();
			String inputXMLRequest = prepareAPProcedureCall(procName, sessionId, params);
			String xmlOutputResponse = executeProcedure(inputXMLRequest);
			if (!Objects.isNull(xmlOutputResponse)) {
				APProcedureOutputCall data = unmarshallResponse(xmlOutputResponse);
				if (Objects.nonNull(data) && "0".equals(data.getMainCode())) {
					log.info("OTP updated successfully -{}" + data);
				}
			}
		} catch (Exception ex) {
			log.info("Some exception occured: {}", ex.getMessage());
		} finally {
			if (StringUtils.isNotEmpty(sessionId)) {
				disconnectSession(sessionId);
			}
		}
	}

	/* Method to save OTP in Database records against a specific ARN */
	public void saveOTP(String[] params, String procedureName) {
		String sessionId = StringUtils.EMPTY;
		try {
			sessionId = createSession();
			String inputXMLRequest = prepareAPProcedureCall(procedureName, sessionId, params);
			String xmlOutputResponse = executeProcedure(inputXMLRequest);
			if (!Objects.isNull(xmlOutputResponse)) {
				APProcedureOutputCall data = unmarshallResponse(xmlOutputResponse);
				if (Objects.nonNull(data) && "0".equals(data.getMainCode())) {
					log.info("OTP Saved  successfully -{}", data);
				}
			}
		} catch (Exception ex) {
			log.info("Some exception occured: {}", ex.getMessage());
		} finally {
			if (StringUtils.isNotEmpty(sessionId)) {
				disconnectSession(sessionId);
			}
		}
	}

	/*
	 * Method to send authentication email and OTP against a specific ARN during
	 * Resuming an Application
	 */
	public boolean sendEmail(String arn, String otp) {
		boolean status = false;
		String sessionId = StringUtils.EMPTY;
		try {
			sessionId = createSession();
			String[] paramForEmailProcedure = { arn, otp };
			String inputXMLRequest = prepareAPProcedureCall("NG_PORTAL_RESUME_OTP_EMAIL_SENDING", sessionId, paramForEmailProcedure);
			String xmlOutputResponse = executeProcedure(inputXMLRequest);
			if (!Objects.isNull(xmlOutputResponse)) {
				APProcedureOutputCall data = unmarshallResponse(xmlOutputResponse);
				if (Objects.nonNull(data) && "0".equals(data.getMainCode())) {
					status = true;
					log.info("Email sent-{}", data);
				}
			}
		} catch (Exception ex) {
			log.info("Some exception occured: {}", ex.getMessage());
		} finally {
			if (StringUtils.isNotEmpty(sessionId)) {
				disconnectSession(sessionId);
			}
		}
		return status;
	}

	public ApplicationDetailsDTO fetchApplicationDetails(String procedureName, String[] paramArray) {
		ApplicationDetailsDTO appDetails = new ApplicationDetailsDTO();
		String sessionId = StringUtils.EMPTY;
		try {
			sessionId = createSession();
			String inputXMLRequest = prepareAPProcedureCall(procedureName, sessionId, paramArray);
			String xmlOutputResponse = executeProcedure(inputXMLRequest);
			if (!Objects.isNull(xmlOutputResponse)) {
				APProcedureOutputCall data = unmarshallResponse(xmlOutputResponse);
				log.debug("Data received -{}" + data);
				if (Objects.nonNull(data) && Objects.nonNull(data.getOutput()) && "0".equals(data.getMainCode())) {
					// procedureResponse = extractResponse(data.getOutput());
					DbOutput output = data.getOutput();
					if (Objects.nonNull(output.getParam1().getRecords())
							&& Objects.nonNull(output.getParam1().getRecords().getRecord())
							&& output.getParam1().getTotalRetrieved() == 1) {
						com.los.pb.resume.ibps.xml.Record record = output.getParam1().getRecords().getRecord();
						appDetails.setArn(record.getARN());
						appDetails.setApplicationType(record.getAppType());
						appDetails.setApplicationStatus(record.getAppStatus());
						appDetails.setInitiationDate(record.getInitDate());
						appDetails.setModifyDate(record.getModDate());
						appDetails.setResumable("1".equals(record.getIsResumable()) ? true : false);
					}
				}
			}
		} catch (Exception ex) {
			log.info("Some exception occured: {}", ex.getMessage());
		} finally {
			if (StringUtils.isNotEmpty(sessionId)) {
				disconnectSession(sessionId);
			}
		}
		return appDetails;
	}

	/* Method to extract response from the executed procedure */
	private ProcedureCallDataDTO extractResponse(DbOutput output) {
		ProcedureCallDataDTO procedureResponse = new ProcedureCallDataDTO();
		if (Objects.nonNull(output.getParam1().getRecords())
				&& Objects.nonNull(output.getParam1().getRecords().getRecord())
				&& output.getParam1().getTotalRetrieved() == 1) {
			com.los.pb.resume.ibps.xml.Record record = output.getParam1().getRecords().getRecord();
			procedureResponse.setFound(record.getFound());
			OtpDetails otpDetail = new OtpDetails();
			otpDetail.setArn(record.getARN());
			otpDetail.setCreatedOn(record.getCreatedOn());
			otpDetail.setFlag(record.getFlag());
			otpDetail.setOtp(record.getOtp());
			procedureResponse.setOtpDetail(otpDetail);
		}
		return procedureResponse;
	}

	/* Method to create ibps session */
	private String createSession() {
		log.info("Inside session createSession() method");
		String sessionUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMConnect").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();

		sessionHeaders.set(PASSWORD, ibpsConfig.getIbpsPushUserPassword());
		final HttpEntity<String> sessionEntity = new HttpEntity<>(sessionHeaders);

		sessionUrl = UriComponentsBuilder.fromHttpUrl(sessionUrl)
				.queryParam(USER_NAME, ibpsConfig.getIbpsPushUserName()).build().toUriString();
		log.info("iBPS session creation URL: {}", sessionUrl);
		ResponseEntity<GetSessionResponse> response = restTemplate.exchange(sessionUrl, HttpMethod.POST, sessionEntity,
				GetSessionResponse.class);
		log.info("Session creation response from iBPS: {}", response);
		GetSessionResponse ibpsSessionResponse = response.getBody();

		if (!Objects.isNull(ibpsSessionResponse.getExceptionMsg())) {
			log.info("Error Creating Session with IBPS with Exception Message : {}",
					ibpsSessionResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsSessionResponse.getException().getMainCode())) {
			log.info("IBPS Session request successful with Main Code 0");
		} else {
			log.info("IBPS Session request failed with Main Code {}", ibpsSessionResponse.getException().getMainCode());			
		}
		return ibpsSessionResponse.getParticipant().getSessionId();
	}

	private String prepareAPProcedureCall(@NonNull final String procName, @NonNull final String sessionId,
			@NonNull final String[] procParams) {
		log.info("Preparing APProcedureWithColumnNames");

		String params = "'" + StringUtils.join(procParams, "','") + "'";

		final Writer writer = new StringWriter();
		APProcedureInputCall request = new APProcedureInputCall();
		request.setEngineName(ibpsConfig.getEngineName());
		request.setParams(params);
		request.setProcName(procName);
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

	/* Method to execute procedure */
	private String executeProcedure(String wfInputXml) {
		log.info("Executing APProcedureWithColumnNames with following request - {}", wfInputXml);
		String strOutputXml = null;
		try {
			strOutputXml = WFCallBroker.execute(wfInputXml, ibpsConfig.getJtsIpname(), ibpsConfig.getJtsPortname(), 1);
		} catch (Exception e) {
			log.error("Error occured while executing procedure using JTS connection-{}", e.getMessage());
		}
		log.info("Received following response - {}", strOutputXml);
		return strOutputXml;
	}

	private APProcedureOutputCall unmarshallResponse(String xmlOutputResponse) {
		APProcedureOutputCall dbData = null;
		try {
			JAXBContext jaxbContext = JAXBContext.newInstance(APProcedureOutputCall.class);
			log.info("Unmarshalling the Master Data XML");
			Unmarshaller jaxbUnmarshaller = jaxbContext.createUnmarshaller();
			dbData = (APProcedureOutputCall) jaxbUnmarshaller
					.unmarshal(new StringReader(xmlOutputResponse.replace("<? Xml Version=\"1.0\"?>", "")));
			log.info("Data received -{}", dbData);
			if (!"0".equals(dbData.getMainCode())) {
				log.error("Error occured while executing Procedure-{}", dbData.getMessage());
			}
		} catch (JAXBException e) {
			log.error("Error in Unmarshalling Procedure Data XML ");
		}
		return dbData;
	}

	/* Method to disconnect ibps session */
	private void disconnectSession(@NonNull final String sessionId) {
		log.info("Inside iBPS session disconnect method");
		String disconnectSessionUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMDisconnect").toString();
		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		final HttpEntity<String> sessionEntity = new HttpEntity<>(sessionHeaders);
		disconnectSessionUrl = UriComponentsBuilder.fromHttpUrl(disconnectSessionUrl)
				.queryParam(USER_NAME, ibpsConfig.getIbpsPushUserName()).build().toUriString();
		log.info("Session disconnect URL: {}", disconnectSessionUrl);
		ResponseEntity<SessionDisconnectionResponse> response = restTemplate.exchange(disconnectSessionUrl,
				HttpMethod.POST, sessionEntity, SessionDisconnectionResponse.class);
		log.info("Disconnect session response from iBPS: {}", response);
		SessionDisconnectionResponse ibpsSessionResponse = response.getBody();

		if (!Objects.isNull(ibpsSessionResponse.getExceptionMsg())) {
			log.info("Error While Disconnecting session with IBPS with Exception Message : {}",
					ibpsSessionResponse.getExceptionMsg());
		} else if (!SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsSessionResponse.getException().getMainCode())) {
			log.info("IBPS Disconnect request unsuccessful with Main Code 1, Response : {}", ibpsSessionResponse);
		}
		log.info("IBPS Disconnect request successful with Main Code 0, Response : {}", ibpsSessionResponse);
	}

	/* Common headers */
	private HttpHeaders getHttpHeader() {
		final HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_XML);
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_XML));
		return headers;
	}

}
