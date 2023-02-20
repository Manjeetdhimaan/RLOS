package com.los.pb.resume.dto;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;

@Data
@Validated
public class SearchCustomerRequest {
	@Size(max = 20, message = "First Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in first name")
	private String firstName;
	
	@Size(max = 20, message = "Last Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in last name")
	private String lastName;
	
	@Size(max = 80, message = "email cannot be more than 80 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\",.`'_-]+@[a-zA-Z0-9.-]+$", message = "Invalid format for email addresss")
	private String email;
	
	//private String dob;
	
	@Pattern(regexp = "^(RLN|OAO)-([0-9]{10})$", message = "Valid ARN format is RLN|OAO-000000xxxx")
	private String arn;
	
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in One Time Password")
	private String otp;
}
