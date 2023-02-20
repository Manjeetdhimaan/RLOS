package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


import lombok.Data;

@Data
@XmlRootElement(name = "Q_Expense_Detail_Grid")
@XmlAccessorType(XmlAccessType.FIELD)
public class ExpenseDetail {
    
    @XmlAttribute(name="InsertionOrderId")
    private String attributeId;

    @XmlElement(name="InsertionOrderId")
    private String elementId;
    
    @XmlElement(name="Applicant_Name")
    private String applicantName;
    
    @XmlElement(name="Type_of_Expense")
    private String typeOfExpense;
    
    @XmlElement(name="Description")
    private String description;
    
    @XmlElement(name="Include")
    private String include;
    
    @XmlElement(name="Amount")
    private String amount;
    
    @XmlElement(name="MemberID")
    private String memberId;
    
    @XmlElement(name="Total_Freq_Amount")
    private String totalFreqAmount;
    
    @XmlElement(name="Freq_Amount")
    private String freqAmount;
    
    @XmlElement(name="Frequency")
    private String frequency;

}
