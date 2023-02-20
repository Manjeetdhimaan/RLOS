package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_RLOS_AdditionalChildDetails_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class ChildrenDetailsGrid {
	// DB Table: NG_RLOS_AdditionalChildDetails_Grid

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "Name")
	private String name;

	@XmlElement(name = "Relationship")
	private String relationship;

	@XmlElement(name = "EmployerName")
	private String employerName;

	@XmlElement(name = "Address")
	private String address;

	@XmlElement(name = "TelephoneNo")
	private String telephoneNo;

	@XmlElement(name = "MobileNo")
	private String mobileNo;
}
