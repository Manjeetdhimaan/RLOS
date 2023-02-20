package com.jmmb.los.pb.security;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
@Component
@ConfigurationProperties(prefix = "security-config")
public class ApplicationSecurityConfig {
	private Integer tokenExpirationTime;
	private String keyGenrationAlgo;
	private Integer hmacKeySize;
	private Integer encrptionKeySize;
	private String encryptionSecretKey;

	private String allowedURLString;

	private List<String> whiteList = new ArrayList<>();

	@PostConstruct
	public void generateAllowedURLList() {
		log.info("Allowed URL List Generated!!!");
		String[] urlArr = this.allowedURLString.split(",");
		log.debug("URL Lists: "+Arrays.toString(urlArr));
		whiteList.addAll(Arrays.asList(urlArr));

	}
}
