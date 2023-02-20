package com.jmmb.los.pb.ibps.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Attributes")
@XmlAccessorType(XmlAccessType.FIELD)
public class Attributes {
	@XmlElement(name = "Decision")
	private String decision;

	@XmlElement(name = "CustomerName")
	private String customerName;
	
	@XmlElement(name = "NIB")
	private String nationalIdNo;

	@XmlElement(name = "ProductType")
	private String productType;

	@XmlElement(name = "LoanType")
	private String loanType;

	@XmlElement(name = "Sourceofapplication")
	private String sourceOfApplication;

	//@XmlElement(name = "BranchCode")
	@XmlElement(name = "BranchID")
	private String branchCode;
	
	@XmlElement(name = "Branch")
	private String branchName;	

	@XmlElement(name = "Q_Application_Details")
	private ApplicationDetails applicationDetails;

	@XmlElement(name = "Q_ApplicantInformation")
	private List<ApplicantDetail> applicantDetails;

	@XmlElement(name = "Q_RLOS_IdentificationInformation")
	private List<IdentificationDetail> identificationDetails;

	@XmlElement(name = "Q_ContactInformation_Grid")
	private List<AddressDetail> addressDetails;

	@XmlElement(name = "Q_EmploymentInformation_Grid")
	private List<EmploymentDetail> employementDetails;

	// @XmlElement(name = "Q_Income_Grid")
	// private List<IncomeDetailGrid> incomeDetails;

	@XmlElement(name = "Q_PEPStatus_GRID")
	private List<PEPDetailsGrid> pepDetailsGridList;

	@XmlElement(name = "Q_FamilyDetails_Grid")
	private FamilyDetailsGrid familyDetailsGrid;

	@XmlElement(name = "Q_RLOS_AdditionalChildDetails_Grid")
	private List<ChildrenDetailsGrid> childrenDetailsGrid;

	// @XmlElement(name="Q_REFERENCE")
	@XmlElement(name = "Q_ReferenceInfo_Grid")
	private List<Reference> references;

	// @XmlElement(name = "Q_LoanRequested_Grid")
	@XmlElement(name = "Q_LoanDetails_Grid")
	private LoanRequestedDetail loanDetailsGrid;

	@XmlElement(name = "Q_CreditCardDetails_Grid")
	private List<CreditCardGrid> creditCardGridList;

	@XmlElement(name = "Q_PersonalOverdraftDetails_Grid")
	private List<OverdraftGrid> overdraftGridList;

	// @XmlElement(name = "Q_COLLATERAL")
	@XmlElement(name = "Q_CollateralDetails_Grid")
	private CollateralDetail collateralDetails;

	@XmlElement(name = "Q_personalfinancialInformation")
	private List<FinancialDetailsGrid> financialDetailsGridList;

	@XmlElement(name = "Q_DocumentChecklist")
	private List<DocumentDetailsGrid> documentsGrid;

	@XmlElement(name = "Q_RLOS_Concent")
	private ConsentsGrid consentGrid;
	
	@XmlElement(name = "Q_Decision")
	private DecisionGrid decisionGrid;

	// -------------------------------------------
	/*
	@XmlElement(name = "Q_GUARANTOR")
	private List<Guarantor> guarantors;

	@XmlElement(name = "Q_LoanDetail")
	private LoanDetail loanDetail;

	@XmlElement(name = "Q_PROPERTY")
	private List<PropertyDetail> propertyDetails;

	@XmlElement(name = "Q_VECHILE")
	private List<VehicleDetail> vehicleDetails;

	@XmlElement(name = "Q_Asset_Detail_Grid")
	private List<AssetDetailGrid> assetDetail;

	@XmlElement(name = "Q_Liability_Detail_Grid")
	private List<LiabilityDetail> liabilityDetail;

	@XmlElement(name = "Q_Expense_Detail_Grid")
	private List<ExpenseDetail> expenseDetail;
	*/
}
