package com.jmmb.los.pb.ibps.dto.setattributes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name="InsertionOrderIdValue")
@XmlAccessorType(XmlAccessType.FIELD)
public class InsertionOrderIdValue {
    
    @XmlElement(name="HashId")
    private String hashId;
    
    @XmlElement(name="InsertionOrderId")
    private String insertionOrderId;

}
