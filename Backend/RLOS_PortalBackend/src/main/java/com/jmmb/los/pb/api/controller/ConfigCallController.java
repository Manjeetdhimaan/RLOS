package com.jmmb.los.pb.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jmmb.los.pb.api.dto.ClientResponseDTO;
import com.jmmb.los.pb.config.MasterConfigDetail;

import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping(value = "/api", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@Validated
public class ConfigCallController {

    @Autowired
    private MasterConfigDetail details;
    @ApiOperation(value = "Get config details")
    @GetMapping(value = "/master/config")
    public ResponseEntity<ClientResponseDTO<MasterConfigDetail>> getMasterConfigDetails() {
        log.info("In ConfigCallController, returning MasterConfigDetail {}", details);
        ClientResponseDTO<MasterConfigDetail> res = new ClientResponseDTO<MasterConfigDetail>();
        res.setData(details);
        res.setSuccess(true);
        res.setStatusCode(HttpStatus.OK.value());
        //return ResponseEntity.ok(details);
        return new ResponseEntity<>(res, HttpStatus.OK);
    }
}
