package com.los.pb.resume.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.los.pb.resume.dto.ApplicationDetailsDTO;
import com.los.pb.resume.dto.ClientResponseDTO;
import com.los.pb.resume.dto.SearchCustomerRequest;
import com.los.pb.resume.facade.ResumeServiceImpl;
import com.los.pb.resume.util.ApplicationTokenProvider;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@Api(tags = { "Resume" })
@CrossOrigin
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class ResumeController {

	@Autowired
	private ResumeServiceImpl resumeService;
	
	@Autowired
	private ApplicationTokenProvider tokenService;

	@ApiOperation(value = "Api to Search Customer based on the search criteria.")
	@PostMapping("/searchCustomer")	
	public ResponseEntity<ClientResponseDTO<Boolean>> searchCustomer(
			@ApiParam(name = "RequestBody", value = "The request body in json format", required = true) @RequestBody(required = true) SearchCustomerRequest request) {
		log.info("Request Params for searchCustomer is: " + request);
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<SearchCustomerRequest>> violations = validator.validate(request);
		ClientResponseDTO<Boolean> response;
		if(violations.isEmpty()) {
			response = resumeService.searchCustomer(request);
			return ResponseEntity.ok(response);
		} else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<SearchCustomerRequest> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			response = new ClientResponseDTO<Boolean>();
			response.setErrorMessageList(errorList);
			response.setSuccess(false);
			response.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}		 
		
	}

	@ApiOperation(value = "Api to Verify provided OTP.")
	@PostMapping("/verifyOTP")
	public ResponseEntity<ClientResponseDTO<ApplicationDetailsDTO>> verifyOTP(
			@ApiParam(name = "RequestBody", value = "The request body in json format", required = true) @RequestBody(required = true) SearchCustomerRequest request
			,HttpServletRequest servletRequest, HttpServletResponse responseHTTP) {
		log.info("Request Params for verifyOTP is: " + request);
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<SearchCustomerRequest>> violations = validator.validate(request);
		ClientResponseDTO<ApplicationDetailsDTO> response ;
		
		if(violations.isEmpty()) {
			response = resumeService.verifyOTP(request);
			String token = tokenService.generateToken(request.getArn(),servletRequest.getRemoteAddr());
			if(token != null){
				responseHTTP.setHeader("Access-Control-Expose-Headers", "authentication");
				responseHTTP.setHeader("authentication", token);
			}
			return ResponseEntity.ok(response);
		}else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<SearchCustomerRequest> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			response = new ClientResponseDTO<ApplicationDetailsDTO>();
			response.setErrorMessageList(errorList);
			response.setSuccess(false);
			response.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}	
	}

	@ApiOperation(value = "Api to Resend OTP.")
	@PostMapping("/resendOTP")
	public ResponseEntity<ClientResponseDTO<Boolean>> resendOTP(
			@ApiParam(name = "RequestBody", value = "The request body in json format", required = true) @RequestBody(required = true) SearchCustomerRequest request) {
		log.info("Request Params for resendOTP is: " + request);
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<SearchCustomerRequest>> violations = validator.validate(request);
		ClientResponseDTO<Boolean> response ; 
		if(violations.isEmpty()) {
			response = resumeService.resendOTP(request);
			return ResponseEntity.ok(response);	
		}else {
			log.info("Invalid data from portal");
			List<String> errorList = new ArrayList<>();
			for (ConstraintViolation<SearchCustomerRequest> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			response = new ClientResponseDTO<Boolean>();
			response.setErrorMessageList(errorList);
			response.setSuccess(false);
			response.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}	
		
		
	}

}
