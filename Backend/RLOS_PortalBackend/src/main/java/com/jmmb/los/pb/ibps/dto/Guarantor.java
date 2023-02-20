package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_GUARANTOR")
@XmlAccessorType(XmlAccessType.FIELD)
public class Guarantor {

    @XmlElement(name="InsertionOrderId")
    private String elementId;
    
    @XmlAttribute(name="InsertionOrderId")
    private String attributeId;

    @XmlElement(name="Name")
    private String name;

    @XmlElement(name="Employer_Name")
    private String employerName;

    @XmlElement(name="Address_Line_1")
    private String addressLine;

    @XmlElement(name="Street_Address")
    private String streetAddress;

    @XmlElement(name="Street_Add_Code")
    private String streetAddressCode;

    @XmlElement(name="Country")
    private String country;

    @XmlElement(name="Country_Code")
    private String countryCode;

    @XmlElement(name="StateOrRegion")
    private String state;

    @XmlElement(name="CityOrTown")
    private String cityTown;

    @XmlElement(name="CityTown_Code")
    private String cityTownCode;

    @XmlElement(name="Postal_Code")
    private String postalCode;

    @XmlElement(name="Relationship")
    private String relationship;

    @XmlElement(name="Relationship_Code")
    private String relationshipCode;

    @XmlElement(name="Contact_No")
    private String contactNo;
}
