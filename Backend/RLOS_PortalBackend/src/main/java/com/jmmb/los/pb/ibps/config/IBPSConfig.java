package com.jmmb.los.pb.ibps.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.Data;

@Component
@ConfigurationProperties(prefix = "ibps-config")
@Data
public class IBPSConfig {

    private String engineName;
    private String jtsIpname;
    private Integer jtsPortname;
    private String processDefId;
    private String initQueueId;
    private String ibpsPushUserName;
    private String ibpsPushUserPassword;
    private String ibpsMailUserName;
    private String ibpsMailUserPassword;
    private String initiateFromActivityId;
    private String workitemId;
    private String serviceUrl;
    private long mdmTtl;
    private long otpTtl;
    private Boolean otpValidityCheck;
}