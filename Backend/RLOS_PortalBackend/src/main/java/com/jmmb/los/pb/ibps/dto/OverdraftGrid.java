package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_PersonalOverdraftDetails_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class OverdraftGrid {
	// Q Variable: Q_PersonalOverdraftDetails_Grid
	// DB Table: NG_RLOS_PersonalOverdraftDetails_Grid
	// ODLimit
	// IntrestRateType
	// PrimeRate
	// FixedRate
	// RateSpread
	// EffectiveIntrestRate
	// Expiry
	// AccountNo
	//
	//
	//
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;

	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "memberid")
	private String memberId;

	@XmlElement(name = "Required")
	private String requiedFor;

	@XmlElement(name = "Applicant_Code")
	private String relationCode;

	@XmlElement(name = "Purpose")
	private String purpose;

	@XmlElement(name = "PurposeLabel")
	private String purposeLabel;

	@XmlElement(name = "OtherPurpose")
	private String OtherPurpose;

	@XmlElement(name = "OverdraftMemID")
	private String overdraftOrder;

	// @XmlElement(name = "IntrestRateTypeName")
	// private String overdraftName;
}
