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
public class AddressDetailsDTO {

	// private Boolean isMailingAndResidentialAddSame;
	// private List<AddressDTO> addresses;

	private Long id;
	
	@Size(max = 3, message = "Is Mailing and Residential address same? cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Is Mailing and Residential address same?")
	private String isMailingAndResidentialAddDifferent; // Yes, No
	
	@Size(max = 3, message = "Is address same as Primary? cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Is address same as Primary?")
	private String isAddressSameAsPrimary; // Yes, No
	
	@Size(max = 13, message = "Amount of Rent cannot be more than 13 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9.]*$", message = "Invalid characters found in Amount of Rent")
	private String amtOfRent;
	
	@Size(max = 50, message = "Relationship with Mortgage Owner cannot be more than 50 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Relationship with Mortgage Owner")
	private String relationshipWithMortgageOwner;
	
	@Size(max = 40, message = "Mortgage Owner Full Name cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Mortgage Owner Full Name")
	private String mortgageOwnersFullName;
	
	@Size(max = 14, message = "Mortgage Owner Phone Number cannot be more than 14 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Mortgage Owner Phone Number")
	private String mortgageOwnerPhoneNumber;
	// private String homePhoneNo;
	// private String mobileNo;
	// private String workPhoneNo;
	@Valid
	private List<AddressDTO> addresses;
}
