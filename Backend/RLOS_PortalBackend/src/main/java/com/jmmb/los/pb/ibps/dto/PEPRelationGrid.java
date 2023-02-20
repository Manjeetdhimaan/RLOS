package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "NG_RLOS_RelationshipDetailsTable")
@XmlAccessorType(XmlAccessType.FIELD)
public class PEPRelationGrid {
	// DB Table: NG_RLOS_RelationshipDetailsTable
	// OD_Index	
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name="insertionOrderId")
	private String elementId;
	
	@XmlElement(name="FirstName")
	private String firstName;

	@XmlElement(name="MiddleName")
	private String middleName;

	@XmlElement(name="LastName")
	private String lastName;

	@XmlElement(name="Relationship")
	private String relationship;

	@XmlElement(name="DateofBirth")
	private String dob;
}
