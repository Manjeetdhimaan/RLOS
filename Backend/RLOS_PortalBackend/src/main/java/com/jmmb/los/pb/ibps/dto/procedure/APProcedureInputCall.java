package com.jmmb.los.pb.ibps.dto.procedure;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@XmlRootElement(name = "APProcedureWithColumnNames_Input")
@XmlAccessorType(XmlAccessType.FIELD)
@Data
public class APProcedureInputCall {
	private final String Option = "APProcedureWithColumnNames";
	// EngineName
	@XmlElement(name="EngineName")
	private String engineName;
	// SessionId
	@XmlElement(name="SessionId")
	private String sessionId;
	// ProcName
	@XmlElement(name="ProcName")
	private String procedureName;
	// Params comma separated
	@XmlElement(name="Params")
	private String params;
}
