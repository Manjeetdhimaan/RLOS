package com.los.pb.resume.ibps.xml;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@XmlRootElement(name = "APProcedureWithColumnNames_Input")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class APProcedureInputCall {
	
	private final String Option ="APProcedureWithColumnNames";
	
	//EngineName
	private String EngineName;

	//SessionId
	private String SessionId;
	//ProcName
	private String ProcName;
	//Params comma separated
	private String Params;


}
