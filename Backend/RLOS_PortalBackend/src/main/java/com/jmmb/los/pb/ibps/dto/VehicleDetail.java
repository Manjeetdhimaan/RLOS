package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_VECHILE")
@XmlAccessorType(XmlAccessType.FIELD)
public class VehicleDetail {

    @XmlAttribute(name="InsertionOrderId")
    private String attributeId;

    @XmlElement(name="InsertionOrderId")
    private String elementId;

    @XmlAttribute(name="Make")
    private String make;

    @XmlElement(name="Model")
    private String model;

    @XmlAttribute(name="Type")
    private String type;

    @XmlElement(name="Color")
    private String color;

    @XmlAttribute(name="Registration_Num")
    private String registrationNo;

    @XmlElement(name="Yr_Of_Manft")
    private String year;

    @XmlAttribute(name="Engine_Num")
    private String engineNo;

    @XmlElement(name="Chasis_Num")
    private String chasisNo;

    @XmlElement(name="Current_Val")
    private String currentValue;

    @XmlAttribute(name="Currency_Code")
    private String currencyCode;
    
    @XmlAttribute(name="CollateralType")
    private String collateralType;

}
