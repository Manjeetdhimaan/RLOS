package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "PIAsset")
@XmlAccessorType(XmlAccessType.FIELD)
public class AssetDetailGrid {
	// DB Table: NG_RLOS_PIAsset_Grid
	// MonthlyIncome
	// Balance
    
    @XmlAttribute(name="InsertionOrderId")
    private String attributeId;

    @XmlElement(name="InsertionOrderId")
    private String elementId;
    
    @XmlElement(name="Applicant_Id")
    private String memberId;
    
    @XmlElement(name="AssetsType")
    private String assetType;
    
    @XmlElement(name="InstitutionName")
    private String institutionName;
    
    @XmlElement(name="ValueOfAsset")
    private String valueOfAsset;
    
    @XmlElement(name="Remarks")
    private String remarks;
    
    @XmlElement(name="AssetTypeLabel")
    private String assetTypeLabel;
    
}
