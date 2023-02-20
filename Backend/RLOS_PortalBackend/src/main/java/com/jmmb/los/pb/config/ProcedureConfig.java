package com.jmmb.los.pb.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.Map;

@Data
@Component
@ConfigurationProperties(prefix = "procedure-config")
public class ProcedureConfig {

    private Map<String, String> procedureName;

}