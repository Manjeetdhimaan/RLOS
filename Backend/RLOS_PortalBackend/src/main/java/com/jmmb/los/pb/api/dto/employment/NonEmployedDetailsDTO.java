package com.jmmb.los.pb.api.dto.employment;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import lombok.Data;

@Data
public class NonEmployedDetailsDTO {
	@Size(max = 30, message = "Name of the Person Funding the Account cannot be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Name of the Person Funding the Account")
	private String fundingPerson;
	
	@Size(max = 30, message = "Relationship to Applicant cannot be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Relationship to Applicant")
	private String relationshipWithApplicant;
	
	@Size(max = 3, message = "Is funding person an existing customer at Commonwealth Bank? length cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Is funding person an existing customer at Commonwealth Bank?")
	private String isFundingPersonAnExistingCustomer;// Yes,No
}
