package com.jmmb.los.pb.ibps.dto.createworkitem;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.jmmb.los.pb.ibps.dto.Attributes;

import lombok.Data;

@Data
@XmlRootElement(name = "WFUploadWorkItem_Input")
@XmlAccessorType(XmlAccessType.FIELD)
public class CreateWorkItemRequest {

    @XmlElement(name = "Option")
    private String option;

    @XmlElement(name = "EngineName")
    private String engineName;

    @XmlElement(name = "SessionId")
    private String sessionId;

    @XmlElement(name = "ProcessDefId")
    private String processDefId;

    @XmlElement(name = "QueueId")
    private String queueId;

    @XmlElement(name = "InitiateFromActivityId")
    private String initiateFromActivityId;

    @XmlElement(name = "InitiateAlso")
    private String initiateAlso;

    @XmlElement(name = "VariantId")
    private String variantId;

    @XmlElement(name = "IsWorkItemExtInfo")
    private String isWorkItemExtInfo;
    
    @XmlElement(name = "UserDefVarFlag")
    private String userDefVarFlag;    

    @XmlElement(name = "Attributes")
    private Attributes attributes;

//    @XmlElement(name = "Documents")
//    private Doc documents;

}
