package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
//@XmlRootElement(name = "WFGetWorkitemDataExt_Output")
@XmlRootElement(name = "WMFetchWorkItemAttributes_Output")
@XmlAccessorType(XmlAccessType.FIELD)
public class WorkItemFetchResponse extends IbpsResponse{
    
    @XmlElement(name="Exception")
    private IbpsException exception;
    
	// @XmlElement(name="WorkitemData")
	// private WorkitemData workitemData;

    @XmlElement(name="Attributes")
    private Attributes attributes;
}
