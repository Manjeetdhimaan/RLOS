package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlElement;

import lombok.Data;

@Data
public class Participant {
	
	@XmlElement(name="SessionId")
	private String SessionId;
	
	@XmlElement(name="LastLoginTime")
    private String LastLoginTime;

	@XmlElement(name="Privileges")
    private String Privileges;
	
		
	@XmlElement(name="IsAdmin")
    private String IsAdmin;
}
