package com.los.pb.resume.util;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
@ConfigurationProperties(prefix = "security-config")
public class ApplicationSecurityConfig {
	private Integer tokenExpirationTime;
	private String keyGenrationAlgo;
	private Integer hmacKeySize;
	private Integer encrptionKeySize;
	private String encryptionSecretKey;

}

