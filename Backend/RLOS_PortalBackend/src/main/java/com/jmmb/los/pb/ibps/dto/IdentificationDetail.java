package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_RLOS_IdentificationInformation")
@XmlAccessorType(XmlAccessType.FIELD)
public class IdentificationDetail {

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "IDType")
	private String idType;

	@XmlElement(name = "IdTypeLabel")
	private String idTypeLabel;

	@XmlElement(name = "IDNumber")
	private String idNumber;

	@XmlElement(name = "IDExpirationDate")
	private String idExpDate;

	@XmlElement(name = "IDIssueDate")
	private String idIssueDate;

	@XmlElement(name = "memberid")
	private String memberId;

	@XmlElement(name = "ApplicantTypePortalOnly")
	private String memberType;

	@XmlElement(name = "IssuingCountry")
	private String idIssuingCountry;

	@XmlElement(name = "IdIssueCountryName")
	private String idIssuingCountryName;

	@XmlElement(name = "ApplicantName")
	private String applicantName;

	@XmlElement(name = "ApplicantLoanRelationship")
	private String loanRelationship;
	
	@XmlElement(name = "Applicant_Code")
	private String loanRelationshipCode;
}
