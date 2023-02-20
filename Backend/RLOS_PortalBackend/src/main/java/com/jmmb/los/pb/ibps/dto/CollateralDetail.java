package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_CollateralDetails_Grid")
// @XmlRootElement(name = "Q_COLLATERAL")
@XmlAccessorType(XmlAccessType.FIELD)
public class CollateralDetail {
	// Q Variable: Q_CollateralDetails_Grid
	// DB Table: NG_RLOS_CollateralDetails_Grid
	// isprimarycollateral
	// 
	// 
	// CollateralId
	// CollateralDescription
	// 
	// Discount
	// DiscountedCollateralValue
	// AppraisedValue
	// ValuationDate
	// AuthorizedAppraiseName
	// 
	// 
	// Make
	// Model
	// SerialNumber
	// EngineNumber
	// License
	// AddressofProperty
	// InsuranceCompany
	// InsuranceNumber
	// InsuranceAmount
	// PremiumAmount
	// InsuranceIssueDate
	// InsuranceStartDate
	// InsuranceCompanyAddress
	// Attoneyfordocumentation
	// InsuranceEndDate
	// AutomobileYear
	// primarycollateralflag
	// 
	// 
	// Presencsinapprovedsubdivision
	// RegistrationNo
	// DateofRegistration
	// NameasperRegistration
	// AddressasperRegistration
	// 
	// FiservId
	// 
	// AvailabletoPledge
	// PledgeAmount
	// HouseLocation
	// LotLocation
	// YearPurchased
	// YearBuilt
	// HouseSqFt
	// LotSize
	// NoofUnits
	// Margin
	// LegalClaimRegistrationDate
	// DealerName
	// DealerNo
	// CompanyShares
	// MarginStocks
	// NoofShares
	// CompanyWageAssignment
	// EmployeeNumber
	// PaymentAmount
	// DueDate
	// SavingsNo
	// CDAAccountNo
	// HoldAmount
	// MaturityDate
	// MarginDeposits
	// TypeofPolicy
	// SubDivison
	// memberid
	// CertCfmNo
	// Applicant_Code
	// cif
	// CollateralTypeName
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	
	@XmlElement(name = "memberid")
	private String memberid;

	@XmlElement(name = "InsertionOrderId")
	private String elementId;
	
	@XmlElement(name = "Portal_HasCollateral")
	private String hasCollateral;
	
	@XmlElement(name = "CollateralType")
	private String collateralType;
	
	@XmlElement(name = "OtherCollateralDetails")
	private String otherCollateralDetails;
	
	@XmlElement(name = "CollateralValue")
	private Double collateralValue;
	
	@XmlElement(name = "PresentCollateralValue")
	private Double presentCollateralValue;
	
	@XmlElement(name = "PrimaryOwner")
	private String primaryOwner;
	
	@XmlElement(name = "Currency")
	private String currency;
	
	@XmlElement(name = "ExistingCollateral")
	private String existingCollateral;

	@XmlElement(name = "Collateralno")
	private String collateralOrder;

	@XmlElement(name = "Collateralname")
	private String collateralName;
	
}
