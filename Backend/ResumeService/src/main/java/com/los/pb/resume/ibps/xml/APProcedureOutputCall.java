package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;
@Data
@XmlRootElement(name = "APProcedureWithColumnNames_output")
@XmlAccessorType(XmlAccessType.FIELD)
public class APProcedureOutputCall {

    @XmlElement(name = "Output")
    public DbOutput output;
    
    @XmlElement(name = "Option")
    private String Option;
    
    @XmlElement(name = "MainCode")
    private String MainCode;
    
    @XmlElement(name = "Message")
    private String Message;
    
    
}
