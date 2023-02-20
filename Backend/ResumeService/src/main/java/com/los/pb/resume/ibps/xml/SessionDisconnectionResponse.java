package com.los.pb.resume.ibps.xml;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="WMDisConnect_Output")
public class SessionDisconnectionResponse extends IbpsResponse{

    @XmlElement(name="Exception")
    private IbpsException Exception;


}
