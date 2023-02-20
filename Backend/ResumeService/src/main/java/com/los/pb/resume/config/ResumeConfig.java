package com.los.pb.resume.config;

import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "resume-config")
public class ResumeConfig {
	
	private String serviceURL;
	private Map<String, String> resumeProcedureName;
	private Long otpValidFor;
	private String otpFormat;
	private Long resendOtpAfter;
	private Long sessionTimeoutInterval;
	private Long signalTimeoutInterval;
}
