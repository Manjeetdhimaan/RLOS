package com.jmmb.los.pb.api.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.api.dto.MasterDataDTO;
import com.jmmb.los.pb.service.LookupService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping(value = "/api/lookup", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@Api(tags = { "Lookup" })
@Validated
@Slf4j
public class LookUpController {

	@Autowired
	LookupService lookupService;

	@ApiOperation(value = "Get lookup data for a account product")
	@GetMapping(value = "/master")
	public ResponseEntity<ClientResponseDTO<MasterDataDTO>> getLookupData(){
		log.info("Inside look up call for mdm data");
		ClientResponseDTO<MasterDataDTO> res = new ClientResponseDTO<>();
		try {
			MasterDataDTO lookupData = lookupService.getlookupMdmData();
			res.setData(lookupData);
			res.setSuccess(true);
			res.setStatusCode(HttpStatus.OK.value());
			log.info("Exiting getLookupData method!!!");
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
	}
}
