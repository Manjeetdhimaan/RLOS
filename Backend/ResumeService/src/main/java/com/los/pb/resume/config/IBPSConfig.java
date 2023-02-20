package com.los.pb.resume.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Component
@ConfigurationProperties(prefix = "ibps-config")
@Getter
@Setter
@ToString
public class IBPSConfig {

	private String engineName;
	private String jtsIpname;
	private Integer jtsPortname;
    private String ibpsPushUserName;
    private String ibpsPushUserPassword;
    private String ibpsMailUserName;
    private String ibpsMailUserPassword;
    private String serviceUrl;
    
   
}