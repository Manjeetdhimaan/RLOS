package com.jmmb.los.pb.ibps.dto.createworkitem;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.jmmb.los.pb.ibps.dto.IbpsException;
import com.jmmb.los.pb.ibps.dto.IbpsResponse;
import com.jmmb.los.pb.ibps.dto.setattributes.InsertionOrderIdValues;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="WFUploadWorkItem_Output")
@XmlAccessorType(XmlAccessType.FIELD)
public class CreateWorkItemResponse extends IbpsResponse {
	
	@XmlElement(name="Exception")
	private IbpsException exception;
	
	@XmlElement(name="ProcessInstanceId")
    private String processInstanceId;
	
	@XmlElement(name="InsertionOrderIdValues")
    List<InsertionOrderIdValues> values;
}
