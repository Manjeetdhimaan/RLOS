package com.jmmb.los.pb.ibps.dto;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@XmlRootElement(name="WMConnect_Output")
@XmlAccessorType(XmlAccessType.FIELD)
public class GetSessionResponse extends IbpsResponse {
	
	@XmlElement(name="Exception")
	private IbpsException exception;
	
	@XmlElement(name="Participant")
    private Participant participant;
	
	/*public static void main(String[] args) throws JAXBException {
	    String xml = "<WMConnect_Output>\r\n" + 
	            "<Option>WMConnect</Option>\r\n" + 
	            "<Exception>\r\n" + 
	            "<MainCode>0</MainCode>\r\n" + 
	            "</Exception>\r\n" + 
	            "<Participant>\r\n" + 
	            "<SessionId>398100636</SessionId></Participant></WMConnect_Output>";
	    JAXBContext context = JAXBContext.newInstance(GetSessionResponse.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        GetSessionResponse ad2 = (GetSessionResponse) unmarshaller.unmarshal(new StringReader(xml));
        System.out.println(ad2);
    }*/

}
	