package com.jmmb.los.pb.api.dto;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CreditCardDTO {
	private Long id;
	private String cardsRequiredFor;
	private String cardType;
	private String cardTypeLabel;
	private String branch;
	private String branchLabel;
	private String order;
	private String applicantOrder;	
}
