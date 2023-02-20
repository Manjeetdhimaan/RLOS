package com.jmmb.los.pb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentDetailsDTO {
	private Long id;
	@JsonProperty("order")
	private Long applicantId;
	private String applicantType;
	@JsonProperty("documentName")
	private String documentType;
	private String uploadDate;
	private String docIndex;
	private boolean justUploaded;
}
