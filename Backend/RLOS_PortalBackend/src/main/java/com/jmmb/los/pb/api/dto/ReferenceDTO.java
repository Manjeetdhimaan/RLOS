package com.jmmb.los.pb.api.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReferenceDTO {

	private Long id;
	// private Long guarantorId;
	private String title;
	// private String firstName;
	// private String middleName;
	// private String lastName;
	// private String employer;
	// private String relationship;
	// private String phoneNo;
	// private Boolean isMailingAndResidentialAddDifferent;
	// private AddressDTO address;

	private String firstName;
	private String middleName;
	private String lastName;
	private String employer;
	private String relationship;
	private String phoneNo;
	private String isMailingAndResidentialAddDifferent; // Yes, No
	private List<AddressDTO> addresses;
}
