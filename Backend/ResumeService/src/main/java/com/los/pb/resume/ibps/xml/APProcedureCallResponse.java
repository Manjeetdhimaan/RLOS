package com.los.pb.resume.ibps.xml;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="APProcedureWithColumnNames_Output")
public class APProcedureCallResponse extends IbpsResponse {
	
		
	@XmlElement(name="Exception")
	private IbpsException Exception;
	
}
