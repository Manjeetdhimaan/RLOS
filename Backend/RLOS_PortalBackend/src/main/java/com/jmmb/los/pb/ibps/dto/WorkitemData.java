package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name="WorkitemData")
@XmlAccessorType(XmlAccessType.FIELD)
public class WorkitemData {
    
    @XmlElement(name="Attributes")
    private Attributes attributes;
}
