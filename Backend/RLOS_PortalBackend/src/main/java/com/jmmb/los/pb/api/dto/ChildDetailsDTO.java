package com.jmmb.los.pb.api.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class ChildDetailsDTO {
	private Long id;
	
	@Size(max = 40, message = "Child Name cannot be more than 40 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z`@_,.'\\s]*$", message = "Invalid characters found in Child Name")
	private String name;
	
	private String relationship;
	
	@Size(max = 40, message = "Child's Employer Name cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Child's Employer Name")
	private String employerName;
	
	@Size(max = 200, message = "Child's Residential Address cannot be more than 200 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Child's Residential Address")
	private String address;
	
	@Size(max = 14, message = "Child's Telephone Number length cannot be more than 14")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9()-]*$", message = "Invalid characters found in Child's Telephone Number")
	private String telephoneNumber;
	
	@Size(max = 14, message = "Child's Mobile Phone Number length cannot be more than 14")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9()-]*$", message = "Invalid characters found in Child's Mobile Phone Number")
	private String mobilePhoneNumber;
}
