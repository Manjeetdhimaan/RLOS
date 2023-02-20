package com.jmmb.los.pb.service;

import java.io.StringReader;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;

import com.jmmb.los.pb.ibps.dto.*;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributeResponse;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributesRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.api.dto.ApplicantDTO;
import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.jmmb.los.pb.api.dto.AppointmentDTO;
import com.jmmb.los.pb.api.dto.AssetDTO;
import com.jmmb.los.pb.api.dto.CreditCardDTO;
import com.jmmb.los.pb.api.dto.DocumentDetailsDTO;
import com.jmmb.los.pb.api.dto.EmailTemplate;
import com.jmmb.los.pb.api.dto.IdDetail;
import com.jmmb.los.pb.api.dto.OtpDetailsDTO;
import com.jmmb.los.pb.api.dto.OverdraftDTO;
import com.jmmb.los.pb.api.dto.ValidateResponseDTO;
import com.jmmb.los.pb.api.dto.employment.IEmployment;
import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.jmmb.los.pb.config.OTPConfig;
import com.jmmb.los.pb.config.ProcedureConfig;
import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.createworkitem.CreateWorkItemRequest;
import com.jmmb.los.pb.ibps.dto.createworkitem.CreateWorkItemResponse;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.ibps.dto.masterdata.DbOutput;
import com.jmmb.los.pb.ibps.dto.masterdata.Params;
import com.jmmb.los.pb.ibps.dto.masterdata.Record;
import com.jmmb.los.pb.ibps.service.IbpsPushService;
import com.jmmb.los.pb.util.Helper;
import com.jmmb.los.pb.util.JaxBUtil;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ApplicationService {

	@Autowired
	private Helper helper;
	@Autowired
	private IbpsPushService ibpsPushService;
	@Autowired
	ApplicantService service;	
	@Autowired
	PreferenceService prefService;	
	@Autowired
	private EmailService emailService;	
	@Autowired
	private OtpGenerator otpService;
	@Autowired
	private IBPSConfig iBPSConfig;
	@Autowired
	private ProcedureConfig procedureConfig;	
	@Autowired
	private OTPConfig otpConfig;
	
	@Value("${email-properties.retrievalUrl}")
	private String retrievalUrl;
	
	private enum OTPStatus {
		GENERATED, VERIFIED, RESEND;
	}	
	
	String sessionId = null;

	public ValidateResponseDTO validateApplication(ApplicationDTO application) {
		ValidateResponseDTO resDto = new ValidateResponseDTO();
		String procName = procedureConfig.getProcedureName().get("validateApplication");
		try {
			log.info("Inside validateApplication() method");
			String[] params = new String[3];
			String realEmail = application.getApplicants().get(0).getEmail().replace("\'", "\''");
			params[0] = realEmail;
			params[1] = application.getLoanDetails().getLoanType();
			params[2] = application.getLoanDetails().getProduct();
			APProcedureWithColumnNames dbData = helper.executeProcedure(procName, params);
			log.info("Data received: {}", dbData);
			if (dbData.getMainCode().equalsIgnoreCase("0")) {
				DbOutput output = dbData.getOutput();
				Params param = output.getParam1();
				if (Objects.nonNull(param.getRecords())) {
					List<Record> recordlist = param.getRecords().getRecord();
					if (Objects.nonNull(recordlist)) {
						Record record = recordlist.get(0);
						String wi = record.getWorkitem().replaceFirst("\t", "");
						wi = wi.equalsIgnoreCase("null") ? "" : wi;
						resDto.setARN(wi);
						resDto.setExist(wi != null && !wi.isEmpty());
						if (wi.isEmpty()) {
							// Generate and send OTP to customer's email id
							generateAndSendOtp(application.getApplicants().get(0));
						}
					}
				}
			} else {
				throw new InvalidRequestException(dbData.getMessage(), Code.IBPS_APPROCEDURE_DATA_ERROR);
			}
		} catch (Exception e) {
			log.error("Error While Fetching Master Data");
			throw new InvalidRequestException(e.getMessage(), Code.DATABASE_EXCEPTION);
		}
		return resDto;
	}
	
	public ClientResponseDTO<Boolean> verifyOTP(ApplicationDTO request) {
		log.info("Verifying OTP");
		ClientResponseDTO<Boolean> response = null;
		List<String> errorList = new ArrayList<String>();
		try {			
			if (StringUtils.isAnyEmpty(request.getOtp(), request.getApplicants().get(0).getEmail(), request.getApplicants().get(0).getFirstName(), request.getApplicants().get(0).getLastName(), request.getApplicants().get(0).getCellPhoneNo())) {
				log.info("Invalid Request parameters passed-{}", request.toString());				
				errorList.add("Invalid Request parameters");
				response = new ClientResponseDTO<>(null, false, HttpStatus.BAD_REQUEST.value(), errorList);
			} else {
				APProcedureWithColumnNames dbData = fetchOTP(request.getApplicants().get(0));
				if (!Objects.isNull(dbData)) {
					if (dbData.getMainCode().equalsIgnoreCase("0")) {
						DbOutput output = dbData.getOutput();
						Params param = output.getParam1();
						if (Objects.nonNull(param.getRecords())) {
							List<Record> recordlist = param.getRecords().getRecord();
							if (Objects.nonNull(recordlist)) {
								Record record = recordlist.get(0);
								String otp = record.getOtp().replaceFirst("\t", "");
								otp = otp.equalsIgnoreCase("null") ? "" : otp;
								String generationTime = record.getGenerationTime().replaceFirst("\t", "");
								generationTime = generationTime.equalsIgnoreCase("null") ? "" : generationTime;
								if (request.getOtp().equals(otp)) {
									if(validateOTP(otp, generationTime)) {									
										response = new ClientResponseDTO<Boolean>(true, true, HttpStatus.OK.value(), errorList);
										if (saveOtp(request.getApplicants().get(0), otp, OTPStatus.VERIFIED)) {
											log.info("One Time Password updated in DB.");
										} else {
											log.info("One Time Password update in DB has failed.");
										}
									} else {
										errorList.add("One Time Password you have entered has expired.");
										response = new ClientResponseDTO<>(null, false, HttpStatus.BAD_REQUEST.value(), errorList);
									}
								} else {
									log.info("One Time Password is incorrect");
									errorList.add("One Time Password is incorrect");
									response = new ClientResponseDTO<>(null, false, HttpStatus.NOT_FOUND.value(), errorList);
								}
							}
						}
					} else {
						log.info("OTP fetching has failed with MainCode: {}", dbData.getMainCode());
						errorList.add(dbData.getMessage());
						response = new ClientResponseDTO<>(null, false, HttpStatus.INTERNAL_SERVER_ERROR.value(), errorList);
					}					
				} else {
					log.info("Some error occured while fetching OTP with exception");
					errorList.add("Some error occured while fetching One Time Password with exception");
					response = new ClientResponseDTO<>(null, false, HttpStatus.INTERNAL_SERVER_ERROR.value(), errorList);
				}				
			}
		} catch (Exception ex) {
			log.info("Some exception occured in VerifyOTP() method: {}", ex);
			errorList.add(ex.getMessage());
			response = new ClientResponseDTO<>(null, false, HttpStatus.INTERNAL_SERVER_ERROR.value(), errorList);
		}
		return response;
	}	
	
	public ClientResponseDTO<Boolean> resendOTP(ApplicationDTO request) {
		log.info("Inside resendOTP() method"); 
		ClientResponseDTO<Boolean> response = null;
		APProcedureWithColumnNames dbData = fetchOTP(request.getApplicants().get(0));
		List<String> errorList = new ArrayList<String>();
		if(!Objects.isNull(dbData)) {
			if (dbData.getMainCode().equalsIgnoreCase("0")) {
				DbOutput output = dbData.getOutput();
				if (Objects.isNull(output)){
					log.info("OTP not found");
					errorList.add("One Time Password not found");
					response = new ClientResponseDTO<>(false, true, HttpStatus.NOT_FOUND.value(), errorList);
				} else {
					Params param = output.getParam1();
					if (Objects.nonNull(param.getRecords())) {
						List<Record> recordlist = param.getRecords().getRecord();
						if (Objects.nonNull(recordlist)) {
							Record record = recordlist.get(0);
							String otp = record.getOtp().replaceFirst("\t", "");
							otp = otp.equalsIgnoreCase("null") ? "" : otp;
							String generationTime = record.getGenerationTime().replaceFirst("\t", "");
							generationTime = generationTime.equalsIgnoreCase("null") ? "" : generationTime;							
							Duration duration = getDuration(generationTime);
							if(duration.getSeconds() > otpConfig.getResendOtpAfter()) {
								// Send an email with existing OTP
								if (generateAndSendOtp(request.getApplicants().get(0))) {
									errorList.add("New One Time Password created and sent successfully!");
									response = new ClientResponseDTO<>(true, true, HttpStatus.CREATED.value(), errorList);
								}
							} else {
								errorList.add("One Time Password creation not allowed at this time. Please try after some time!");
								response = new ClientResponseDTO<>(false, true, HttpStatus.NOT_ACCEPTABLE.value(), errorList);
							}
						} else {
							log.info("OTP not found");
							errorList.add("One Time Password not found");
							response = new ClientResponseDTO<>(false, true, HttpStatus.NOT_FOUND.value(), errorList);
						}
					} else {
						log.info("OTP not found");
						errorList.add("One Time Password not found");
						response = new ClientResponseDTO<>(false, true, HttpStatus.NOT_FOUND.value(), errorList);
					}
				}
			} else {
				log.info("OTP fetching has failed with MainCode: {}", dbData.getMainCode());
				errorList.add(dbData.getMessage());
				response = new ClientResponseDTO<>(null, false, HttpStatus.INTERNAL_SERVER_ERROR.value(), errorList);
			}
		} else {
			log.info("Some error occured while fetching OTP with exception");
			errorList.add("Some error occured while fetching One Time Password with exception");
			response = new ClientResponseDTO<>(null, false, HttpStatus.INTERNAL_SERVER_ERROR.value(), errorList);
		}
		return response;
	}
	
	
	// public ApplicationDTO createApplication(ApplicationDTO application,
	// String context) {
	public ApplicationDTO createApplication(ApplicationDTO application) {
		String applicantName = getFullName(application.getApplicants().get(0));
		log.info("Invoking createIbpsApplication method in ApplicationService for applicant : {}", applicantName);
		String workItemNumber = null;
		String sessionId = null;
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for applicant : {}", applicantName);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}

		try {
			CreateWorkItemResponse response = ibpsPushService
					.createWorkItemWithApplicant(createWorkItemRequest(application, sessionId));
			if (response == null || response.getProcessInstanceId() == null) {
				throw new InvalidRequestException("WorkItem number not created", Code.IBPS_WORKITEM_CREATION_ERROR);
			}
			workItemNumber = response.getProcessInstanceId();
			application.setArn(workItemNumber);
			if (!Objects.isNull(response.getValues()) && response.getValues().size() > 0) {
				String applicantInsertionId = response.getValues().get(0).getValue().getInsertionOrderId()
						.replace("\n", "").trim();
				application.getApplicants().get(0).setId(Long.parseLong(applicantInsertionId));
			}
			log.info("Initiating lockWorkItem for workItem {}", application.getArn());
			ibpsPushService.lockWorkItem(sessionId, application.getArn());
			SetAttributesRequest req = initiateSetAttributeReq(sessionId, application.getArn());
			Attributes attributes = new Attributes();
			attributes.setDecision("INIT_PCW");
			req.setAttributes(attributes);
			String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
			SetAttributeResponse attrRes = ibpsPushService.setAttributes(reqStr, sessionId);
			if ("0".equals(attrRes.getException().getMainCode())) {
				log.info("Decision set to INIT_PCW for the Workitem {} completed successfully!", application.getArn());
				ibpsPushService.startWorkItem(application.getArn(), sessionId);
			} else {
				log.info("Initiating unlockWorkItem for workItem {}", application.getArn());
				ibpsPushService.unlockWorkItem(application.getArn(), sessionId);
			}
		} catch (Exception e) {
			log.error("Error While IBPS Push for applicant : {}", applicantName + " - " + workItemNumber, e);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_WORKITEM_CREATION_ERROR);
		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for applicant : {}",
							applicantName + " - " + workItemNumber, e);
				}
			}
			if (StringUtils.isNotEmpty(application.getArn())) {
				saveBranchInWFInstrumental(workItemNumber,application.getBranchCode());
				if (emailService.triggerEmail(application.getArn(), EmailTemplate.APPLICATION_INITIATION, retrievalUrl)) {
					log.info("\"Application Initiation\" email sent for ARN: {}", application.getArn());					
				} else {
					log.info("\"Application Initiation\" email sending failed for ARN: {}", application.getArn());
				}
			}
		}

		return application;
	}

	public ApplicationDTO saveConsent(ApplicationDTO application) {
		log.info("Invoking saveConsent method in ApplicationService for WorkItem No. : {}", application.getArn());
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for WorkItem No. : {}", application.getArn());
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}

		try {
			if (application.getConsent() != null) {
				log.info("Initiating lockWorkItem for workItem {}", application.getArn());
				ibpsPushService.lockWorkItem(sessionId, application.getArn());
				SetAttributesRequest req = initiateSetAttributeReq(sessionId, application.getArn());
				Attributes attributes = new Attributes();
				ConsentsGrid consentGrid = new ConsentsGrid();
				//consentGrid.setCustomerRemarks(application.getCutomerRemarks());
				consentGrid.setConsent(application.getConsent());
				DecisionGrid decisionGrid = new DecisionGrid();
				decisionGrid.setCustomerRemarks(application.getCutomerRemarks());
				decisionGrid.setReferalCode(application.getReferralSource());
				attributes.setConsentGrid(consentGrid);
				attributes.setDecisionGrid(decisionGrid);
				req.setAttributes(attributes);
				String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
				SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
				if ("0".equals(response.getException().getMainCode())) {
					log.info("Consent saved successfully for workitem {}", application.getArn());
				}
				log.info("Initiating unlockWorkItem for workItem {}", application.getArn());
				ibpsPushService.unlockWorkItem(application.getArn(), sessionId);
			}
		} catch (Exception e) {
			log.error("Error While IBPS Push for WorkItem No. : {}", application.getArn(), e);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_WORKITEM_SET_ATTRIBUTES_ERROR);
		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for WorkItem No. : {}", application.getArn(), e);
				}
			}
		}
		return application;
	}

	public ApplicationDTO submitDocuments(ApplicationDTO application) {
		log.info("Invoking submitDocuments method in ApplicationService for WorkItem No. : {}", application.getArn());
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for WorkItem No. : {}", application.getArn());
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}
		try {
			log.info("Initiating lockWorkItem for workItem {}", application.getArn());
			ibpsPushService.lockWorkItem(sessionId, application.getArn());
			SetAttributesRequest req = initiateSetAttributeReq(sessionId, application.getArn());
			addDocumentsDetails(application, sessionId, req);
			updateLoanRelationship(application, req, sessionId);
			Attributes attributes = new Attributes();
			attributes.setDecision("PW_SUBMIT");
			req.setAttributes(attributes);
			String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
			SetAttributeResponse attrRes = ibpsPushService.setAttributes(reqStr, sessionId);
			if ("0".equals(attrRes.getException().getMainCode())) {
				log.info("Decision set to INIT_PCW for the Workitem {} completed successfully!",
						application.getArn());
				if (ibpsPushService.completeWorkItem(application.getArn(), sessionId)) {
					if (emailService.triggerEmail(application.getArn(), EmailTemplate.PORTAL_APPLICATION_SUBMISSION, retrievalUrl)) {
						log.info("\"Portal Application Submission\" email sent for ARN: {}", application.getArn());					
					} else {
						log.info("\"Portal Application Submission\" email sending failed for ARN: {}", application.getArn());
					}
				}
				prefService.savePreference(application.getPreferences(), application.getArn(), false, true);
			} else {
				log.info("Initiating unlockWorkItem for workItem {}", application.getArn());
				ibpsPushService.unlockWorkItem(application.getArn(), sessionId);
			}
		} catch (Exception e) {
			log.error("Error While IBPS Push for WorkItem No. : {}", application.getArn(), e);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_WORKITEM_SET_ATTRIBUTES_ERROR);
		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for WorkItem No. : {}", application.getArn(), e);
				}
			}
		}
		return application;
	}
	
	public ApplicationDTO updateDocuments(ApplicationDTO application) {
		log.info("Invoking submitDocuments method in ApplicationService for WorkItem No. : {}", application.getArn());
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for WorkItem No. : {}", application.getArn());
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}

		try {
			if (!Objects.isNull(application.getDocuments()) && application.getDocuments().size() > 0) {
				log.info("Initiating lockWorkItem for workItem {}", application.getArn());
				ibpsPushService.lockWorkItem(sessionId, application.getArn());
				SetAttributesRequest req = initiateSetAttributeReq(sessionId, application.getArn());
				addDocumentsDetails(application, sessionId, req);
				log.info("Trigger 'Document Uploaded' email");
				triggerDocumentUpdateEmail(application);
				log.info("Initiating unlockWorkItem for workItem {}", application.getArn());
				ibpsPushService.unlockWorkItem(application.getArn(), sessionId);
			}
		} catch (Exception e) {
			log.error("Error While IBPS Push for WorkItem No. : {}", application.getArn(), e);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_WORKITEM_SET_ATTRIBUTES_ERROR);
		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for WorkItem No. : {}", application.getArn(), e);
				}
			}
		}
		return application;
	}

	public ApplicationDTO addFinancialInfo(ApplicationDTO application) {
		log.info("Invoking addFinancialInfo method in ApplicationService for WorkItem No. : {}", application.getArn());
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for WorkItem No. : {}", application.getArn());
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}

		try {
			if (application.getApplicants().size() > 0) {
				log.info("Initiating lockWorkItem for workItem {}", application.getArn());
				ibpsPushService.lockWorkItem(sessionId, application.getArn());
				// -------------------
				SetAttributesRequest req = initiateSetAttributeReq(sessionId, application.getArn());
				for (ApplicantDTO applicant : application.getApplicants()) {
					if (!Objects.isNull(applicant.getFinancialDetails())
							&& Objects.nonNull(applicant.getFinancialDetails().getAssetDetails())
							&& applicant.getFinancialDetails().getAssetDetails().size() > 0) {
						processAssetDetails(applicant, sessionId, req);
					}
				}
				// -------------------
				log.info("Initiating unlockWorkItem for workItem {}", application.getArn());
				ibpsPushService.unlockWorkItem(application.getArn(), sessionId);
			}

		} catch (Exception e) {
			log.error("Error While IBPS Push for WorkItem No. : {}", application.getArn(), e);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_WORKITEM_SET_ATTRIBUTES_ERROR);
		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for WorkItem No. : {}", application.getArn(), e);
				}
			}
		}

		return application;
	}

	public int scheduleAppointment(AppointmentDTO appointment) {
		int status = 2;
		if (Objects.isNull(appointment)) {
			return status;
		}
		log.info("Invoking scheduleAppointment() method in ApplicationService");
		String procName = procedureConfig.getProcedureName().get("emailAppointment");
		try {
			String[] params = new String[] {
					appointment.getArn(),
					appointment.getBranchCode(),
					appointment.getAppointmentDate(),
					appointment.getHour(),
					appointment.getTime()
			};
			APProcedureWithColumnNames dbData = helper.executeProcedure(procName, params);
			log.info("Data received: {}", dbData);
			if (dbData.getMainCode().equalsIgnoreCase("0")) {
				DbOutput output = dbData.getOutput();				
				Params param = output.getParam1();
				if (Objects.nonNull(param) && Objects.nonNull(param.getRecords())) {
					List<Record> recordlist = param.getRecords().getRecord();
					if (Objects.nonNull(recordlist)) {
						Record record = recordlist.get(0);						
						String strStatus = record.getStatus().replaceFirst("\t", "");
						strStatus = strStatus.equalsIgnoreCase("null") ? "" : strStatus;
						if(strStatus.equalsIgnoreCase("null") || StringUtils.isEmpty(strStatus)){
							throw new InvalidRequestException("Schedule appointment email trigger has failed!", Code.IBPS_APPROCEDURE_DATA_ERROR);
						}
						status = Integer.parseInt(strStatus);
						//resDto.setARN(wi);
						//resDto.setExist(wi != null && !wi.isEmpty());
					} else {
						status = 0;
					}					
				} else {
					status = 0;
				}				
			} else {
				throw new InvalidRequestException(dbData.getMessage(), Code.IBPS_APPROCEDURE_DATA_ERROR);
			}
			return status;
		} catch (Exception e) {
			log.error("Error While Fetching Master Data");
			throw new InvalidRequestException(e.getMessage(), Code.DATABASE_EXCEPTION);
		}
	}

	private void processAssetDetails(ApplicantDTO applicantDto, String sessionId, SetAttributesRequest req)
			throws JAXBException {

		log.info("Started processing applicant assset details");
		List<AssetDTO> assetDTO = applicantDto.getFinancialDetails().getAssetDetails();
		if (assetDTO == null) {
			return;
		}

		Attributes attributes = new Attributes();
		List<FinancialDetailsGrid> finGridList = new ArrayList<>();
		FinancialDetailsGrid finGrid = new FinancialDetailsGrid();
		finGrid.setElementId(convertLongToString(applicantDto.getFinancialDetails().getId()));
		finGrid.setMemberId(convertLongToString(applicantDto.getOrder()));
		finGrid.setMemberName(getFullName(applicantDto));
		if (applicantDto.getOrder() > 0) {
			finGrid.setMemberName(finGrid.getMemberName() + " [" + applicantDto.getOrder() + "]");
		}
		finGrid.setMemberType(applicantDto.getType());
		finGridList.add(finGrid);
		attributes.setFinancialDetailsGridList(finGridList);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);

		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (applicantDto.getFinancialDetails().getId() == null || applicantDto.getFinancialDetails().getId() == 0) {
			if (!Objects.isNull(response.getValues())) {
				String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
				applicantDto.getFinancialDetails().setId(convertStringToLong(insertionId));
				finGrid.setElementId(insertionId);
			}
		}
		for (AssetDTO assetDetails : assetDTO) {
			// finGrid.getAssetGridList().clear();
			List<AssetDetailGrid> assets = new ArrayList<>();
			AssetDetailGrid asset = new AssetDetailGrid();
			// assetId = assetDetails.getId();
			asset.setElementId(convertLongToString(assetDetails.getId()));
			asset.setMemberId(convertLongToString(applicantDto.getOrder()));
			asset.setAssetType(assetDetails.getAssetCode());
			asset.setAssetTypeLabel(assetDetails.getType());
			
			asset.setInstitutionName(assetDetails.getInstitutionName());
			//if (assetDetails.getAmount() != null) {
			//	asset.setValueOfAsset(convertStringToLong(assetDetails.getAmount()));
			//}
			asset.setValueOfAsset(assetDetails.getAmount());
			asset.setRemarks(assetDetails.getComments());
			assets.add(asset);
			finGrid.setAssetGridList(assets);
			finGridList.clear();
			finGridList.add(finGrid);
			attributes.setFinancialDetailsGridList(finGridList);
			req.setAttributes(attributes);
			reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
			response = ibpsPushService.setAttributes(reqStr, sessionId);
			if (assetDetails.getId() == null || assetDetails.getId() == 0) {
				if (!Objects.isNull(response.getValues())) {
					String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
					assetDetails.setId(convertStringToLong(insertionId));
				}
			}
		}
		req.setAttributes(null);
		log.info("Completed processing applicant asset details");

	}

	private void addDocumentsDetails(ApplicationDTO application, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		if (!Objects.isNull(application.getDocuments()) && application.getDocuments().size() > 0) {			
			log.info("Started adding document details");
			List<DocumentDetailsDTO> documents = application.getDocuments();
			if (documents == null) {
				return;
			}
			
			Attributes attributes = new Attributes();
			for (DocumentDetailsDTO doc : documents) {
				if (doc.getDocIndex() == null || doc.getDocIndex().equals("") || doc.getDocIndex().equals("0")) {
					continue;
				}
				List<DocumentDetailsGrid> docGridList = new ArrayList<>();
				DocumentDetailsGrid docGrid = new DocumentDetailsGrid();
				docGrid.setElementId(convertLongToString(doc.getId()));
				if (doc.getApplicantId() != null && doc.getApplicantId() > 0) {
					docGrid.setApplicantId(convertLongToString(doc.getApplicantId()));
					ApplicantDTO applicant = application.getApplicants().stream()
							.filter(appt -> doc.getApplicantId() == appt.getOrder()).findAny().orElse(null);
					docGrid.setApplicantName(getFullName(applicant) + " [" + applicant.getOrder() + "]");
					docGrid.setApplicantType(applicant.getLoanRelationship());
				} else {
					docGrid.setApplicantName("Application");
					docGrid.setApplicantType(doc.getApplicantType());
				}
				docGrid.setDocumentName(doc.getDocumentType());
				docGrid.setDocIndex(doc.getDocIndex());
				docGrid.setUploadDate(doc.getUploadDate());
				docGridList.add(docGrid);
				attributes.setDocumentsGrid(docGridList);
				req.setAttributes(attributes);
				String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
				SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
				if (doc.getId() == null || doc.getId() == 0) {
					if (!Objects.isNull(response.getValues())) {
						String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
						doc.setId(convertStringToLong(insertionId));
					}
				}
			}
			req.setAttributes(null);
			log.info("Completed processing applicant asset details");
		} else {
			log.info("Documents list is blank for ARN {}", application.getArn());
		}

	}

	private void triggerDocumentUpdateEmail(ApplicationDTO application) {		
		try {
			if (Objects.nonNull(application.getDocuments()) && application.getDocuments().size() > 0) {
				StringBuilder strDocs = new StringBuilder();
				for (DocumentDetailsDTO doc: application.getDocuments()) {
					if (doc.getDocIndex() == null || doc.getDocIndex().equals("") || doc.getDocIndex().equals("0")) {
						continue;
					}
					if (doc.isJustUploaded()) {
						strDocs.append("<li>");
						strDocs.append(doc.getDocumentType());
						strDocs.append("</li>");
					}
				}
				if (Objects.nonNull(strDocs)) {
					strDocs.insert(0, "<ul>");
					strDocs.append("</ul>");
					if (emailService.triggerEmail(application.getArn(), EmailTemplate.DOCUMENT_UPLOADED, strDocs.toString())) {
						log.info("'Document Uploaded' notification Email for {} sent successfully!", application.getArn());
					} else {
						log.info("'Document Uploaded' notification Email sending for {} failed!", application.getArn());
					}
				}
			}			
		} catch (Exception ex) {
			log.info("Exception occured while sending 'Document Uploaded' email notification for {}.", application.getArn());
		}
	}
	
	private boolean generateAndSendOtp(ApplicantDTO applicant) {
		String otp = StringUtils.EMPTY;
		boolean status = true;
		try {
			otp = otpService.generateOTP();			
		} catch (Exception ex) {
			status = false;
			log.info("One Time Password generation failed with exception: {}", ex);
		}
		if (saveOtp(applicant, otp, OTPStatus.GENERATED)) {
			log.info("Email with One Time Passwprd {} sent to {} for OTP Authentication.", otp, applicant.getEmail());
		} else {
			status = false;
			log.info("Email sending with OTP {} to {} is failed.", otp, applicant.getEmail());
		}
		return status;
	}
	
	private boolean saveOtp(ApplicantDTO applicant, String otp, OTPStatus otpStatus){
		boolean saveStatus = false;		
		String[] params = new String[7]; 
		String realEmail = applicant.getEmail();
		params[0] = applicant.getFirstName(); // @FIRST_NAME
		params[1] = applicant.getLastName(); // @LAST_NAME
		params[2] = applicant.getCellPhoneNo(); // @PHONE_NUMBER
		params[3] = realEmail; // @EMAIL
		params[4] = String.valueOf(java.time.LocalDateTime.now()); // @CREATED_ON
		params[5] = otpStatus.toString(); // @STATUS(GENERATED/VERIFIED)
		params[6] = otp; // @OTP
		APProcedureWithColumnNames dbData = helper.executeProcedure(procedureConfig.getProcedureName().get("saveOTP"), params);		
		if (dbData.getMainCode().equalsIgnoreCase("0")) {
			saveStatus = true;
		} else {
			saveStatus = false;
		}
		return saveStatus;
	}
	
	private Boolean validateOTP(String otp, String generationTime) {
		boolean isValid = false;
		try {
			log.info("Inside validateOTP()");
			String[] arrDt = generationTime.split("-");
			// LocalDateTime otpCreationTime = LocalDateTime.of(2020, 12, 9, 20, 50, 3, 760);
			LocalDateTime otpCreationTime = LocalDateTime.of(Integer.valueOf(arrDt[0]), Integer.valueOf(arrDt[1]),
					Integer.valueOf(arrDt[2]), Integer.valueOf(arrDt[3]), Integer.valueOf(arrDt[4]),
					Integer.valueOf(arrDt[5]), Integer.valueOf(arrDt[6]));
			log.info("OTP creation time: {}", otpCreationTime);
			Duration duration = Duration.between(otpCreationTime, LocalDateTime.now());
			log.info("OTP duration: {}", duration.getSeconds());
			if (isOTPExpired(duration)) {
				log.info("OTP is Expired");
				isValid = false;
			} else {
				log.info("OTP is valid");
				isValid = true;
			}
		} catch (Exception ex) {
			log.info("Exception occured in validateOTP(): {}", ex);
			throw ex;
		}
		return isValid;
	}
	
	private boolean isOTPExpired(Duration d) {
		return d.getSeconds() > otpConfig.getOtpValidFor().longValue();
	}
	
	private Duration getDuration(String strdateTime) {
		String[] arrDt = strdateTime.split("-");
		// LocalDateTime otpCreationTime = LocalDateTime.pa2se(otpCreatedOn,
		// formatter);
		LocalDateTime otpCreationTime = LocalDateTime.of(Integer.valueOf(arrDt[0]), Integer.valueOf(arrDt[1]),
				Integer.valueOf(arrDt[2]), Integer.valueOf(arrDt[3]), Integer.valueOf(arrDt[4]),
				Integer.valueOf(arrDt[5]), Integer.valueOf(arrDt[6]));
		Duration duration = Duration.between(otpCreationTime, LocalDateTime.now());
		return duration;
	}
	
	private APProcedureWithColumnNames fetchOTP(ApplicantDTO applicant) {		
		String[] params = new String[4];
		String realEmail =applicant.getEmail().replace("\'", "\''");
		params[0] = applicant.getFirstName(); // @FIRST_NAME
		params[1] = applicant.getLastName(); // @LAST_NAME
		params[2] = applicant.getCellPhoneNo(); // @PHONE_NUMBER
		params[3] = realEmail; // @EMAIL
		APProcedureWithColumnNames dbData = helper.executeProcedure(procedureConfig.getProcedureName().get("fetchOTP"), params);		
		return dbData;
	}
	public OtpDetailsDTO fetchOtp(String otp,String email) {
		OtpDetailsDTO result = new OtpDetailsDTO();
		try{
			String procedureFectch = "NG_RLOS_FetchOTPStatus";
			String[] params = new String[2];
			params[0]= otp;
			params[1] = email;
			
			APProcedureWithColumnNames dbData = helper.executeProcedure(procedureFectch, params);
			log.info("Data received -{}", dbData);
			if (dbData.getMainCode().equalsIgnoreCase("0")) {
				log.info("otp verified successfully");
				result.setOtp(dbData.getOutput().getParam1().getRecords().getRecord().get(0).getOtp());
				result.setCreatedOn(dbData.getOutput().getParam1().getRecords().getRecord().get(0).getGenerationTime());
				result.setEmail(dbData.getOutput().getParam1().getRecords().getRecord().get(0).getLabel());
				result.setFlag(dbData.getOutput().getParam1().getRecords().getRecord().get(0).getStatus());
				result.setName(dbData.getOutput().getParam1().getRecords().getRecord().get(0).getCode());	
			}
		}
		
		catch(Exception e){
			log.info("error in otp fetch");
		}
		return result;
		
	}
	
	private SetAttributesRequest initiateSetAttributeReq(String sessionId, String workItemNumber) {
		SetAttributesRequest req = new SetAttributesRequest();
		req.setOption("WMAssignWorkItemAttributes");
		req.setEngineName(iBPSConfig.getEngineName());
		req.setSessionId(sessionId);
		req.setProcessInstanceId(workItemNumber);
		req.setWorkItemId(iBPSConfig.getWorkitemId());
		req.setProcessDefId(iBPSConfig.getProcessDefId());
		req.setActivityId(iBPSConfig.getInitiateFromActivityId());
		req.setUserDefVarFlag("Y");
		return req;
	}

	private Long convertStringToLong(String id) {
		return id == null ? null : Long.parseLong(id);
	}

	private String convertLongToString(Long id) {
		return id == null ? null : id.toString();
	}

	private String createWorkItemRequest(ApplicationDTO application, String sessionId) throws JAXBException {
		CreateWorkItemRequest request = new CreateWorkItemRequest();
		request.setOption("WFUploadWorkItem");
		request.setEngineName(iBPSConfig.getEngineName());
		request.setSessionId(sessionId);
		request.setProcessDefId(iBPSConfig.getProcessDefId());
		request.setQueueId(iBPSConfig.getInitQueueId());
		request.setInitiateFromActivityId(iBPSConfig.getInitiateFromActivityId());
		request.setInitiateAlso("N");
		request.setVariantId("0");
		request.setIsWorkItemExtInfo("N");
		request.setUserDefVarFlag("Y");

		ApplicantDTO applicantDto = application.getApplicants().get(0);

		Attributes attributes = new Attributes();
		attributes.setCustomerName(getFullName(applicantDto));
		attributes.setSourceOfApplication("Portal");
		String productType = application.getLoanDetails() == null ? "" : application.getLoanDetails().getProduct();
		attributes.setProductType(productType);
		String loanType = application.getLoanDetails() == null ? "" : application.getLoanDetails().getLoanType();
		attributes.setLoanType(loanType);
		attributes.setBranchCode(application.getBranchCode());
		attributes.setBranchName(application.getBranchName());
		List<ApplicantDetail> applicantList = new ArrayList<>();
		ApplicantDetail ibpsApplicant = new ApplicantDetail();
		ibpsApplicant.setMemberId(applicantDto.getOrder() == null ? "1" : applicantDto.getOrder().toString());
		ibpsApplicant.setMemberType(applicantDto.getType() == null ? "Borrower" : applicantDto.getType());
		ibpsApplicant.setFirstName(applicantDto.getFirstName());
		ibpsApplicant.setLastName(applicantDto.getLastName());
		ibpsApplicant.setEmailAddress(applicantDto.getEmail());
		ibpsApplicant.setConfirmEmailAddress(applicantDto.getConfirmEmail());
		ibpsApplicant.setCellPhone(applicantDto.getCellPhoneNo());
		ibpsApplicant.setIsFilledAtPortal("Yes");
		applicantList.add(ibpsApplicant);

		attributes.setApplicantDetails(applicantList);
		request.setAttributes(attributes);

		return JaxBUtil.marshal(CreateWorkItemRequest.class, request, true, true);

	}

	private void updateLoanRelationship(ApplicationDTO application, SetAttributesRequest req, String sessionId)
			throws JAXBException {
		Attributes attributes = new Attributes();
		List<ApplicantDetail> ibpsApplicantGridList = new ArrayList<>();
		List<IdentificationDetail> ibpsIdGridList = new ArrayList<>();
		List<AddressDetail> ibpsContactInfoGridList = new ArrayList<>();
		List<EmploymentDetail> ibpsEmpGridList = new ArrayList<>();
		List<PEPDetailsGrid> ibpsPEPGridList = new ArrayList<>();
		List<FinancialDetailsGrid> finGridList = new ArrayList<>();
		List<CreditCardGrid> ccGridList = new ArrayList<>();
		List<OverdraftGrid> odGridList = new ArrayList<>();
		for (ApplicantDTO applicant : application.getApplicants()) {
			ApplicantDetail ibpsApplicantGrid = new ApplicantDetail();
			ibpsApplicantGrid.setElementId(convertLongToString(applicant.getId()));
			ibpsApplicantGrid.setLoanRelationship(applicant.getLoanRelationship());
			ibpsApplicantGrid.setLoanRelationshipCode(applicant.getLoanRelationshipCode());
			ibpsApplicantGridList.add(ibpsApplicantGrid);

			for (IdDetail idDetailDto : applicant.getIdDetails()) {
				IdentificationDetail ibpsIdGrid = new IdentificationDetail();
				ibpsIdGrid.setElementId(convertLongToString(idDetailDto.getId()));
				ibpsIdGrid.setLoanRelationship(applicant.getLoanRelationship());
				ibpsIdGrid.setLoanRelationshipCode(applicant.getLoanRelationshipCode());
				ibpsIdGridList.add(ibpsIdGrid);
			}

			AddressDetail ibpsContactInfoGrid = new AddressDetail();
			ibpsContactInfoGrid.setElementId(convertLongToString(applicant.getAddressDetails().getId()));
			ibpsContactInfoGrid.setLoanRelationship(applicant.getLoanRelationship());
			ibpsContactInfoGrid.setLoanRelationshipCode(applicant.getLoanRelationshipCode());
			ibpsContactInfoGridList.add(ibpsContactInfoGrid);

			for (IEmployment empDto : applicant.getEmpDetails()) {
				EmploymentDetail ibpsEmpGrid = new EmploymentDetail();
				ibpsEmpGrid.setElementId(convertLongToString(empDto.getId()));
				ibpsEmpGrid.setLoanRelationship(applicant.getLoanRelationship());
				ibpsEmpGrid.setLoanRelationshipCode(applicant.getLoanRelationshipCode());
				ibpsEmpGridList.add(ibpsEmpGrid);
			}

			PEPDetailsGrid ibpsPEPGrid = new PEPDetailsGrid();
			ibpsPEPGrid.setElementId(convertLongToString(applicant.getPoliticallyExposedPersonDetails().getId()));
			ibpsPEPGrid.setLoanRelationship(applicant.getLoanRelationship());
			ibpsPEPGridList.add(ibpsPEPGrid);

			if (!Objects.isNull(applicant.getFinancialDetails())) {
				FinancialDetailsGrid finGrid = new FinancialDetailsGrid();
				finGrid.setElementId(convertLongToString(applicant.getFinancialDetails().getId()));
				finGrid.setLoanRelationship(applicant.getLoanRelationship());
				finGrid.setLoanRelationshipCode(applicant.getLoanRelationshipCode());
				finGridList.add(finGrid);
			}
		}

		if (!Objects.isNull(application.getLoanDetails().getCreditCardDetails())
				&& application.getLoanDetails().getCreditCardDetails().size() > 0) {
			for (CreditCardDTO ccDto : application.getLoanDetails().getCreditCardDetails()) {
				if (ccDto.getCardsRequiredFor() == null) {
					continue;
				}
				CreditCardGrid ccGrid = new CreditCardGrid();
				ccGrid.setElementId(convertLongToString(ccDto.getId()));
				ccGrid.setBranchCode(ccDto.getBranch());
				ccGrid.setBranch(ccDto.getBranchLabel());
				
				Optional<ApplicantDTO> applicant = application.getApplicants().stream().filter(
						appt -> ccDto.getApplicantOrder().equalsIgnoreCase(convertLongToString(appt.getOrder())))
						.findFirst();
				if (Objects.nonNull(applicant.get())) {
					ccGrid.setRelationCode(applicant.get().getLoanRelationshipCode());
					ccGridList.add(ccGrid);
				}
				// for (ApplicantDTO appt : application.getApplicants()) {
				// if (convertLongToString(appt.getOrder()) ==
				// ccDto.getApplicantOrder()) {
				// ccGrid.setRelationCode(appt.getLoanRelationshipCode());
				// ccGridList.add(ccGrid);
				// }
				// }
			}
		}

		if (!Objects.isNull(application.getLoanDetails().getOverdraftDetails())
				&& application.getLoanDetails().getOverdraftDetails().size() > 0) {
			for (OverdraftDTO odDto : application.getLoanDetails().getOverdraftDetails()) {
				if (odDto.getOverdraftRequiredFor() == null) {
					continue;
				}
				OverdraftGrid odGrid = new OverdraftGrid();
				odGrid.setElementId(convertLongToString(odDto.getId()));
				Optional<ApplicantDTO> applicant = application.getApplicants().stream().filter(
						appt -> odDto.getApplicantOrder().equalsIgnoreCase(convertLongToString(appt.getOrder())))
						.findFirst();
				if (Objects.nonNull(applicant.get())) {
					odGrid.setRelationCode(applicant.get().getLoanRelationshipCode());
					odGridList.add(odGrid);
				}
				// for (ApplicantDTO appt : application.getApplicants()) {
				// if (convertLongToString(appt.getOrder()) ==
				// odDto.getApplicantOrder()) {
				// odGrid.setRelationCode(appt.getLoanRelationshipCode());
				// odGridList.add(odGrid);
				// }
				// }
			}
		}

		attributes.setApplicantDetails(ibpsApplicantGridList);
		attributes.setIdentificationDetails(ibpsIdGridList);
		attributes.setAddressDetails(ibpsContactInfoGridList);
		attributes.setEmployementDetails(ibpsEmpGridList);
		attributes.setPepDetailsGridList(ibpsPEPGridList);
		attributes.setFinancialDetailsGridList(finGridList);
		attributes.setOverdraftGridList(odGridList);
		attributes.setCreditCardGridList(ccGridList);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if ("0".equals(response.getException().getMainCode())) {
			log.info("Loan relationship updated successfully for workitem {}!", application.getArn());
		}
	}

	private String getFullName(ApplicantDTO applicant) {
		String name = "";
		name = (StringUtils.defaultIfBlank(applicant.getFirstName(), "") + " "
				+ StringUtils.defaultIfBlank(applicant.getLastName(), "")).replaceAll("  ", " ");

		return name;
	}
	
	private void saveBranchInWFInstrumental(String wi, String branch){
		//boolean saveStatus = false;		
		String[] params = new String[2]; 
		
		params[0] = wi; // @WORKITEM
		params[1] = branch; // @LAST_NAME
		
		APProcedureWithColumnNames dbData = helper.executeProcedure("NG_SetBranch_Portal_Proc", params);		
		if (dbData.getMainCode().equalsIgnoreCase("0")) {
			log.info("Branch set in wfinstrumental");
		} else {
			log.info("Branch not set in wfinstrumental");
		}
	}
}
