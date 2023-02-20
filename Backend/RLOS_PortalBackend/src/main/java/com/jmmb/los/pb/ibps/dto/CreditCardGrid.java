package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_CreditCardDetails_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class CreditCardGrid {
	// Q Variable: Q_CreditCardDetails_Grid
	// DB Table: NG_RLOS_CreditCardDetails_Grid
	// CardLimit
	// IntrestRateType
	// PrimeRate
	// FixedRate
	// RateSpread
	// EffectiveIntrestRate
	//
	// 
	// IntrestRateTypeName
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;

	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "memberid")
	private String memberId;

	@XmlElement(name = "RequiedFor")
	private String requiedFor;

	@XmlElement(name = "Applicant_Code")
	private String relationCode;

	@XmlElement(name = "TypeofCard")
	private String cardType;

	@XmlElement(name = "TypeOfcardLabel")
	private String cardTypeLabel;

	@XmlElement(name = "Branch")
	private String branch;
	
	@XmlElement(name = "BranchCode")
	private String branchCode;

	@XmlElement(name = "CreditCardMemid")
	private String cardOrder;
}
