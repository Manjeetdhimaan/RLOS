package com.jmmb.los.pb.api.dto;

import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class IncomeDetailsDTO {

	private Long id;
	// private Long applicantId;
	// private String type;
	// private String frequency;
	// private String comment;
	// private String amount;

	//private String empType;
	@Size(max = 20, message = "Income Type cannot be more than 20 characters")
	private String incomeType;
	
	private Double amount;
	
	@Size(max = 20, message = "Frequency cannot be more than 20 characters")
	private String frequency;
	
	private Double income;
	
	@Size(max = 50, message = "Comments cannot be more than 50 characters")
	private String comment;
	
	private Double monthlyIncome;
	
	private boolean primarySourceOfIncome;

}
