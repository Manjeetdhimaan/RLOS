package com.los.pb.resume.dto;

import lombok.Data;

@Data
public class ApplicationDetailsDTO {
	private String applicationType;
	private String applicationStatus;
	private String arn;
	private String initiationDate;
	private String modifyDate;
	private boolean isResumable;
}