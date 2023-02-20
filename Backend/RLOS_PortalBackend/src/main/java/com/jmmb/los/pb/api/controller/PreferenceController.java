package com.jmmb.los.pb.api.controller;

import java.util.ArrayList;
import java.util.List;
import javax.validation.constraints.NotNull;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jmmb.los.pb.api.dto.ApplicationPreferenceDTO;
import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.service.PreferenceService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Api(value = "Preference API", tags = { "Preference" })
@RestController
@RequestMapping(value = "/api/applications", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class PreferenceController {

	@Autowired
	private PreferenceService service;

	@ApiOperation(value = "Create Application Preference for Auditing")
	@ApiResponses(value = { @ApiResponse(code = 201, message = "Application Preference Created."),
			@ApiResponse(code = 500, message = "Internal server error") })
	//@PostMapping(value = "/PREFERENCES/{arn}/{save}", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	@PostMapping(value = "/{arn}/PREFERENCES/{save}", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public ResponseEntity<ClientResponseDTO<ApplicationPreferenceDTO>> createPreference(
			@NonNull @RequestBody final ApplicationPreferenceDTO preferenceDTO,
			@NotNull @PathVariable("arn") final String arn, @NotNull @PathVariable("save") final boolean saveAndExit) {
		log.debug("Invoking createPreference method in PreferenceController");
		log.debug("Request Params for createPreference method: PreferenceDTO-> " + preferenceDTO + ", arn->" + arn);		
		//return Objects.isNull(preferencePersisted) ? (new ResponseEntity<>(HttpStatus.NO_CONTENT))
		//		: new ResponseEntity<>(preferencePersisted, HttpStatus.CREATED);
		
		ClientResponseDTO<ApplicationPreferenceDTO> res = new ClientResponseDTO<ApplicationPreferenceDTO>();		
		try {
			final ApplicationPreferenceDTO preferencePersisted = service.savePreference(preferenceDTO, arn, saveAndExit, false);
			log.debug("Exiting createPreference method in PreferenceController");
			res.setData(preferencePersisted);
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
	}
}