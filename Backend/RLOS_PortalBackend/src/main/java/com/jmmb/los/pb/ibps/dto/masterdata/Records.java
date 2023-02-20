package com.jmmb.los.pb.ibps.dto.masterdata;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@XmlRootElement(name = "Records")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class Records {
    
    @XmlElement(name = "Record")
    private List<Record> Record;

}
