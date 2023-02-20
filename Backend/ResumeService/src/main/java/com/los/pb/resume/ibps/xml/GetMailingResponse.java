package com.los.pb.resume.ibps.xml;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="WFAddToMailQueue_Output")

public class GetMailingResponse extends IbpsResponse{

    @XmlElement(name="Exception")
    private IbpsException Exception;
}
