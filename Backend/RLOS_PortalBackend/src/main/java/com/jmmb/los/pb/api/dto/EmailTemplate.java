package com.jmmb.los.pb.api.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmailTemplate {
	DOCUMENT_UPLOADED("Document Uploaded"),
	APPLICATION_INITIATION("Application Initiation"),
	PORTAL_APPLICATION_SUBMISSION("Portal Application Submission"),
	SAVE_AND_EXIT("Save and Exit");
	private String name;
}
