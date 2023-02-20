package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlElement;

import lombok.Data;

@Data
public class IbpsException {
	
	@XmlElement(name = "MainCode")
	private String MainCode;
	
}
