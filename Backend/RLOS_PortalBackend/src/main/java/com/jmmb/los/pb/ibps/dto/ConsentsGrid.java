package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;

@Data
@XmlRootElement(name = "Q_RLOS_Concent")
@XmlAccessorType(XmlAccessType.FIELD)
public class ConsentsGrid {
	// DB Table: NG_RLOS_Consent
	// Concent BIT

	@XmlElement(name = "Concent")
	private Boolean consent;
}
