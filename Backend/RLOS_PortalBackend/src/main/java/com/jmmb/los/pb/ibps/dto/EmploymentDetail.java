package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_EmploymentInformation_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class EmploymentDetail {
	// DB Table: NG_RLOS_EmploymentInformation_Grid
	// PrevEmploymentlengthyears
	// PrevEmploymentlengthmonths
	// PrevEmployerName
	// PrevJobTitle
	// PrevEmpApartmentNo
	// PrevEmpStreetAd
	// PrevEmpCity
	// PrevEmpIsland_State
	// PrevEmpCountry
	// IncomeType
	// Sourceofrepayment
	// Frequency
	// Amount
	// MonthlyIncome
	// ProfessionEmpCategoryCode
	// AuthorizedProfessionEmployer
	// ProfessionEmpCode
	// Remarkcomment
	// PrevEmpPONumber
	// OtherCompanyAssignmentDeduction
	// Verified
	// Verifiedwith
	// Comments
	// PrevEmpPhoneNo
	// Applicant_Code

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;

	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "Memberid")
	private String memberId;

	@XmlElement(name = "ApplicantTypePortalOnly")
	private String memberType;

	@XmlElement(name = "ApplicantType")
	private String loanRelationship;

	@XmlElement(name = "Applicant_Code")
	private String loanRelationshipCode;

	@XmlElement(name = "ApplicantName")
	private String memberName;

	@XmlElement(name = "EmploymentType")
	private String empType;
	
	@XmlElement(name = "EmploymentTypeName")
	private String empTypeLabel;

	@XmlElement(name = "EmployerName")
	private String companyName;

	@XmlElement(name = "JobTitle")
	private String jobTitle;

	@XmlElement(name = "JobTitleDescription")
	private String jobTitleDescription;

	@XmlElement(name = "EmploymentSector")
	private String sector;

	@XmlElement(name = "EmploymentStartDate")
	private String empDate;

	@XmlElement(name = "EmploymentLengthYears")
	private String yearsEmployed;

	@XmlElement(name = "EmploymentLengthmonths")
	private String monthsEmployed;

	@XmlElement(name = "Workpermitpresent")
	private String workPermitPresent;

	@XmlElement(name = "Workpermitexpdate")
	private String workPermitExpiry;

	@XmlElement(name = "EmpStreetAddress")
	private String empStreetName;

	@XmlElement(name = "EmpApartmentNo")
	private String empApartment;

	@XmlElement(name = "EmpCity")
	private String empCity;

	@XmlElement(name = "EmpCountry")
	private String empCountry;

	@XmlElement(name = "EmpIsland_State")
	private String empIslandState;

	@XmlElement(name = "EmpPONumber")
	private String empPOBoxNo;

	@XmlElement(name = "EmpPhoneNo")
	private String empPhoneNo;

	// Self Employed:
	// @XmlElement(name = "BusinessName")
	// private String businessName;

	@XmlElement(name = "BusinessType")
	private String businessType;

	@XmlElement(name = "BusinessStartDate")
	private String businessDate;

	@XmlElement(name = "BusinessLengthYears")
	private String yearsBusiness;

	@XmlElement(name = "BusinessLengthmonths")
	private String monthsBusiness;

	// @XmlElement(name = "BusinessStreetAd")
	// private String businessStreetName;

	// @XmlElement(name = "BusinessApartmentNo")
	// private String businessApartment;

	// @XmlElement(name = "BusinessCity")
	// private String businessCity;

	// @XmlElement(name = "BusinessCountry")
	// private String businessCountry;

	// @XmlElement(name = "BusinessIsland_State")
	// private String businessIslandState;

	// @XmlElement(name = "BusinessPONumber")
	// private String businessPOBoxNo;

	@XmlElement(name = "BusinessPhoneNo")
	private String businessPhoneNo;

	// Retired:
	// @XmlElement(name = "LastCompanyName")
	// private String lastCompanyName;

	@XmlElement(name = "YearsAfterRetierment")
	private String yearOfRetirement;

	// Student:
	@XmlElement(name = "HighestEducation")
	private String highestEducation;
	
	// Student & Unemployed
	@XmlElement(name = "PersonFundingtheAccount")
	private String fundingPerson;
	
	// Student & Unemployed
	@XmlElement(name = "RelationshipToApplicant")
	private String relationshipWithApplicant;
	
	// Student & Unemployed
	@XmlElement(name = "FundingPersonExisitingCustomer")
	private String isFundingPersonAnExistingCustomer;
	
	@XmlElement(name = "WorkpermitNumber")
	private String workpermitNumber;

}
