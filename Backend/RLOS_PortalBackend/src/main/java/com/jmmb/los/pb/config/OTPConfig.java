package com.jmmb.los.pb.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "otp-config")
public class OTPConfig {
	private String otpFormat;
	
	private Long otpValidFor;
	
	private Long resendOtpAfter;	
}