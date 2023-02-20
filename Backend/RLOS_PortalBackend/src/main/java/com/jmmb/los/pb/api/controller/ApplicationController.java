package com.jmmb.los.pb.api.controller;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.Map.Entry;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.Valid;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.jmmb.los.pb.api.dto.ApplicantDTO;
import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.jmmb.los.pb.api.dto.AppointmentDTO;
import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.api.dto.OtpDetailsDTO;
import com.jmmb.los.pb.api.dto.PortalResponse;
import com.jmmb.los.pb.api.dto.ValidateResponseDTO;
import com.jmmb.los.pb.security.ApplicationEntryPoint;
import com.jmmb.los.pb.service.ApplicationService;
import com.jmmb.los.pb.service.ApplicationTransformService;
import com.jmmb.los.pb.util.InvalidTokenUtil;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(value = "Application API", tags = { "Application" })
@RestController
@RequestMapping(value = "/api/applications", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@Validated
public class ApplicationController {

	@Autowired
	private ApplicationService service;

	@Autowired
	private ApplicationTransformService applicationService;
	
	private final InvalidTokenUtil tokenUtil;
	
	@Autowired
	public ApplicationController (@NonNull final InvalidTokenUtil tokenUtil ){
		this.tokenUtil = tokenUtil;
	}

	@ApiOperation(value = "Refresh Token for Application")
	@ApiResponses(value = { @ApiResponse(code = 201, message = "Refresh Token created."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@PostMapping(value = "/{arn}/refreshToken", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<PortalResponse> refreshToken(@Valid @Pattern(regexp = "^(RLN)-([0-9]{10})$", message = "Valid arn format is RLN-000000xxxx") @NotNull @PathVariable String arn, HttpServletRequest request,
			HttpServletResponse response) {
		
		log.info("Invoking refreshToken method in ApplicationController...");
		log.debug("Params for refreshToken is: arn->" + arn);
		int count = 0;
		String token = request.getHeader("authentication");
		Map<String, LocalDateTime> invaliTokenMap = tokenUtil.getInvalidTokenMap();
		
		if (!Objects.isNull(invaliTokenMap)) {
			for (Entry<String, LocalDateTime> e : invaliTokenMap.entrySet()) {
				if (e.getKey() == token) {
					count++;
				}	
		}
			}
		if(count>0){
			PortalResponse portal = new PortalResponse();
			portal.setStatus("Decline");
			return new ResponseEntity<>(portal,HttpStatus.BAD_REQUEST);		
		}
		else{
			PortalResponse portal = new PortalResponse();
			portal.setStatus("Success");

			return ResponseEntity.ok(portal);
		}	
	}

	@ApplicationEntryPoint
	@ApiOperation(value = "Create Application IBPS")
	@ApiResponses(value = { @ApiResponse(code = 201, message = "Application Successfully created."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@PostMapping(value = "/createApplication", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	// public ResponseEntity<ApplicationDTO> createApplication1(@NotNull
	// @RequestBody final ApplicationDTO applicationDTO, @NonNull
	// @RequestParam(name = "context") String context)
	public ResponseEntity<ClientResponseDTO<ApplicationDTO>> createApplication(@NotNull @RequestBody final ApplicationDTO applicationDTO) {
		log.debug("Params for createApplication is: ApplicationDTO->" + applicationDTO);
		// final ApplicationDTO applicationPersistedDTO =
		// service.createApplication(applicationDTO,context);
		ClientResponseDTO<ApplicationDTO> res = new ClientResponseDTO<ApplicationDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()) {			
			try {
				ApplicantDTO apDTO = applicationDTO.getApplicants().get(0);
				String otp = applicationDTO.getOtp();
				String email = apDTO.getEmail();
				OtpDetailsDTO otpDetails = service.fetchOtp(otp, email);
				if(!Objects.isNull(otpDetails)){
					String status = otpDetails.getFlag();
					String otpCreateTime = otpDetails.getCreatedOn();
					SimpleDateFormat simpleDateFormat= new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					Date dateOtp = simpleDateFormat.parse(otpCreateTime);
					Date date = new Date();
					long d = (date.getTime() - dateOtp.getTime())/(60*1000);
					if(d<7 && status.equalsIgnoreCase("VERIFIED")){
						final ApplicationDTO applicationPersistedDTO = service.createApplication(applicationDTO);
						res.setData(applicationPersistedDTO);
						res.setSuccess(true);
						res.setStatusCode(HttpStatus.CREATED.value());
						return new ResponseEntity<>(res, HttpStatus.OK);
					}
					else{
						res.setSuccess(false);
						List<String> errorList = new ArrayList<>();
						errorList.add("OTP not Valid");
						res.setErrorMessageList(errorList);
						res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
						return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
					}
				}
				else{
					res.setSuccess(false);
					List<String> errorList = new ArrayList<>();
					errorList.add("OTP not Valid");
					res.setErrorMessageList(errorList);
					res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
					return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
					
				}
				
			} catch(Exception ex) {
				log.info(ex.toString());
				res.setSuccess(false);
				List<String> errorList = new ArrayList<>();
				errorList.add("Some error occured, please contact support");
				res.setErrorMessageList(errorList);
				res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
				return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			res.setErrorMessageList(errorList);
			res.setSuccess(false);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}
	}

	@ApiOperation(value = "Dedupe Check for Loan Applications")
	@ApiResponses(value = { @ApiResponse(code = 201, message = "Dedupe Check Successful."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@PostMapping(value = "/validateApplication", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<ValidateResponseDTO>> validateApplication(
			@NotNull @RequestBody final ApplicationDTO applicationDTO) {
		log.debug("Params for validateApplication is: ApplicationDTO->" + applicationDTO);
		ClientResponseDTO<ValidateResponseDTO> res = new ClientResponseDTO<ValidateResponseDTO>(); 
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()){
			final ValidateResponseDTO validateDTO = service.validateApplication(applicationDTO);
			res.setData(validateDTO);
			
			res.setSuccess(true);
			res.setStatusCode(HttpStatus.OK.value());
			return new ResponseEntity<>(res, HttpStatus.OK);			
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
				
			}
			//ValidateResponseDTO validateDTO = new ValidateResponseDTO();
			//validateDTO.setErrorList(errorList);
			res.setSuccess(false);
			res.setErrorMessageList(errorList);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}
	}
	
	@ApiOperation(value = "Verify OTP to validate provided email id")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "OTP Authentication Successful."),
			@ApiResponse(code = 500, message = "Internal server error"),
			@ApiResponse(code = 404, message = "One Time Password is incorrect"),
			@ApiResponse(code = 400, message = "One Time Password you have entered has expired.")})
	@PostMapping(value = "/verifyOTP", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<Boolean>> verifyOTP(
			@NotNull @RequestBody final ApplicationDTO applicationDTO) {
		log.debug("Params for verifyOTP is: ApplicationDTO->" + applicationDTO);
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()){
			final ClientResponseDTO<Boolean> validateDTO = service.verifyOTP(applicationDTO);
			return new ResponseEntity<>(validateDTO, HttpStatus.OK);			
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			ClientResponseDTO<Boolean> validateDTO = new ClientResponseDTO<Boolean>(null, false, HttpStatus.BAD_REQUEST.value(), errorList);
			return new ResponseEntity<>(validateDTO, HttpStatus.BAD_REQUEST);
		}
	}
	
	@ApiOperation(value = "Api to Resend OTP.")
	@PostMapping(value = "/resendOTP", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<Boolean>> resendOTP(@NotNull @RequestBody final ApplicationDTO applicationDTO) {
		log.debug("Params for verifyOTP is: ApplicationDTO->" + applicationDTO);
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()){
			final ClientResponseDTO<Boolean> validateDTO = service.resendOTP(applicationDTO);
			return new ResponseEntity<>(validateDTO, HttpStatus.OK);			
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			ClientResponseDTO<Boolean> validateDTO = new ClientResponseDTO<Boolean>(null, false, HttpStatus.BAD_REQUEST.value(), errorList);
			return new ResponseEntity<>(validateDTO, HttpStatus.BAD_REQUEST);
		}
	}

	@ApiOperation(value = "Save Consent")
	@ApiResponses(value = { @ApiResponse(code = 201, message = "Consent saved."),
			@ApiResponse(code = 500, message = "Internal server error") })
	//@PostMapping(value = "/saveConsent", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	@PostMapping(value = "/{arn}/saveConsent", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<ApplicationDTO>> saveConsent(@NotNull @PathVariable String arn, @NotNull @RequestBody final ApplicationDTO applicationDTO,
			HttpServletRequest request, HttpServletResponse response) {
		log.debug("Params for saveConsent is: ApplicationDTO->" + applicationDTO);
		ClientResponseDTO<ApplicationDTO> res = new ClientResponseDTO<ApplicationDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()) {
			try {
				final ApplicationDTO applicationDto = service.saveConsent(applicationDTO);
				res.setData(applicationDto);
				res.setSuccess(true);
				res.setStatusCode(HttpStatus.OK.value());
				return new ResponseEntity<>(res, HttpStatus.OK);
			
			}catch(Exception ex) {
				
				log.info(ex.toString());
				res.setSuccess(false);
				List<String> errorList = new ArrayList<>();
				errorList.add("Some error occured, please contact support");
				res.setErrorMessageList(errorList);
				res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
				return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			res.setErrorMessageList(errorList);
			res.setSuccess(false);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}		
	}

	@ApiOperation(value = "Add financial Information")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Financial Information added."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@PostMapping(value = "/{arn}/addFinancialInfo", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<ApplicationDTO>> addFinancialInfo(@NotNull @PathVariable String arn, @NotNull @RequestBody final ApplicationDTO applicationDTO) {
		log.debug("Params for addFinancialInfo is: ApplicationDTO->" + applicationDTO);
		ClientResponseDTO<ApplicationDTO> res = new ClientResponseDTO<ApplicationDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()) {
			try {
				final ApplicationDTO applicationPersistedDTO = service.addFinancialInfo(applicationDTO);
				res.setData(applicationPersistedDTO);
				res.setSuccess(true);
				res.setStatusCode(HttpStatus.OK.value());
				return new ResponseEntity<>(res, HttpStatus.OK);
			} catch(Exception ex) {
				log.info(ex.toString());
				res.setSuccess(false);
				List<String> errorList = new ArrayList<>();
				errorList.add("Some error occured, please contact support");
				res.setErrorMessageList(errorList);
				res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
				return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			res.setErrorMessageList(errorList);
			res.setSuccess(false);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}
	}

	@ApiOperation(value = "Add uploaded documents information")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Documents Information added."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@PostMapping(value = "/{arn}/submitDocuments", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<ApplicationDTO>> submitDocuments(@NotNull @PathVariable String arn, @NotNull @RequestBody final ApplicationDTO applicationDTO) {
		log.debug("Params for submitDocuments is: ApplicationDTO->" + applicationDTO);
		ClientResponseDTO<ApplicationDTO> res = new ClientResponseDTO<ApplicationDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()) {
			try {
				final ApplicationDTO applicationPersistedDTO = service.submitDocuments(applicationDTO);
				res.setData(applicationPersistedDTO);
				res.setSuccess(true);
				res.setStatusCode(HttpStatus.OK.value());
				return new ResponseEntity<>(res, HttpStatus.OK);
			} catch(Exception ex) {
				log.info(ex.toString());
				res.setSuccess(false);
				List<String> errorList = new ArrayList<>();
				errorList.add("Some error occured, please contact support");
				res.setErrorMessageList(errorList);
				return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			res.setErrorMessageList(errorList);
			res.setSuccess(false);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}
	}
	
	@ApiOperation(value = "Update uploaded documents information")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Documents Information updated."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@PostMapping(value = "/{arn}/updateDocuments", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<ApplicationDTO>> updateDocuments(@NotNull @PathVariable String arn, @NotNull @RequestBody final ApplicationDTO applicationDTO) {
		log.debug("Params for updateDocuments is: ApplicationDTO->" + applicationDTO);
		ClientResponseDTO<ApplicationDTO> res = new ClientResponseDTO<ApplicationDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(applicationDTO);
		if(violations.isEmpty()) {
			try {
				final ApplicationDTO applicationPersistedDTO = service.updateDocuments(applicationDTO);
				res.setData(applicationPersistedDTO);
				res.setSuccess(true);
				res.setStatusCode(HttpStatus.OK.value());
				return new ResponseEntity<>(res, HttpStatus.OK);
			} catch(Exception ex) {
				log.info(ex.toString());
				res.setSuccess(false);
				List<String> errorList = new ArrayList<>();
				errorList.add("Some error occured, please contact support");
				res.setErrorMessageList(errorList);
				res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
				return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<ApplicationDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			res.setErrorMessageList(errorList);
			res.setSuccess(false);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}
	}

	@ApiOperation(value = "Trigger appointment email")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Appointment email sent."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@PostMapping(value = "/{arn}/scheduleAppointment", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<Integer>> scheduleAppointment(@NotNull @PathVariable String arn, @NotNull @RequestBody final AppointmentDTO appointment) {
		log.debug("Params for scheduleAppointment() is: AppointmentDTO->" + appointment);
		ClientResponseDTO<Integer> res = new ClientResponseDTO<Integer>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<AppointmentDTO>> violations = validator.validate(appointment);
		if(violations.isEmpty()) {
			try {
				final int status = service.scheduleAppointment(appointment);			
				res.setData(status);
				res.setSuccess(true);
				res.setStatusCode(HttpStatus.OK.value());
				return new ResponseEntity<>(res, HttpStatus.OK);
			} catch(Exception ex) {
				log.info(ex.toString());
				res.setSuccess(false);
				List<String> errorList = new ArrayList<>();
				errorList.add("Some error occured, please contact support");
				res.setErrorMessageList(errorList);
				res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
				return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
			}
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<AppointmentDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			res.setErrorMessageList(errorList);
			res.setSuccess(false);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}
	}

	@ApplicationEntryPoint
	@ApiOperation(value = "Get Application")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Application successfully retrieved."),
			@ApiResponse(code = 204, message = "Application Not Present."),
			@ApiResponse(code = 500, message = "Internal server error") })
	@GetMapping(value = "/getApplication//{arn}")
	public ResponseEntity<ClientResponseDTO<ApplicationDTO>> getApplication(@Valid @Pattern(regexp = "^(RLN)-([0-9]{10})$", message = "Valid arn format is RLN-000000xxxx") @NotNull @PathVariable("arn") final String arn,
			HttpServletRequest requestHttp,
			HttpServletResponse responseHttp) {
		log.info("Invoking getApplication method in ApplicationController...");
		log.debug("Params for getApplication are: arn->" + arn);
		ClientResponseDTO<ApplicationDTO> res = new ClientResponseDTO<ApplicationDTO>();
		try {
			String token = requestHttp.getHeader("authentication");
			boolean isValidToken = tokenUtil.tokenValidator(token,requestHttp,responseHttp);
			if(isValidToken){
			ApplicationDTO applicationDto = applicationService.getApplicationUsingArn(arn);
			res.setData(applicationDto);
			res.setSuccess(Objects.isNull(applicationDto) ? false : true);
			res.setStatusCode(HttpStatus.OK.value());
			log.info("Exiting getApplication method in ApplicationController...");
			return new ResponseEntity<>(res, HttpStatus.OK);
		}
			else{
				res.setStatusCode(HttpStatus.FORBIDDEN.value());
				return new ResponseEntity<>(res, HttpStatus.FORBIDDEN);	
					
			}
		}
			catch(Exception ex) {
			log.info(ex.toString());
			res.setSuccess(false);
			List<String> errorList = new ArrayList<>();
			errorList.add("Some error occured, please contact support");
			res.setErrorMessageList(errorList);
			res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
			return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
		}		
	}

}
