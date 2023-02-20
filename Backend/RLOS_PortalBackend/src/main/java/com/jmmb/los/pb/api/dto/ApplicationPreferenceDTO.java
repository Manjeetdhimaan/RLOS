package com.jmmb.los.pb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import io.swagger.annotations.ApiModel;
import lombok.Data;

@ApiModel(value = "Preference")
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApplicationPreferenceDTO {
	private String lastVisitedPage;
	private String visitorIP;
	private String status;
}
