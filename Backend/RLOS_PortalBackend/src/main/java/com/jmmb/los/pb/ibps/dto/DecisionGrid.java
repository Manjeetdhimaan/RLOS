package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_Decision")
@XmlAccessorType(XmlAccessType.FIELD)
public class DecisionGrid {
	// DB Table: NG_RLOS_Decision
	// Decision
	// GenerateDocument
	// DecisionComments
	// Decision_Code
	// HoldExpiryDate
	// DocumentsToBeScanned
	// RejectionReason
	// RejectionCode
	//ReferalCode
	
	@XmlElement(name = "CustomerComments")
	private String customerRemarks;
	@XmlElement(name = "ReferalCode")
	private String referalCode;
}
