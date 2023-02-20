package com.jmmb.los.pb.api.dto;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class PEPDetailsDTO {
	private Long id;
	
	@Size(max = 20, message = "Are you a Politically Exposed Person? cannot be more than 20 characters")
	@Pattern(regexp = "^^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Are you a Politically Exposed Person?")
	private String pepFlag;// Yes, No
	
	@Size(max = 3, message = "Previously a Politically Exposed Person? cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Previously a Politically Exposed Person?")
	private String previousPep; // Yes, No
	
	@Size(max = 3, message = "PEP Relation cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in PEP Relation")
	private String pepRelation;
	
	@Size(max = 20, message = "First Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in First Name")
	private String pepFirstName;
	
	@Size(max = 20, message = "Middle Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Middle Name")
	private String pepMiddleName;
	
	@Size(max = 20, message = "Last Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Last Name")
	private String pepLastName;
	
	@Size(max = 10, message = "Suffix cannot be more than 10 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Suffix")
	private String pepSuffix;
	
	@Size(max = 10, message = "Country of PEP cannot be more than 10 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid character in Country of PEP")
	private String pepCountry;
	
	@Size(max = 20, message = "Position Title cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Position Title")
	private String positionTitle;
	
	@Size(max = 50, message = "Details of Position Held cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Details of Position Held")
	private String detailsOfPositonHeld;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Date Appointed to Position must be in YYYY-MM-DD Format")
	private String dateAddedToPepList;
	
	@Size(max = 3, message = "Years in Position can not  be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Years in Position")
	private String yearsInPosition;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Date Removed from PEP List must be in YYYY-MM-DD Format")
	private String dateRemovedFromPep;
	
	private String pepRelationLabel;
	
	@Valid
	private List<PEPRelationDTO> relationshipDetails;
}
