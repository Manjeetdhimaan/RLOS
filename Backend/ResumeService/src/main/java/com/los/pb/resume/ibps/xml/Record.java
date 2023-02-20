package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;
@Data
@XmlRootElement(name = "Record")
@XmlAccessorType(XmlAccessType.FIELD)
public class Record {
    
	@XmlElement(name="Found")
	private String Found;
	
	@XmlElement(name="ARN")
	private String ARN;
    
	@XmlElement(name="createdOn")
	private String createdOn;
    
	@XmlElement(name="otp")
	private String otp;
    
	@XmlElement(name="Flag")
    private String Flag;
	
	@XmlElement(name="APP_TYPE")
    private String appType;

	@XmlElement(name="APP_STATUS")
	private String appStatus;

	@XmlElement(name="INIT_DATE")
	private String initDate;

	@XmlElement(name="MOD_DATE")
	private String modDate;

	@XmlElement(name="IS_RESUMABLE")
	private String isResumable;

}
