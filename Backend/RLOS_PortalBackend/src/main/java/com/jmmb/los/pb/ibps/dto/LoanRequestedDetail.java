package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
// @XmlRootElement(name = "Q_LoanRequested_Grid")
@XmlRootElement(name = "Q_LoanDetails_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoanRequestedDetail {
	// Q Variable: Q_LoanDetails_Grid
	// DB Table: NG_RLOS_LoanDetails_Grid
	// Currency
	// LoanAccNo
	// Secured
	// ProductName
	// ProductId
	// CampaignProduct
	// TypeOfRefinance
	// CensureTrack
	// NAICSCode
	// TotalFeeTax
	// LoanAmtbooked
	// LoanAmtdisb
	// FullCostofLoan
	// BorrowersInput
	// IntrestRateType
	// PrimeRate
	// FixedRate
	// RateSpread
	// EffectiveIntRate
	// RepaymentType
	// MinimumIntRate
	// MaximumIntRate
	// EMI
	// FirstPaymentdate
	// Comments
	// DSR
	// TDSR
	// LTV
	// LTC
	// NoteDate
	// ProhibitedLoanCode
	// MortgagePurpose
	// SourceofRepayment
	// ProhibitedLoansThirdParty
	// PrimaryEmailId
	// 

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "LoanType")
	private String loanType;
	
	//@XmlElement(name = "Secured")
	//private String isSecuredFacility;

	@XmlElement(name = "LoanPurpose")
	private String loanPurpose;

	@XmlElement(name = "LoanPurposeOthers")
	private String loanPurposeOthers;

	@XmlElement(name = "LoanAmtReq")
	private Double loanAmountRequired;

	@XmlElement(name = "LoanTermMonths")
	private String loanTerm;
}
