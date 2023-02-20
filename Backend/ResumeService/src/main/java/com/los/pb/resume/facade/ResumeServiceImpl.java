package com.los.pb.resume.facade;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.los.pb.resume.config.ResumeConfig;
import com.los.pb.resume.dto.ApplicationDetailsDTO;
import com.los.pb.resume.dto.ClientResponseDTO;
import com.los.pb.resume.dto.SearchCustomerRequest;
import com.los.pb.resume.ibps.xml.ProcedureCallDataDTO;
import com.los.pb.resume.services.IbpsServiceImpl;
import com.los.pb.resume.services.OtpGenerator;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ResumeServiceImpl {

	@Autowired
	private IbpsServiceImpl ibpsService;
	@Autowired
	private OtpGenerator otpGenerator;
	@Autowired
	private ResumeConfig resumeConfig;

	private static final String OTP_EMAIL_TEMPLATE = "Resume Application";

	// DateTimeFormatter format = DateTimeFormatter.ofPattern("yyyy-MM-dd
	// HH-mm-ss");
	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

	public ClientResponseDTO<Boolean> searchCustomer(SearchCustomerRequest searchRequest) {
		ClientResponseDTO<Boolean> response;
		if (Stream.of(searchRequest.getFirstName(), searchRequest.getLastName(), searchRequest.getArn(),
				searchRequest.getEmail()).anyMatch(StringUtils::isAnyBlank)) {
			log.info("Invalid Request parameters passed-{}", searchRequest.toString());
			List<String> errorList = new ArrayList<>();
			errorList.add("Invalid Request Paramaters.");
			response = new ClientResponseDTO<>(false, false, HttpStatus.BAD_REQUEST.value(),
					errorList);
		} else {
			log.info("Searching Customer.");
			ProcedureCallDataDTO procedureResponse;
			boolean isCustomerPresent = false;

			String otp = null;
			try {
				String emailReal = searchRequest.getEmail().replace("\'", "\''");
				String firstName = null;
				String lastName = null;
				if(!Objects.isNull(searchRequest.getFirstName())) {
					firstName = searchRequest.getFirstName().replace("'","''");
				}
				if(!Objects.isNull(searchRequest.getLastName())) {
					lastName = searchRequest.getLastName().replace("'","''");
				}
				procedureResponse = ibpsService.searchCustomer("NG_RESUME_SearchCustomer",
						new String[] { searchRequest.getArn(), firstName,
								lastName, emailReal });

				if(!Objects.isNull(procedureResponse)) {
					isCustomerPresent = Objects.nonNull(procedureResponse) ? "1".equals(procedureResponse.getFound())
							: Boolean.FALSE;

					if (isCustomerPresent) {
						otp = otpGenerator.generateOTP(resumeConfig.getOtpFormat());
						//otp="123456";
						log.info("Generated OTP-{}", otp);
						LocalDateTime datetime = LocalDateTime.now();
						String s = String.valueOf(datetime);
						ibpsService.saveOTP(
								new String[] { searchRequest.getArn(), String.valueOf(datetime), "GENERATED", otp },
								"NG_RESUME_SaveOTPDetails");
						if (ibpsService.sendEmail(searchRequest.getArn(), otp)) {
							log.info("An email with OTP sent");					
						} else {
							log.info("OTP email sending failed");
						}

					} else {
						log.info("Applicant not found");
					}
					response = new ClientResponseDTO<>(isCustomerPresent, true, HttpStatus.OK.value(), null);	
				}
				else {
					List<String> errorList = new ArrayList<>();
					errorList.add("Internal Server error. Please try after sometime");
					response = new ClientResponseDTO<>(isCustomerPresent, false, HttpStatus.INTERNAL_SERVER_ERROR.value(),errorList);
				}

				
			} catch (Exception e) {
				log.info("Error occured while searching customer from Portal. Exception-{}", e);
				List<String> errorList = new ArrayList<>();
				errorList.add("Invalid Request Paramaters.");
				
				response = new ClientResponseDTO<>(isCustomerPresent, false, HttpStatus.INTERNAL_SERVER_ERROR.value(),
						errorList);
			}
		}

		return response;
	}

	public ClientResponseDTO<ApplicationDetailsDTO> verifyOTP(SearchCustomerRequest request) {
		log.info("Verifying OTP");
		ClientResponseDTO<ApplicationDetailsDTO> response = null;
		try {			
			if (StringUtils.isAnyEmpty(request.getOtp(), request.getArn())) {
				log.info("Invalid Request parameters passed-{}", request.toString());
				List<String> errorList = new ArrayList<>();
				errorList.add("Invalid Request Paramaters.");
				
				response = new ClientResponseDTO<>(null, false, HttpStatus.BAD_REQUEST.value(),
						errorList);
			} else {
				ProcedureCallDataDTO procedureResponse = ibpsService.fetchOtp(
						"NG_RESUME_FetchOTPDetail", new String[] { request.getArn() });
				
				if (Objects.nonNull(procedureResponse) && Objects.isNull(procedureResponse.getOtpDetail())) {
					log.info("OTP not found for shared ARN:-{}", request.getArn());
					List<String> errorList = new ArrayList<>();
					errorList.add("Invalid Request Paramaters.");
					
					response = new ClientResponseDTO<>(null, false, HttpStatus.NOT_FOUND.value(),
							errorList);
				} else if (Objects.nonNull(procedureResponse) && Objects.nonNull(procedureResponse.getOtpDetail())) {
					if (procedureResponse.getOtpDetail().getOtp().equals(request.getOtp())) {
						boolean isValid = validateOTP(procedureResponse);
						if (isValid) {
							ApplicationDetailsDTO appDetails = ibpsService.fetchApplicationDetails(
									"NG_RESUME_FetchWorkItemDetail",
									new String[] { request.getArn() });
							response = new ClientResponseDTO<ApplicationDetailsDTO>(appDetails, true, HttpStatus.OK.value(),
									null);
						} else {
							List<String> errorList = new ArrayList<>();
							errorList.add("One Time Password you have entered has expired.");
							
							response = new ClientResponseDTO<>(null, false, HttpStatus.BAD_REQUEST.value(),
									errorList);
						}
					} else {
						log.info("OTP is incorrect");
						List<String> errorList = new ArrayList<>();
						errorList.add("One Time Password is incorrect");
						
						response = new ClientResponseDTO<>(null, false, HttpStatus.NOT_FOUND.value(), errorList);
					}
				}
			}
		} catch (Exception ex) {
			List<String> errorList = new ArrayList<>();
			errorList.add("Invalid Parameters");
			response = new ClientResponseDTO<>(null, false, HttpStatus.INTERNAL_SERVER_ERROR.value(), errorList);
		}
		return response;
	}

	public ClientResponseDTO<Boolean> resendOTP(SearchCustomerRequest request) {
		ClientResponseDTO<Boolean> response = null;
		ProcedureCallDataDTO procedureResponse = ibpsService.fetchOtp(
				"NG_RESUME_FetchOTPDetail", new String[] { request.getArn() });

		if (Objects.nonNull(procedureResponse) && Objects.isNull(procedureResponse.getOtpDetail())) {
			log.info("OTP not found for shared ARN:-{}", request.getArn());
			List<String> errorList = new ArrayList<>();
			errorList.add("One Time Password not found for shared ARN");
			response = new ClientResponseDTO<>(false, true, HttpStatus.NOT_FOUND.value(),
				errorList);
		} else if (Objects.nonNull(procedureResponse) && Objects.nonNull(procedureResponse.getOtpDetail())) {
			String otpCreatedOn = procedureResponse.getOtpDetail().getCreatedOn();
			String[] arrDt = otpCreatedOn.split("-");
			// LocalDateTime otpCreationTime = LocalDateTime.parse(otpCreatedOn,
			// formatter);
			LocalDateTime otpCreationTime = LocalDateTime.of(Integer.valueOf(arrDt[0]), Integer.valueOf(arrDt[1]),
					Integer.valueOf(arrDt[2]), Integer.valueOf(arrDt[3]), Integer.valueOf(arrDt[4]),
					Integer.valueOf(arrDt[5]), Integer.valueOf(arrDt[6]));
			Duration duration = Duration.between(otpCreationTime, LocalDateTime.now());
			// If Duration of OTP is expired(say 120 seconds)
			/*if (isOTPExpired(duration)) {
				log.info("Existing OTP expired, creating new OTP");
				searchCustomer(request);
			} else if (duration.getSeconds() > resumeConfig.getResendOtpAfter()) {
				// Resend OTP after a certain time(say 30 seconds)
				log.info("Resending OTP after " + resumeConfig.getResendOtpAfter() + " seconds");
				if (ibpsService.sendEmail(request.getArn(), OTP_EMAIL_TEMPLATE, procedureResponse.getOtpDetail().getOtp())) {
					log.info("An email with OTP sent");					
				} else {
					log.info("OTP email sending failed");
				}
			}*/
			if (duration.getSeconds() > resumeConfig.getResendOtpAfter()) {
				searchCustomer(request);
				response = new ClientResponseDTO<>(true, true, HttpStatus.OK.value(), null);
			} else {
				List<String> errorList = new ArrayList<>();
				errorList.add("One Time Password creation not allowed at this time. Please try after some time!");
				
				response = new ClientResponseDTO<>(false, true, HttpStatus.NOT_ACCEPTABLE.value(),errorList );
			}			
		}
		return response;
	}

	private Boolean validateOTP(ProcedureCallDataDTO procedureResponse) {
		// ClientResponseDTO<Boolean> response;
		boolean isValid = false;
		try {
			log.info("Inside validateOTP()");
			String otpCreatedOn = procedureResponse.getOtpDetail().getCreatedOn();
			// LocalDateTime otpCreationTime = LocalDateTime.parse(otpCreatedOn, formatter); 2020-12-9 20:50:3.760
			String[] arrDt = otpCreatedOn.split("-");
			// LocalDateTime otpCreationTime = LocalDateTime.of(2020, 12, 9, 20, 50, 3, 760);
			LocalDateTime otpCreationTime = LocalDateTime.of(Integer.valueOf(arrDt[0]), Integer.valueOf(arrDt[1]),
					Integer.valueOf(arrDt[2]), Integer.valueOf(arrDt[3]), Integer.valueOf(arrDt[4]),
					Integer.valueOf(arrDt[5]), Integer.valueOf(arrDt[6]));
			log.info("OTP creation time: {}", otpCreationTime);
			Duration duration = Duration.between(otpCreationTime, LocalDateTime.now());
			log.info("OTP duration: {}", duration.getSeconds());
			if (isOTPExpired(duration)) {
				log.info("OTP is Expired");
				// String error = "OTP you have entered has expired.";
				// response = new ClientResponseDTO<>(false, true,
				// HttpStatus.BAD_REQUEST.value(), error);
				isValid = false;
			} else {
				ibpsService.updateOtpFlag("NG_RESUME_SaveOTPDetails",
						procedureResponse.getOtpDetail().getArn());
				log.info("OTP is valid");
				// response = new ClientResponseDTO<>(true, true,
				// HttpStatus.OK.value(), null);
				isValid = true;
			}
		} catch (Exception ex) {
			log.info("Exception occured in validateOTP(): {}", ex);
			throw ex;
		}
		return isValid;
	}

	private boolean isOTPExpired(Duration d) {
		return d.getSeconds() > resumeConfig.getOtpValidFor().longValue();
	}
}
