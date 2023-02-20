package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="WMConnect_Output")
public class GetSessionResponse extends IbpsResponse {
	
	@XmlElement(name="Exception")
	private IbpsException Exception;
	
	@XmlElement(name="Participant")
    private Participant Participant;
	
	@XmlElement(name="LastLoginTime")
    private String LastLoginTime;
	
	@XmlElement(name="LastLoginFailureTime")
    private String LastLoginFailureTime;
	
	@XmlElement(name="FailureAttemptCount")
    private String FailureAttemptCount;
	
	@XmlElement(name="TimeZoneInfo")
    private TimeZoneInfo TimeZoneInfo;
	

}



	