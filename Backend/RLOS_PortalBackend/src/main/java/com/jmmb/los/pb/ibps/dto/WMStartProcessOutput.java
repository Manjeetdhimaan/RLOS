package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;


import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="WMStartProcess_Output")
public class WMStartProcessOutput extends IbpsResponse{

	@XmlElement(name="Exception")
	private IbpsException Exception;
}