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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jmmb.los.pb.api.dto.ApplicantDTO;
import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.service.ApplicantService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(value = "Applicant API", tags = {
        "Applicant" }, produces = MediaType.APPLICATION_JSON_UTF8_VALUE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
@Validated
@RestController
@RequestMapping(value = "/api/applications/{arn}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class ApplicantController {

    @Autowired
    ApplicantService service;

    @ApiOperation(value = "Create/Update Applicant(s)")
    @PostMapping(value = "/applicants")
    public ResponseEntity<ClientResponseDTO<ApplicantDTO>> processApplicants(@NonNull @PathVariable(name = "arn") final String arn,
            @NonNull @RequestParam(name = "context") String context,
            @NonNull @RequestBody final ApplicantDTO applicantDTO) {
        log.info("Starting processApplicants method in ApplicantController for WorkItem {}, context {} and requestBody {}", 
                arn, context, applicantDTO);        
        ClientResponseDTO<ApplicantDTO> res = new ClientResponseDTO<ApplicantDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<ApplicantDTO>> violations = validator.validate(applicantDTO);
		if(violations.isEmpty()) {			
			try {
				final ApplicantDTO applicant = service.processApplicants(applicantDTO, arn,context);
			    log.info("Exiting processApplicants method in ApplicantController for workItem {}", arn);
				res.setData(applicant);
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
			for (ConstraintViolation<ApplicantDTO> violation : violations) {
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
