package com.jmmb.los.pb.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.Data;

@Data
@Component
public class MasterConfigDetail {
	@Value("${spring.session-config.session-Timeout-Interval}")
	private String sessionTimeoutInterval;
	
	@Value("${spring.session-config.signal-Timeout-Interval}")
	private String signalTimeoutInterval;
	
	@Value("${spring.http.multipart.max-file-size}")
    private String maxFileSize;
	
	@Value("${spring.max-co-applicants}")
	private String maxCoApplicants;
    
    @Value("${spring.max-guarantors}")
    private String maxGuarantors;
	
	@Value("${spring.file-types}")
	private String fileTypes;
	
	@Value("${spring.max-pay-offs}")
	private String maxPayOffs;
	
	@Value("${otp-config.otpFormat}")
	private String otpFormat;
	
	@Value("${otp-config.otpValidFor}")
	private String otpValidFor;
	
	@Value("${otp-config.resendOtpAfter}")
	private String resendOtpAfter;
	
}
