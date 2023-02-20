package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_PROPERTY")
@XmlAccessorType(XmlAccessType.FIELD)
public class PropertyDetail {

    @XmlAttribute(name="InsertionOrderId")
    private String attributeId;

    @XmlElement(name="InsertionOrderId")
    private String elementId;

    @XmlAttribute(name="Address_Line_1")
    private String address;

    @XmlElement(name="CityOrTown")
    private String city;

    @XmlAttribute(name="StateOrRegion")
    private String state;

    @XmlElement(name="Country")
    private String country;

    @XmlAttribute(name="Postal_Code")
    private String zipCode;

    @XmlElement(name="Valuator")
    private String valuator;

    @XmlAttribute(name="Appraised_Value")
    private String appraisedValue;

    @XmlElement(name="Appraisal_Date")
    private String appraisalDate;

    @XmlAttribute(name="Currency_Code")
    private String currencyCode;

    @XmlElement(name="Lending_Value")
    private String lendingValue;
    
    @XmlElement(name="CollateralType")
    private String collateralType;

}
