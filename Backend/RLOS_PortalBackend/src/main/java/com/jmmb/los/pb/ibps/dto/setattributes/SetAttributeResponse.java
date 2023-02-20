package com.jmmb.los.pb.ibps.dto.setattributes;

import java.util.List;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import com.jmmb.los.pb.ibps.dto.IbpsException;
import com.jmmb.los.pb.ibps.dto.IbpsResponse;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="WFSetAttributes_Output")
@XmlAccessorType(XmlAccessType.FIELD)
public class SetAttributeResponse extends IbpsResponse{

    @XmlElement(name="Exception")
    private IbpsException exception;
    
    @XmlElement(name="InsertionOrderIdValues")
    List<InsertionOrderIdValues> values;
    
    
}
