package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "PIIncome")
@XmlAccessorType(XmlAccessType.FIELD)
public class IncomeDetailGrid {
	// Q Variable: PIIncome
	// DB Table: NG_RLOS_PIIncome_Grid
	// Applicant_Id : Applicant_Id
	// IncomeType : IncomeType
	// Frequency : Frequency
	// MonthlyIncome : MonthlyIncome
	// Remarks : Remarks
	// AnnualIncome : AnnualIncome

	@XmlAttribute(name = "InsertionOrderId")
	private String attributeId;

	@XmlElement(name = "InsertionOrderId")
	private String elementId;

	@XmlElement(name = "Applicant_Id")
	private String memberId;

	@XmlElement(name = "IncomeType")
	private String incomeType;

	@XmlElement(name = "Frequency")
	private String frequency;

	@XmlElement(name = "Amount")
	//private Double amount;
	private String amount;

	@XmlElement(name = "MonthlyIncome")
	// private Double monthlyIncome;
	private String monthlyIncome;
	
	@XmlElement(name = "AnnualIncome")
	// private Double monthlyIncome;
	private String annualIncome;
	
	@XmlElement(name = "PrimaryIncome")
	private String primaryIncome;

	@XmlElement(name = "Remarks")
	private String remarks;

	public void setAmount(Double amount) {
		if (amount != null) {
			this.amount = String.format("%.2f", amount);
		} else {
			this.amount = null;
		}
	}
	
	public String getAmount() {
		return this.amount;
	}
	
	public void setMonthlyIncome(Double monthlyIncome) {
		if (monthlyIncome != null) {
			this.monthlyIncome = String.format("%.2f", monthlyIncome);
		} else {
			this.monthlyIncome = null;
		}
	}
	
	public String getMonthlyIncome() {
		return this.monthlyIncome;
	}
	
	public void setAnnualIncome(Double annualIncome) {
		if (annualIncome != null) {
			this.annualIncome = String.format("%.2f", annualIncome);
		} else {
			this.annualIncome = null;
		}
	}
	
	public String getAnnualIncome() {
		return this.annualIncome;
	}
}
