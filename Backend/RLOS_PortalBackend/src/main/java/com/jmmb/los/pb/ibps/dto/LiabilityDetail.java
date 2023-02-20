package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_Liability_Detail_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class LiabilityDetail {
    
    @XmlAttribute(name="InsertionOrderId")
    private String attributeId;

    @XmlElement(name="InsertionOrderId")
    private String elementId;
    
    @XmlElement(name="Applicant_Name")
    private String applicantName;
    
    @XmlElement(name="Type_of_Liability")
    private String typeOfLiability;
    
    @XmlElement(name="Description")
    private String description;
    
    @XmlElement(name="Include")
    private String include;
    
    @XmlElement(name="Amount")
    private String amount;
    
    @XmlElement(name="MemberID")
    private String memberId;
    
    @XmlElement(name="Total_Amount")
    private String totalAmount;
    
    @XmlElement(name="Total_Monthly_payment")
    private String totalMonthlyPayment;


}
