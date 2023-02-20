package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_LoanDetail")
@XmlAccessorType(XmlAccessType.FIELD)
public class LoanDetail {

    @XmlElement(name="Total_Amount_Requested")
    private String totalAmount;

    @XmlElement(name="Total_Loan_Amount_For_Approval")
    private String totalAmountForApproval;

    @XmlElement(name="Type_of_Interest")
    private String typeOfInterest;

    @XmlElement(name="Campaign")
    private String campain;

    @XmlElement(name="Prime_Landing")
    private String primeLanding;

    @XmlElement(name="MMRR")
    private String mmrr;

    @XmlElement(name="Trust_Rate")
    private String trustRate;

    @XmlElement(name="Spreads")
    private String spreads;

    @XmlElement(name="Rate_of_Interest")
    private String roi;

    @XmlElement(name="Payment_Mode")
    private String paymentMode;
    
}
