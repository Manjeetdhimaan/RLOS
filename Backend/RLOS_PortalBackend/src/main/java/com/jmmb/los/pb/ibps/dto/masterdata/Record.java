package com.jmmb.los.pb.ibps.dto.masterdata;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@XmlRootElement(name = "Record")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class Record {
    
    @XmlElement(name = "Label")
    private String Label;
    
    @XmlElement(name = "Code")
    private String Code;
    
    @XmlElement(name = "LoanType")
    private String LoanType;

    @XmlElement(name = "LAST_VISITED_PAGE")
    private String lastPage;

    @XmlElement(name = "VISITOR_IP")
    private String ip;

    @XmlElement(name = "remark")
    private String remark;

    @XmlElement(name = "OTP")
    private String otp;

    @XmlElement(name = "GenerationTime")
    private String generationTime;
    
    @XmlElement(name = "Workitem")
    private String workitem;
    
    @XmlElement(name = "STATUS")
    private String status;
}
