package com.jmmb.los.pb.api.dto;

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
public class AddressDTO {

	// private Long id;
	// private Long applicantId;
	// private String type;
	// private String streetName;
	// private String apartment;
	// private String city;
	// private String country;
	// private String islandDistrict;
	// private String currentPOBoxNo;
	//
	// private String ownOrRent;
	// private String amtOfRent;
	// private String relationshipWithMortageOwner;
	// private String mortgageOwnersFullName;
	// private String mortgageOwnerPhoneNumber;
	//
	// private String years;
	// private String months;
	// private String drivingDetailsToCurrentAddress;
	// private String dateMovedIn;
	//
	// private String mailingStreetName;
	// private String mailingApartment;
	// private String mailingCity;
	// private String mailingCountry;
	// private String mailingIslandDistrict;
	// private String mailingPOBoxNo;	
	@Size(max = 8, message = "Address Type can not be more than 8 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z]*$", message = "Invalid characters found in Address Type")
	private String type;
	
	@Size(max = 60, message = "Street Address can not be more than 60 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Street Address")
	private String addressLine1; // Street Address
	
	@Size(max = 30, message = "Apartment/Suit No. can not be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Apartment/Suit No.")
	private String addressLine2; // Apartment/Suit No.
	
	@Size(max = 35, message = "City can not be more than 35 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in City")
	private String city;
	
	@Size(max = 35, message = "Island/State can not be more than 35 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9\\s]*$", message = "Invalid characters found in Island/State")
	private String state;
	
	@Size(max = 35, message = "Country Code can not be more than 35 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid characters found in Country Code")
	private String country;
	
	@Size(max = 100, message = "Country Name can not be more than 100 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z()-,.'_\\s]*$", message = "Invalid characters found in Country Name")
	private String countryLabel;
	
	@Size(max = 50, message = "PO Number be more than 50 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in PO Number")
	private String poBoxNo;
	
	@Size(max = 3, message = "Time at Residence (Years) can not  be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Time at Residence (Years)")
	private String years;
	
	@Size(max = 2, message = "Time at Residence (Months) can not  be more than 2 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Time at Residence (Months)")
	private String months;
	
	@Size(max = 25, message = "Type of Housing can not  be more than 25 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z_]*$", message = "Invalid characters found in Type of Housing")
	private String ownOrRent;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Date moved in must be in YYYY-MM-DD Format")
	private String dateMovedIn;
	
	@Size(max = 200, message = "Driving Details to Current Address cannot be more than 200 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Driving Details to Current Address")
	private String drivingDetailsToCurrentAddress;
	
	@Size(max = 14, message = "Phone Number length cannot be more than 14 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Phone Number")
	private String phoneNo;
}
