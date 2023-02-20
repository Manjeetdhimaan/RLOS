package com.jmmb.los.pb.ibps.dto.masterdata;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@XmlRootElement(name = "APProcedureWithColumnNames_output")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class APProcedureWithColumnNames {

    @XmlElement(name = "Output")
    private DbOutput Output;

    @XmlElement(name = "Option")
    private String Option;

    @XmlElement(name = "MainCode")
    private String MainCode;

    @XmlElement(name = "Message")
    private String Message;

}
