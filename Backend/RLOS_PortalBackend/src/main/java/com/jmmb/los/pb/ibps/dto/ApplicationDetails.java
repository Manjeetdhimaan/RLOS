package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
// @XmlRootElement(name="Q_Basic_Details")
@XmlRootElement(name = "Q_Application_Details")
@XmlAccessorType(XmlAccessType.FIELD)
public class ApplicationDetails {

	@XmlElement(name = "SourceOfApplication")
	private String sourceOfApplication;

	@XmlElement(name = "Branch_Code")
	private String branchCode;

	@XmlElement(name = "CustomerName")
	private String customerName;

	@XmlElement(name = "Agree_Conditions")
	private String agreeConditions;

	@XmlElement(name = "ProductType")
	private String productType;

	@XmlElement(name = "CC_Code")
	private String ccCode;

	@XmlElement(name = "Cost_Centre")
	private String costCentre;

	@XmlElement(name = "CoApplicant")
	private String coApplicant;

}
