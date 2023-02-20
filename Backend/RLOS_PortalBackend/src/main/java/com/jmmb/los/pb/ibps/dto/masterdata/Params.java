package com.jmmb.los.pb.ibps.dto.masterdata;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;

import lombok.Data;

@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class Params {

    @XmlElement(name = "Records")
    private Records Records;
}
