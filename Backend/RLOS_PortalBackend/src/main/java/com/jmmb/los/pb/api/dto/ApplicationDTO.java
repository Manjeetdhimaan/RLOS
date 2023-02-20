package com.jmmb.los.pb.api.dto;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Validated
public class ApplicationDTO {
	private String otp;
	
	@Size(max = 18)
	@Pattern(regexp = "^(RLN)-([0-9]{10})$", message = "Valid arn format is RLN-000000xxxx")
	private String arn;
	
	private ApplicationPreferenceDTO preferences;
	private ApplicantAddInfoDTO additionalInfo;
	private String loanName;
	
	@Size(max = 2, message = "Branch code cannot be more than 2 characters")
	//@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in branch code")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in branch code")
	private String branchCode;
	
	@Size(max = 200, message = "Branch Name cannot be more than 200 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in branch name")
	private String branchName;
	
	@Valid
	private List<ApplicantDTO> applicants;
	
	@Valid
	private LoanDetailsDTO loanDetails;
	private List<DocumentDetailsDTO> documents;
	
	private Boolean consent;
	
	@Size(max = 200, message = "Remarks cannot be more than 200 characters")
	private String cutomerRemarks;
	
	@Size(max = 20, message = "Referral code cannot be more than 20 characters")
	private String referralSource;

	//private List<String> errorList;
	// old
	// private Long id;
	// private String arn;
	// private String workItemNumber;
	// private ApplicantAddInfoDTO additionalInfo;
	// private List<ApplicantDTO> applicants;
	// private LoanDetailsDTO loanDetails;
	// private String branchCode;
	// private ApplicationPreferenceDTO preferences;

}
