package com.jmmb.los.pb.ibps.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Objects;

import javax.xml.bind.JAXBException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.util.UriComponentsBuilder;

import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.Attributes;
import com.jmmb.los.pb.ibps.dto.GetSessionResponse;
import com.jmmb.los.pb.ibps.dto.SessionDisconnectResponse;
import com.jmmb.los.pb.ibps.dto.WMStartProcessOutput;
import com.jmmb.los.pb.ibps.dto.WorkItemCompleteResponse;
import com.jmmb.los.pb.ibps.dto.WorkItemFetchResponse;
import com.jmmb.los.pb.ibps.dto.WorkItemLockResponse;
import com.jmmb.los.pb.ibps.dto.WorkItemUnlockResponse;
import com.jmmb.los.pb.ibps.dto.createworkitem.CreateWorkItemResponse;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributeResponse;
import com.jmmb.los.pb.ibps.integrationservice.IbpsIntegrationService;

import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@SuppressWarnings({ "rawtypes", "unchecked" })
public class IbpsPushService {

	private static final String USER_NAME = "userName";
	private static final String PASSWORD = "password";
	private static final String SESSION_ID = "sessionId";
	private static final String PROCESS_INSTANCE_ID = "processInstanceId";
	private static final String WORK_ITEM_ID = "workitemId";
	private static final String SUCCESSFUL_MAIN_CODE = "0";
	private static final String XML_STRING = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>";

	private final IbpsIntegrationService ibpsRepository;
	private final IBPSConfig ibpsConfig;
	private final ResourceLoader resourceLoader;

	@Autowired
	public IbpsPushService(@NonNull final IBPSConfig ibpsConfig,
			@NonNull final IbpsIntegrationService ibpsServiceRepository, @NonNull final ResourceLoader resourceLoader) {
		this.ibpsConfig = ibpsConfig;
		this.ibpsRepository = ibpsServiceRepository;
		this.resourceLoader = resourceLoader;
	}

	private HttpHeaders getHttpHeader() {
		final HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_XML);
		headers.setAccept(Collections.singletonList(MediaType.APPLICATION_XML));
		return headers;
	}
	
	public String createSession() {
		String sessionUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMConnect").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(PASSWORD, ibpsConfig.getIbpsPushUserPassword());
		final HttpEntity sessionEntity = new HttpEntity(sessionHeaders);

		sessionUrl = UriComponentsBuilder.fromHttpUrl(sessionUrl)
				.queryParam(USER_NAME, ibpsConfig.getIbpsPushUserName()).build().toUriString();

		final GetSessionResponse ibpsSessionResponse = ibpsRepository.executeIbpsRequest(sessionUrl, HttpMethod.POST,
				sessionEntity, GetSessionResponse.class);
		log.info("WMConnect response from iBPS: {}", ibpsSessionResponse);
		if (!Objects.isNull(ibpsSessionResponse.getExceptionMsg())) {
			log.info("Error Creating Session with IBPS with Exception Message : {}",
					ibpsSessionResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsSessionResponse.getException().getMainCode())) {
			log.info("IBPS Session Create request successful with Main Code 0");
		} else {
			log.info("IBPS Session Create request failed with Main Code {}", ibpsSessionResponse.getException().getMainCode());			
		}
		return ibpsSessionResponse.getParticipant().getSessionId();
	}
		
	public CreateWorkItemResponse createWorkItemWithApplicant(@NonNull final String request) {
		final String createWorkItemUrl = new StringBuilder(ibpsConfig.getServiceUrl())
				.append(ibpsConfig.getEngineName()).append("/WFUploadWorkItem").toString();

		log.info("createWorkItem inputXML is: " + request);

		final HttpEntity<String> sessionEntity = new HttpEntity<>(request, getHttpHeader());

		final CreateWorkItemResponse ibpsCreateWIResponse = ibpsRepository.executeIbpsRequest(createWorkItemUrl,
				HttpMethod.POST, sessionEntity, CreateWorkItemResponse.class);

		if (!Objects.isNull(ibpsCreateWIResponse.getExceptionMsg())) {
			log.info("Error Creating Work-item on IBPS with Exception Message : {}",
					ibpsCreateWIResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsCreateWIResponse.getException().getMainCode())) {
			log.info("IBPS Create Work Item request successful with Main Code 0");
		} else {
			log.info("IBPS Create Work Item request failed with Main Code {}", ibpsCreateWIResponse.getException().getMainCode());			
		}
		return ibpsCreateWIResponse;
	}

	public boolean lockWorkItem(@NonNull final String sessionId, @NonNull final String workItemNumber)
			throws InstantiationException, IllegalAccessException, JAXBException, IOException {
		boolean lockWIStatus = false;
		String lockWorkItemUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMGetWorkItem").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		final HttpEntity sessionEntity = new HttpEntity(sessionHeaders);

		lockWorkItemUrl = UriComponentsBuilder.fromHttpUrl(lockWorkItemUrl)
				.queryParam(PROCESS_INSTANCE_ID, workItemNumber).queryParam(WORK_ITEM_ID, ibpsConfig.getWorkitemId())
				.build().toUriString();

		final WorkItemLockResponse ibpsLockWIResponse = ibpsRepository.executeIbpsRequest(lockWorkItemUrl,
				HttpMethod.POST, sessionEntity, WorkItemLockResponse.class);

		if (!Objects.isNull(ibpsLockWIResponse.getExceptionMsg())) {
			log.info("Error While Locking Work-item on IBPS with Exception Message : {}",
					ibpsLockWIResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsLockWIResponse.getException().getMainCode())) {
			log.info("IBPS Lock Work-Item request successful with Main Code 0");
			lockWIStatus = true;
		} else {
			log.info("IBPS Lock Work-Item request unsuccessful with Main Code {}", ibpsLockWIResponse.getException().getMainCode());			
		}
		return lockWIStatus;
	}

	public void setAttributes(@NonNull final ApplicationDTO application, @NonNull final String sessionId, String option)
			throws InstantiationException, IllegalAccessException, JAXBException, IOException {
		String setAttributesUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WFSetAttributes").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		sessionHeaders.set(HttpHeaders.CONTENT_TYPE, "application/xml");

		Resource resource = resourceLoader.getResource("classpath:templates/setAttributeBody.xml");
		InputStream inputStream = resource.getInputStream();

		byte[] bdata = FileCopyUtils.copyToByteArray(inputStream);
		String inputXML = new String(bdata, StandardCharsets.UTF_8);

		StringBuilder workItemAttributesBuilder = new StringBuilder();
		if (option.equalsIgnoreCase("create")) {
			workItemAttributesBuilder.append("");
		}
		if (option.equalsIgnoreCase("update")) {
			workItemAttributesBuilder.append("");
			workItemAttributesBuilder.append("");

		}

		String workItemAttributes = workItemAttributesBuilder.toString();
		workItemAttributes = workItemAttributes.replaceAll(XML_STRING, "");
		inputXML = inputXML.replace("#cabinet", ibpsConfig.getEngineName());
		inputXML = inputXML.replace("#pid", application.getArn());
		inputXML = inputXML.replace("#aid", ibpsConfig.getInitiateFromActivityId());
		inputXML = inputXML.replace("#flag", "Y");
		inputXML = inputXML.replace("#prid", ibpsConfig.getProcessDefId());
		inputXML = inputXML.replace("#wid", ibpsConfig.getWorkitemId());
		inputXML = inputXML.replace("#attributes", workItemAttributes);
		inputXML = inputXML.replace("#sessionid", sessionId);

		inputXML = inputXML.replaceAll("&", "&amp;");

		log.info("Final inputXML is: " + inputXML);
		final HttpEntity sessionEntity = new HttpEntity(inputXML, sessionHeaders);

		final SetAttributeResponse ibpsSetAttributesResponse = ibpsRepository.executeIbpsRequest(setAttributesUrl,
				HttpMethod.POST, sessionEntity, SetAttributeResponse.class);

		if (!Objects.isNull(ibpsSetAttributesResponse.getExceptionMsg())) {
			log.info("Error While Work-item set attributes on IBPS with Exception Message : {}",
					ibpsSetAttributesResponse.getExceptionMsg());

		} else if (!SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsSetAttributesResponse.getException().getMainCode())) {
			log.info("IBPS Work-Item Set Attributes request unsuccessful with Main Code 1, Response : {}",
					ibpsSetAttributesResponse);

		}
		log.info("IBPS Work-Item Set Attributes request successful with Main Code 0, Response : {}",
				ibpsSetAttributesResponse);
	}

	public SetAttributeResponse setAttributes(@NonNull final String inputXML, @NonNull final String sessionId) {
		String setAttributesUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WFSetAttributes").toString();

		final HttpHeaders httpHeaders = getHttpHeader();
		httpHeaders.set(SESSION_ID, sessionId);
		httpHeaders.set(HttpHeaders.CONTENT_TYPE, "application/xml");

		log.info("setAttributes inputXML is: " + inputXML);
		final HttpEntity httpEntity = new HttpEntity(inputXML, httpHeaders);

		final SetAttributeResponse ibpsSetAttributesResponse = ibpsRepository.executeIbpsRequest(setAttributesUrl,
				HttpMethod.POST, httpEntity, SetAttributeResponse.class);

		if (!Objects.isNull(ibpsSetAttributesResponse.getExceptionMsg())) {
			log.info("Error While Work-item set attributes on IBPS with Exception Message : {}",
					ibpsSetAttributesResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsSetAttributesResponse.getException().getMainCode())) {
			log.info("IBPS Work-Item Set Attributes request successful with Main Code 0");
		} else {
			log.info("IBPS Work-Item Set Attributes request failed with Main Code {}", ibpsSetAttributesResponse.getException().getMainCode());			
		}
		return ibpsSetAttributesResponse;
	}

	public boolean completeWorkItem(@NonNull final String workItemNumber, @NonNull final String sessionId)
			throws InstantiationException, IllegalAccessException, JAXBException, IOException {
		boolean completionStatus = false;
		String completeWorkItemUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMCompleteWorkitem").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		final HttpEntity sessionEntity = new HttpEntity(sessionHeaders);

		completeWorkItemUrl = UriComponentsBuilder.fromHttpUrl(completeWorkItemUrl)
				.queryParam(PROCESS_INSTANCE_ID, workItemNumber).queryParam(WORK_ITEM_ID, ibpsConfig.getWorkitemId())
				.build().toUriString();

		final WorkItemCompleteResponse ibpsCompleteWIResponse = ibpsRepository.executeIbpsRequest(completeWorkItemUrl,
				HttpMethod.POST, sessionEntity, WorkItemCompleteResponse.class);
		
		if (!Objects.isNull(ibpsCompleteWIResponse.getExceptionMsg())) {
			log.info("Error While Work-item complete on IBPS with Exception Message : {}",
					ibpsCompleteWIResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsCompleteWIResponse.getException().getMainCode())) {
			log.info("IBPS Work-Item complete request successful with Main Code 0");
			completionStatus = true;
		} else {
			log.info("IBPS Work-Item complete request failed with Main Code : {}", ibpsCompleteWIResponse.getException().getMainCode());
			
		}
		return completionStatus;
	}

	public boolean unlockWorkItem(final String workItemNumber, final String sessionId)
			throws InstantiationException, IllegalAccessException, JAXBException, IOException {
		boolean unlockStatus = false;
		String unlockWorkItemUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMUnlockWorkitem").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		final HttpEntity sessionEntity = new HttpEntity(sessionHeaders);

		unlockWorkItemUrl = UriComponentsBuilder.fromHttpUrl(unlockWorkItemUrl)
				.queryParam(PROCESS_INSTANCE_ID, workItemNumber).queryParam(WORK_ITEM_ID, ibpsConfig.getWorkitemId())
				.build().toUriString();

		final WorkItemUnlockResponse ibpsUnlockWIResponse = ibpsRepository.executeIbpsRequest(unlockWorkItemUrl,
				HttpMethod.POST, sessionEntity, WorkItemUnlockResponse.class);
		
		if (!Objects.isNull(ibpsUnlockWIResponse.getExceptionMsg())) {
			log.info("Error While Work-item unlock on IBPS with Exception Message : {}",
					ibpsUnlockWIResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsUnlockWIResponse.getException().getMainCode())) {
			log.info("IBPS Work-Item unlock request successful with Main Code 0");
			unlockStatus = true;
		} else {
			log.info("IBPS Work-Item unlock request failed with Main Code {}", ibpsUnlockWIResponse.getException().getMainCode());			
		}
		return unlockStatus;
	}

	public boolean disconnectSession(@NonNull final String sessionId, @NonNull final String userName)
			throws InstantiationException, IllegalAccessException, JAXBException, IOException {
		boolean disconnectStatus = false;
		String disconnectSessionUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMDisconnect").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		final HttpEntity sessionEntity = new HttpEntity(sessionHeaders);

		disconnectSessionUrl = UriComponentsBuilder.fromHttpUrl(disconnectSessionUrl).queryParam(USER_NAME, userName)
				.build().toUriString();

		final SessionDisconnectResponse ibpsSessionResponse = ibpsRepository.executeIbpsRequest(disconnectSessionUrl,
				HttpMethod.POST, sessionEntity, SessionDisconnectResponse.class);
		
		if (!Objects.isNull(ibpsSessionResponse.getExceptionMsg())) {
			log.info("Error While Disconnecting session with IBPS with Exception Message : {}",
					ibpsSessionResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsSessionResponse.getException().getMainCode())) {
			log.info("IBPS Disconnect Session request successful with Main Code 0");
			disconnectStatus = true;
		} else {
			log.info("IBPS Disconnect Session request failed with Main Code {}", ibpsSessionResponse.getException().getMainCode());			
		}
		return disconnectStatus;
	}

	public Attributes fetchWorkItemData(final String sessionId, final String workItemNumber)
			throws InstantiationException, IllegalAccessException, JAXBException {
		log.info("Inside fetchWorkItemData() method for WI# {}", workItemNumber);
		WorkItemFetchResponse ibpsFetchWIResponse = null;

		String url = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMFetchWorkItemAttributes").toString();		
//		String url = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
//				.append("/WMGetWorkitemDataExt").toString();		
		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		final HttpEntity sessionEntity = new HttpEntity<>(sessionHeaders);
		url = UriComponentsBuilder.fromHttpUrl(url).queryParam(PROCESS_INSTANCE_ID, workItemNumber)
				.queryParam(WORK_ITEM_ID, ibpsConfig.getWorkitemId()).build().toUriString();
		//log.info("URL for fetch WI data from iBPS: {}", url);
		ibpsFetchWIResponse = ibpsRepository.executeIbpsRequest(url, HttpMethod.POST, sessionEntity,
				WorkItemFetchResponse.class);
		log.info("Attribues mapped: {}",ibpsFetchWIResponse);
		if (!Objects.isNull(ibpsFetchWIResponse.getExceptionMsg())) {
			log.info("Error While Locking Work-item on IBPS with Exception Message : {}",
					ibpsFetchWIResponse.getExceptionMsg());
		} else if (!SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsFetchWIResponse.getException().getMainCode())) {
			log.info("IBPS Lock Work-Item request unsuccessful with Main Code 1, Response : {}", ibpsFetchWIResponse);
		} else if (ibpsFetchWIResponse.getAttributes() == null) {
			log.info("IBPS Work-Item fetch unsuccessful with no workItem data, Response : {}", ibpsFetchWIResponse);
		}
		log.info("IBPS Lock Work-Item request successful with Main Code 0, Response : {}", ibpsFetchWIResponse);
		return ibpsFetchWIResponse.getAttributes();
	}

	public boolean startWorkItem(@NonNull final String workItemNumber, @NonNull final String sessionId)
			throws InstantiationException, IllegalAccessException, JAXBException, IOException {
		boolean completionStatus = false;
		String completeWorkItemUrl = new StringBuilder(ibpsConfig.getServiceUrl()).append(ibpsConfig.getEngineName())
				.append("/WMStartProcess").toString();

		final HttpHeaders sessionHeaders = getHttpHeader();
		sessionHeaders.set(SESSION_ID, sessionId);
		final HttpEntity sessionEntity = new HttpEntity(sessionHeaders);

		completeWorkItemUrl = UriComponentsBuilder.fromHttpUrl(completeWorkItemUrl)
				.queryParam(PROCESS_INSTANCE_ID, workItemNumber)
				.build().toUriString();
		log.info("URL for start process " + completeWorkItemUrl);

		final WMStartProcessOutput ibpsStartWIResponse = ibpsRepository.executeIbpsRequest(completeWorkItemUrl,
				HttpMethod.POST, sessionEntity, WMStartProcessOutput.class);
		log.info("Response for start process" + ibpsStartWIResponse);
		if (!Objects.isNull(ibpsStartWIResponse.getExceptionMsg())) {
			log.info("Error While Work-item complete on IBPS with Exception Message : {}",
					ibpsStartWIResponse.getExceptionMsg());
		} else if (SUCCESSFUL_MAIN_CODE.equalsIgnoreCase(ibpsStartWIResponse.getException().getMainCode())) {
			log.info("IBPS Work-Item complete request successful with Main Code 0");
			completionStatus = true;
		} else {
			log.info("IBPS Work-Item complete request failed with Main Code : {}", ibpsStartWIResponse.getException().getMainCode());
			
		}
		return completionStatus;
	}

}
