package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_DocumentChecklist")
@XmlAccessorType(XmlAccessType.FIELD)
public class DocumentDetailsGrid {
	// Q Variable: Q_DocumentChecklist
	// DB Table: NG_RLOS_DocumentChecklist
	// LoanType
	// LoanType_Id
	// LoanSubType
	// LoanSubType_Id
	// Comment
	// RequestDocument
	// DocumentStatus
	// DocumentCode
	// isRowSystemGenerated

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "Applicant_Id")
	private String applicantId;

	@XmlElement(name = "ApplicantName")
	private String applicantName;

	@XmlElement(name = "ApplicantType")
	private String applicantType;

	@XmlElement(name = "DocumentName")
	private String documentName;

	@XmlElement(name = "OD_Index")
	private String docIndex;

	@XmlElement(name = "UploadDate")
	private String uploadDate;
}
