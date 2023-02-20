package com.jmmb.los.pb.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicantAddInfoDTO {
    private boolean isMeetingRequirements;
    private List<SecurityQuestionsDTO> securityQuestions;
}
