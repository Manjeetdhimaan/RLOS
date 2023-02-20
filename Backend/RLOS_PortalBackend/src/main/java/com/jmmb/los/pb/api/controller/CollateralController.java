package com.jmmb.los.pb.api.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.service.CollateralService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(value = "Collateral API", tags = {
		"Collateral" }, produces = MediaType.APPLICATION_JSON_UTF8_VALUE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
@Validated
@RestController
@RequestMapping(value = "/api/applications/{arn}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class CollateralController {

	@Autowired
	CollateralService service;

	@ApiOperation(value = "Create and Update Collateral details API")
	@PostMapping(value = "/collateral")
	public ResponseEntity<ClientResponseDTO<ApplicationDTO>> saveCollateralDetails(@NonNull @PathVariable(name = "arn") final String arn,
			@NonNull @RequestBody final ApplicationDTO application) {
		log.info("Invoking saveCollateralDetails method in CollateralController with params {}", application);		
		ClientResponseDTO<ApplicationDTO> res = new ClientResponseDTO<ApplicationDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicationDTO>> violations = validator.validate(application);
		if(violations.isEmpty()) {			
			try {
				final ApplicationDTO applicationPersisted = service.processCollaterals(application, arn);
				log.info("Exiting saveCollateralDetails method in CollateralController...");
				res.setData(applicationPersisted);
				res.setSuccess(true);
				res.setStatusCode(HttpStatus.OK.value());
				return new ResponseEntity<>(res, HttpStatus.OK);
			} catch(Exception ex) {
				log.info(ex.toString());
				res.setSuccess(false);
				List<String> errorList = new ArrayList<>();
				errorList.add("Some error occured, please contact support");
				res.setStatusCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
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

}