package com.jmmb.los.pb.api.dto;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.jmmb.los.pb.api.dto.employment.IEmployment;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Validated
public class ApplicantDTO {
	private Long id;
	
	@Min(value = 1L, message = "Invalid Order Min")
	@Max(value = 7L, message = "Invalid Order Max")
	private Long order;// ibps applicant id(1, 2, 3, 4)
	
	@Size(max = 20, message = "Applicant Type length cannot be more than 20 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z_]*$", message = "Invalid characters found in Applicant Type")
	private String type; // PRIMARY, CO_APPLICANT
	
	@Size(max = 3, message = "Is CWB Employee length cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Is CWB Employee")
	private String isCWBEmployee; // Yes, No
	
	@Size(max = 20, message = "First Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in first name")
	private String firstName;
	
	@Size(max = 20, message = "Middle Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in middle name")
	private String middleName;
	
	@Size(max = 20, message = "Last Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in last name")
	private String lastName;
	
	@Size(max = 20, message = "Maiden Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Maiden Name")
	private String maidenName;
	
	@Size(max = 20, message = "Mother's Maiden Name cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Mother's Maiden Name")
	private String motherMaidenName;
	
	@Size(max = 80, message = "email cannot be more than 80 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\",.`'_-]+@[a-zA-Z0-9.-]+$", message = "Invalid format for email addresss")
	private String email;
	
	@Size(max = 80, message = "email cannot be more than 80 characters")
    @Pattern(regexp = "^[a-zA-Z0-9\",.`'_-]+@[a-zA-Z0-9.-]+$", message = "Invalid format for email addresss")
	private String confirmEmail;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Date of Birth must be in YYYY-MM-DD Format")
	private String dob;
	
	@Size(max = 10, message = "Cell Phone Number length cannot be more than 10")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in cell phone number")
	private String cellPhoneNo;
	
	@Size(max = 10, message = "Home Phone Number length cannot be more than 10 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in home phone number")
	private String homePhoneNo;
	
	@Size(max = 10, message = "Work Phone Number length cannot be more than 10")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in work phone number")
	private String workPhoneNo;
	
	@Size(max = 3, message = "Is Existing Customer length cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Is Existing Customer")
	private String existingCustomer; // Yes, No
	
	@Size(max = 10, message = "Citizenship code cannot be more than 10 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid character in citizenship code")
	private String citizenship; // Country code e.g. AL
	
	@Size(max = 11, message = "Tax ID Number cannot be more than 11 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid character in Tax ID Number")
	private String tinNumber;
	
	@Size(max = 10, message = "Country Of Birth code cannot be more than 10 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid character in Country of Birth")
	private String placeOfBirth;
	
	@Size(max = 10, message = "Prefix cannot be more than 10 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid characters found in prefix")
	private String prefix;
	
	@Size(max = 20, message = "Suffix cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in suffix")
	private String suffix;
	
	@Size(max = 3, message = "Gender Code cannot be more than 20 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in gender code")
	private String gender;
	
	//@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]{3}$", message = "Invalid characters found in age")
	private int age;
	
	private String ssn;//National ID Number
	
	@Size(max = 15, message = "Marital Status cannot be more than 15 characters")
    @Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z_]*$", message = "Invalid characters found in Marital Status")
	private String maritalStatus;
	
	@Size(max = 2, message = "How Long in years cannot be more than 20 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in How Long in years")
	private String howLongInYears;
	
	@Size(max = 3, message = "Is Bank Employee? cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Is Bank Employee?")
	private String isBankEmployee; // Yes/No
	
	@Size(max = 3, message = "Is Government Employee? cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Is Government Employee?")
	private String isGovernmentEmployee;
	
	@Size(max = 3, message = "Life Insurance Required? cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Life Insurance Required?")
	private String lifeInsuranceRequired; // Yes/No
	
	@Size(max = 3, message = "Life Insurance Already Present? cannot be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z]*$", message = "Invalid characters found in Life Insurance Already Present?")
	private String lifeInsuranceAlreadyPresent; // Yes/No
	
	@Size(max = 40, message = "Life Insurance Provider Name cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Life Insurance Provider Name")
	private String lifeInsuranceProviderName;
	
	@Size(max = 100, message = "Loan Relationship cannot be more than 100 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z()\\s]*$", message = "Invalid characters found in Life Insurance Provider Name")
	private String loanRelationship;
	
	@Size(max = 8, message = "Loan Relationship Code cannot be more than 8 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid characters found in Loan Relationship Code")
	private String loanRelationshipCode;
	
	@Size(max = 10, message = "Relation to Primary Applicant cannot be more than 10 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z\\s]*$", message = "Invalid characters found in Relation to Primary Applicant")
	private String relation;
	
	@Size(max = 5, message = "No. of Dependent cannot be more than 10 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in No. of Dependent")
	private String noOfDependent;

	@Valid
	private AddressDetailsDTO addressDetails;
	
	@Valid
	private List<IdDetail> idDetails;
	
	@Valid
	private List<IEmployment> empDetails;
	// private List<IncomeDetailsDTO> incomeDetails;
	@Valid
	private PEPDetailsDTO politicallyExposedPersonDetails;
	
	/*@Valid
	private FamilyDetailsDTO familyDetails;*/
	private List<ReferenceDTO> referenceDetails;
	
	@Valid
	private FinancialDetailsDTO financialDetails;

	/*
	 * private String currentPage;//financial, applicationDetails private String
	 * currentTab; private Long id; //member id
	 * 
	 * //Screen Basic Info
	 * 
	 * 
	 * //private Boolean existingCustomer; // private boolean isCWBEmployee; //
	 * should be existing customer? //nationalId
	 * 
	 * private String nationality;
	 * 
	 * private String tin; private String loanRelationship; private String
	 * homePhoneNo; private String mobilePhoneNo; private String workPhoneNo;
	 * 
	 * //Screen 2: Address Details
	 * 
	 * 
	 * //Screen 3:
	 * 
	 * // private PoliticallyExposedPersonDetails
	 * politicallyExposedPersonDetails; // private FamilyDetails familyDetails;
	 * // private List<ReferenceDetail> referenceDetails; // private String
	 * loanRelationship; // private String relation; // private PepData pepData;
	 * //To be removed(old code) private List<ReferenceDTO> referenceDetails;
	 * private List<ReferenceDTO> guarantorDetails; private FinancialDetailsDTO
	 * financialDetails;
	 */
}
