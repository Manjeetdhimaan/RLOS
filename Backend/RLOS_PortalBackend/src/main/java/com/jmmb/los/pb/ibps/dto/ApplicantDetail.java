package com.jmmb.los.pb.ibps.dto;

import java.io.StringReader;
import java.io.StringWriter;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Marshaller;
import javax.xml.bind.Unmarshaller;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_ApplicantInformation")
@XmlAccessorType(XmlAccessType.FIELD)
public class ApplicantDetail {
	// DB Table: NG_RLOS_ApplicantInformation_Grid
	// String BranchName
	// String BranchCode
	// PreviousCustomerClass
	// PreviousInternalCreditScore
	// PreviousWTDCodes
	// PreviousRiskRating
	// ShortName
	// CustomerSince
	// 
	// 
	// 
	// 

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "Memberid")
	private String memberId;

	@XmlElement(name = "ExistingCustomer")
	private String existingCustomer;

	@XmlElement(name = "ApplicantTypePortalOnly")
	private String memberType;	

	@XmlElement(name = "Prefix")
	private String prefix;

	@XmlElement(name = "FirstName")
	private String firstName;

	@XmlElement(name = "MiddleName")
	private String middleName;

	@XmlElement(name = "LastName")
	private String lastName;

	@XmlElement(name = "MaidenName")
	private String maidenName;

	@XmlElement(name = "MotherMaidenName")
	private String motherMaidenName;

	@XmlElement(name = "Suffix")
	private String suffix;

	@XmlElement(name = "Email")
	private String emailAddress;

	@XmlElement(name = "ConfirmEmailAddress")
	private String confirmEmailAddress;

	@XmlElement(name = "CellPhone")
	private String cellPhone;

	@XmlElement(name = "WorkPhone")
	private String workPhone;

	@XmlElement(name = "HomePhone")
	private String homePhone;

	@XmlElement(name = "Gender")
	private String gender;

	@XmlElement(name = "DOB")
	private String dob;

	@XmlElement(name = "MaritalStatus")
	private String maritalStatus;

	@XmlElement(name = "Citizenship")
	private String citizenship;

	@XmlElement(name = "PlaceofBirth")
	private String placeOfBirth;
	
	@XmlElement(name = "NoofDependents")
	private String noOfDependent;

	@XmlElement(name = "NationalInsNo")
	private String ssn;

	@XmlElement(name = "IsBankemp")
	private String isBankEmployee;

	@XmlElement(name = "IsGovemp")
	private String isGovernmentEmployee;

	@XmlElement(name = "RelationtoPrimary")
	private String relationToPrimary;

	@XmlElement(name = "Howlong")
	private String howLongInYears;

	@XmlElement(name = "Age")
	private String age;

	@XmlElement(name = "TIN")
	private String tin;

	@XmlElement(name = "insurancereq")
	private String lifeInsuranceRequired;

	@XmlElement(name = "insurancepresent")
	private String lifeInsuranceAlreadyPresent;

	@XmlElement(name = "LifeInsuranceProvider")
	private String lifeInsuranceProviderName;
	
	@XmlElement(name = "ApplicantLoanRelation")
	private String loanRelationship;

	@XmlElement(name = "Applicant_Code")
	private String loanRelationshipCode;
	
	@XmlElement(name = "FilledatPortal")
	private String isFilledAtPortal;

	public static void main(String[] args) throws JAXBException {
		ApplicantDetail ad = new ApplicantDetail();
		ApplicantDetail ad2;
		ad.elementId = "1";
		//ad.attributeId = "2";
		ad.firstName = "Test";

		StringWriter sw = new StringWriter();
		JAXBContext context = JAXBContext.newInstance(ApplicantDetail.class);
		Marshaller marshaller = context.createMarshaller();
		marshaller.setProperty(Marshaller.JAXB_FRAGMENT, Boolean.TRUE);
		marshaller.setProperty(Marshaller.JAXB_FORMATTED_OUTPUT, Boolean.TRUE);
		marshaller.marshal(ad, sw);
		System.out.println(sw);

		String xml = "<Q_ApplicantInformation InsertionOrderId=\"1\">\r\n"
				+ "    <InsertionOrderId>2</InsertionOrderId>\r\n" + "    <FirstName>Test</FirstName>\r\n"
				+ "</Q_ApplicantInformation>";

		Unmarshaller unmarshaller = context.createUnmarshaller();
		ad2 = (ApplicantDetail) unmarshaller.unmarshal(new StringReader(xml));
		System.out.println(ad2);
		System.out.println(ad.equals(ad2));
	}

}
