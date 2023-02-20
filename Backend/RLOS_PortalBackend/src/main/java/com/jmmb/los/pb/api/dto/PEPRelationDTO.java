package com.jmmb.los.pb.api.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class PEPRelationDTO {
	private Long id;
	
	@Size(max = 20, message = "First Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in First Name")
	private String firstName;
	
	@Size(max = 20, message = "Middle Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Middle Name")
	private String middleName;
	
	@Size(max = 20, message = "Last Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Last Name")
	private String lastName;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Date of Birth must be in YYYY-MM-DD Format")
	private String dob;
	
	@Size(max = 20, message = "Relationship cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9\\s]*$", message = "Invalid characters found in Relationship")
	private String relationship;
}
