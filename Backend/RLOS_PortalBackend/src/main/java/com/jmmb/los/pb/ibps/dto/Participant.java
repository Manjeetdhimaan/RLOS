package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Participant")
@XmlAccessorType(XmlAccessType.FIELD)
public class Participant {
	
	@XmlElement(name="SessionId")
	private String sessionId;
	
	@XmlElement(name="LastLoginTime")
    private String lastLoginTime;

	@XmlElement(name="Privileges")
    private String privileges;
	
	@XmlElement(name="IsAdmin")
    private String admin;
}
