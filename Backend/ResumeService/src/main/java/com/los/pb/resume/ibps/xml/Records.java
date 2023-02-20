package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;
@Data
@XmlRootElement(name = "Records")
@XmlAccessorType(XmlAccessType.FIELD)
public class Records {
    
    @XmlElement(name = "Record")
    public Record record;

}
