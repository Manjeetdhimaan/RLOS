package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
// @XmlRootElement(name = "Q_REFERENCE")
@XmlRootElement(name = "Q_ReferenceInfo_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class Reference {
	// Q Variable: Q_ReferenceInfo_Grid
	// DB Table: NG_RLOS_ReferenceInfo_Grid
	// ReferenceName
	// address
	// mailingaddress
	// 
	// 

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "Title")
	private String title;

	@XmlElement(name = "FirstName")
	private String firstName;

	@XmlElement(name = "MiddleName")
	private String middleName;

	@XmlElement(name = "LastName")
	private String lastName;
	
	@XmlElement(name = "ReferenceName")
	private String referenceName;	

	@XmlElement(name = "Employer")
	private String employer;

	@XmlElement(name = "Relationship")
	private String relationship;

	@XmlElement(name = "Phone")
	private String phoneNo;

	@XmlElement(name = "ismailingaddresssame")
	private String isMailingAndResidentialAddDifferent;

	@XmlElement(name = "AddressLine1")
	private String addressLine1;

	@XmlElement(name = "AddressLine2")
	private String addressLine2;

	@XmlElement(name = "CitySettlement")
	private String city;

	@XmlElement(name = "IslandState")
	private String state;

	@XmlElement(name = "Country")
	private String country;
	
	@XmlElement(name = "POBoxNo")
	private String poBoxNo;

	@XmlElement(name = "AddressLine1_Mailing")
	private String MailingAddressLine1;

	@XmlElement(name = "AddressLine2_Mailing")
	private String MailingAddressLine2;

	@XmlElement(name = "CitySettlement_Mailing")
	private String MailingCity;

	@XmlElement(name = "IslandState_Mailing")
	private String MailingState;

	@XmlElement(name = "Country_Mailing")
	private String MailingCountry;
	
	@XmlElement(name = "POBoxNo_Mailing")
	private String poBoxNoMailing;
}
