package com.jmmb.los.pb.ibps.dto.setattributes;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.jmmb.los.pb.ibps.dto.Attributes;

import lombok.Data;

@Data
@XmlRootElement(name="WMAssignWorkItemAttributes_Input")
@XmlAccessorType(XmlAccessType.FIELD)
public class SetAttributesRequest {
    @XmlElement(name = "Option")
    private String option;

    @XmlElement(name = "EngineName")
    private String engineName;

    @XmlElement(name = "SessionId")
    private String sessionId;

    @XmlElement(name = "ProcessInstanceId")
    private String processInstanceId;

    @XmlElement(name = "WorkItemId")
    private String workItemId;

    @XmlElement(name = "ProcessDefId")
    private String processDefId;

    @XmlElement(name = "ActivityId")
    private String activityId;

    @XmlElement(name = "UserDefVarFlag")
    private String userDefVarFlag;

    @XmlElement(name = "Attributes")
    //private String attributes;
    private Attributes attributes;
}
