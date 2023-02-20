package com.jmmb.los.pb.ibps.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name="Q_personalfinancialInformation")
@XmlAccessorType(XmlAccessType.FIELD)
public class FinancialDetailsGrid {
	// DB Table: NG_RLOS_personalfinancialInformation
	// calcflag
	// PIIncome:NG_RLOS_PIIncome_Grid
	// PIExpense:NG_RLOS_PIExpense_Grid	
	// PILiabilities:NG_RLOS_PILiabilities_Grid
	// TotalLiabilities
	// TotalAssets
	// TotalBalanceAmont
	// TotalMonthlyExpenses
	// 	
	
	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;
	
	@XmlElement(name="InsertionOrderId")
	private String elementId;
	
	@XmlElement(name="Memberid")
	private String memberId;
	
	@XmlElement(name="ApplicantName")
	private String memberName;
	
	@XmlElement(name="ApplicantTypePortalOnly")
	private String memberType;

	@XmlElement(name="LoanRelationship")
	private String loanRelationship;

	@XmlElement(name="Applicant_Code")
	private String loanRelationshipCode;
	
	@XmlElement(name="PIAsset")
	private List<AssetDetailGrid> assetGridList;

	@XmlElement(name="PIIncome")
	private List<IncomeDetailGrid> incomeGridList;
}
