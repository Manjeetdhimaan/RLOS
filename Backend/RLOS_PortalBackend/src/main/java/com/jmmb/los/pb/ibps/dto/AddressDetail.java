package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_ContactInformation_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class AddressDetail {
	// DB Table: NG_RLOS_ContactInformation_Grid
	// POAddress
	// Verified
	// Verifiedwith
	// PayingHabit
	// AdditionalComments
	// CopyFromAddress
	//
	//
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;

	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "Memberid")
	private String memberId;

	@XmlElement(name = "ApplicantTypePortalOnly")
	private String applicantType;

	@XmlElement(name = "ApplicantLoanRelation")
	private String loanRelationship;

	@XmlElement(name = "Applicant_Code")
	private String loanRelationshipCode;

	@XmlElement(name = "ApplicantName")
	private String applicantName;

	@XmlElement(name = "OweorRent")
	private String ownOrRent;

	@XmlElement(name = "MonthlyRent")
	private String monthlyRent;

	@XmlElement(name = "MortgageOwner")
	private String mortgageOwnerName;

	@XmlElement(name = "MortgageOwnerNo")
	private String mortgageOwnerPhoneNo;

	@XmlElement(name = "RelationwithMortgageOwner")
	private String relationwithMortgageOwner;

	@XmlElement(name = "DateMovedIn")
	private String dateMovedIn;

	@XmlElement(name = "DrivingDetailsToCurrentAddress")
	private String drivingDetailsToCurrentAddress;

	@XmlElement(name = "CurrentAddressYears")
	private String years;

	@XmlElement(name = "CurrentAddressMonths")
	private String months;

	// @XmlElement(name = "HomePhoneNo")
	// private String homePhoneNo;

	// @XmlElement(name = "WorkPhoneNo")
	// private String workPhoneNo;

	// @XmlElement(name = "MobilePhoneNo")
	// private String mobilePhoneNo;

	@XmlElement(name = "SameMailingAddress")
	private Boolean isMailAddSameAsRes;

	// Current Address

	@XmlElement(name = "Apartment_SuiteNo")
	private String apartment;

	@XmlElement(name = "StreetAddress")
	private String streetAddress;

	@XmlElement(name = "City_Settlement")
	private String city;

	@XmlElement(name = "Island_State")
	private String state;

	@XmlElement(name = "Country")
	private String country;
	
	@XmlElement(name = "CountryLabel")
	private String countryLabel;

	@XmlElement(name = "PONumber")
	private String pOBoxNo;	

	// Mailing Address

	@XmlElement(name = "MailingApartment_Suitno")
	private String mailingApartment;

	@XmlElement(name = "MailingStreetAddress")
	private String mailingStreetAddress;

	@XmlElement(name = "MailingCity_Sattlement")
	private String mailingCity;

	@XmlElement(name = "MailingIsland_State")
	private String mailingState;

	@XmlElement(name = "MailingCountry")
	private String mailingCountry;

	@XmlElement(name = "MailingPONo")
	private String mailingPOBoxNo;

	// Previous Address

	@XmlElement(name = "PreviousApartment_SuiteNo")
	private String previousApartment;

	@XmlElement(name = "PreviousStreetAddress")
	private String previousStreetAddress;

	@XmlElement(name = "PreviousCity_Settlement")
	private String previousCity;

	@XmlElement(name = "PreviousIsland_State")
	private String previousState;

	@XmlElement(name = "PreviousCountry")
	private String previousCountry;

	@XmlElement(name = "PreviousPONo")
	private String previousPOBoxNo;
}
