package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_FamilyDetails_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class FamilyDetailsGrid {
	// DB Table: NG_RLOS_FamilyDetails_Grid
	// AdditionalChildSiblingPresent
	// Additionalname
	// AdditionalRelationship
	// AdditionalEmployerName
	// AdditionalAddress
	// AdditionalTelephoneNo
	// AdditionalMobileNo	
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;

	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	//@XmlElement(name = "Noofdependents")
	//private String noOfDependent;

	@XmlElement(name = "Fathersname")
	private String fatherName;

	@XmlElement(name = "FathersEmployerName")
	private String fatherEmployerName;

	@XmlElement(name = "FathersAddress")
	private String fatherAddress;

	@XmlElement(name = "FathersTelephoneNo")
	private String fatherTelephoneNo;

	@XmlElement(name = "FathersMobileNo")
	private String fatherMobileNo;

	@XmlElement(name = "Mothersname")
	private String motherName;

	@XmlElement(name = "MothersEmployerName")
	private String motherEmployerName;

	@XmlElement(name = "MothersAddress")
	private String motherAddress;

	@XmlElement(name = "MothersTelephoneNo")
	private String motherTelephoneNo;

	@XmlElement(name = "MothersMobileNo")
	private String motherMobileNo;	
}
