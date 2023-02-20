package com.los.pb.resume.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.los.pb.resume.config.*;
import com.los.pb.resume.dto.ClientResponseDTO;;

@RestController
@Slf4j
@Api(tags = { "Resume" })
@CrossOrigin
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
public class ConfigController {
	@Autowired
    private ResumeConfig details;
    @ApiOperation(value = "Get config details")
    @GetMapping(value = "/config")
    public ResponseEntity<ClientResponseDTO<ResumeConfig>> getConfigDetails() {
        log.info("In ConfigCallController, returning MasterConfigDetail {}", details);
        ClientResponseDTO<ResumeConfig> res = new ClientResponseDTO<ResumeConfig>();
        res.setData(details);
        res.setSuccess(true);
        res.setStatusCode(HttpStatus.OK.value());
        //return ResponseEntity.ok(details);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
