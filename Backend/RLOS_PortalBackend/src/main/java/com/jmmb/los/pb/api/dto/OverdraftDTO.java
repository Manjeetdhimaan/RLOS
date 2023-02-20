package com.jmmb.los.pb.api.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OverdraftDTO {
	private Long id;
	private String overdraftRequiredFor;
	private String overdraftPurpose;
	private String overdraftPurposeLabel;
	private String otherOverdraftPurpose;
	private String order;
	private String applicantOrder;
	// private String overdraftName;
}