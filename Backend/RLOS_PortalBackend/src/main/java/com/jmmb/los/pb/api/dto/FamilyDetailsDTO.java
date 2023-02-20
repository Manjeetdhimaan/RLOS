package com.jmmb.los.pb.api.dto;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class FamilyDetailsDTO {
	private Long id;
	//private String noOfDependent;
	@Size(max = 40, message = "Father Name cannot be more than 40 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z`@_,.'\\s]*$", message = "Invalid characters found in Father Name")
	private String fatherName;
	
	@Size(max = 40, message = "Father's Employer Name cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Father's Employer Name")
	private String employerName;
	
	@Size(max = 200, message = "Father's Residential Address cannot be more than 200 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Father's Residential Address")
	private String residentialAddress;
	
	@Size(max = 14, message = "Father's Telephone Number length cannot be more than 14")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9()-]*$", message = "Invalid characters found in Father's Telephone Number")
	private String telephoneNumber;
	
	@Size(max = 14, message = "Father's Mobile Phone Number length cannot be more than 14")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9()-]*$", message = "Invalid characters found in Father's Mobile Phone Number")
	private String mobilePhoneNumber;
	
	@Size(max = 40, message = "Mother Name cannot be more than 40 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z`@_,.'\\s]*$", message = "Invalid characters found in Mother Name")
	private String motherName;
	
	@Size(max = 40, message = "Mother's Employer Name cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Mother's Employer Name")
	private String motherEmployerName;
	
	@Size(max = 200, message = "Mother's Residential Address cannot be more than 200 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Father's Residential Address")
	private String motherResidentialAddress;
	
	@Size(max = 14, message = "Mother's Telephone Number length cannot be more than 14")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9()-]*$", message = "Invalid characters found in Mother's Telephone Number")
	private String motherTelephoneNumber;
	
	@Size(max = 14, message = "Mother's Mobile Phone Number length cannot be more than 14")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9()-]*$", message = "Invalid characters found in Mother's Mobile Phone Number")
	private String motherMobilePhoneNumber;
	
	@Valid
	private List<ChildDetailsDTO> childrenDetails;
}
