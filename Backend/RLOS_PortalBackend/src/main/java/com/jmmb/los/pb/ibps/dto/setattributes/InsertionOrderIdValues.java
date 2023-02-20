package com.jmmb.los.pb.ibps.dto.setattributes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name="InsertionOrderIdValues")
@XmlAccessorType(XmlAccessType.FIELD)
public class InsertionOrderIdValues {

    @XmlElement(name = "InsertionOrderIdValue")
    private InsertionOrderIdValue value;
}
