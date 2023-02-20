package com.los.pb.resume.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestConfig {

    @Bean(name = "restTemplate")
    public RestTemplate getRestTemplate() {
            return new RestTemplate();

    }
}
