package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

import lombok.Data;
@Data
@XmlAccessorType(XmlAccessType.FIELD)
public class Params {

    @XmlElement(name = "Records")
    public Records records;
    
    private Integer TotalRetrieved;
}
