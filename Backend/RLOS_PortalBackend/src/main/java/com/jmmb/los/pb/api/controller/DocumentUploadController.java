package com.jmmb.los.pb.api.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;
import javax.validation.constraints.NotNull;

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

import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.api.dto.DocUploadDTO;
import com.jmmb.los.pb.documentupload.DocumentUploadService;
import com.fasterxml.jackson.core.JsonProcessingException;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(value = "Document Related API", tags = {
		"Document" }, produces = MediaType.APPLICATION_JSON_UTF8_VALUE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
@RestController
// @RequestMapping(value = "/api/applications/{arn}/applicants/{applicantId}",
// produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@RequestMapping(value = "/api/applications/{arn}", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@Validated
public class DocumentUploadController {

	@Autowired
	private DocumentUploadService documentUploadService;

	@ApiOperation(value = "Upload documents related to an application")
	@ApiResponses(value = { @ApiResponse(code = 200, message = "Document uploaded successfully!"),
			@ApiResponse(code = 500, message = "Internal Server Error") })
	@PostMapping(value = "/document/upload", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ClientResponseDTO<DocUploadDTO>> uploadDocument(@NotNull final @PathVariable String arn,
			final @RequestBody DocUploadDTO request) throws JsonProcessingException {
		log.debug("Received request to upload documents for workItem - {}", arn);
		ClientResponseDTO<DocUploadDTO> res = new ClientResponseDTO<DocUploadDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<DocUploadDTO>> violations = validator.validate(request);
		if(violations.isEmpty()) {			
			try {
				DocUploadDTO result = documentUploadService.uploadToOD(request, arn);
				if(result.isError()){
					List<String> errorList = new ArrayList<>();
					errorList.add("Document is corrupted");
					res.setErrorMessageList(errorList);
					res.setSuccess(false);
					res.setStatusCode(HttpStatus.BAD_REQUEST.value());
					return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
					
				}
				else{}
				log.debug("Document updloaded with docIndex- {} for workItem - {}", result.getDocIndex(), arn);
				res.setData(result);
				res.setSuccess(true);
				res.setStatusCode(HttpStatus.CREATED.value());
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
			for (ConstraintViolation<DocUploadDTO> violation : violations) {
				log.error(violation.getMessage());
				errorList.add(violation.getMessage());
			}
			res.setErrorMessageList(errorList);
			res.setSuccess(false);
			res.setStatusCode(HttpStatus.BAD_REQUEST.value());
			return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
		}
	}

	@ApiOperation(value = "Download documents related to an application")
	@PostMapping(value = "/document/download", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<ClientResponseDTO<DocUploadDTO>> downloadDocument(@NotNull final @PathVariable String arn,
			final @RequestBody DocUploadDTO request) throws JsonProcessingException {
		log.debug("Received request to download documents for workItem - {}", arn);		
		//return ResponseEntity.ok(result);
		
		ClientResponseDTO<DocUploadDTO> res = new ClientResponseDTO<DocUploadDTO>();
		ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
		Validator validator = factory.getValidator();
		Set<ConstraintViolation<DocUploadDTO>> violations = validator.validate(request);
		if(violations.isEmpty()) {			
			try {
				DocUploadDTO result = documentUploadService.downloadFromOD(request, arn);
				log.debug("Document downloaded for docIndex- {} for workItem - {}", result.getDocIndex(), arn);
				res.setData(result);
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
			for (ConstraintViolation<DocUploadDTO> violation : violations) {
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
