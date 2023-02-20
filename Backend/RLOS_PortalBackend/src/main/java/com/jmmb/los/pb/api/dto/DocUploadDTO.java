package com.jmmb.los.pb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocUploadDTO {
	private Long id;
	// private List<ImageDTO> images;
	private String data; // base64 string
	private String docIndex;
	// private String oDIndex;
	private String documentType;
	private String documentName;
	private String uploadDate;
	private boolean error;
	private String uploadedFor;
	private String accountRelationship;
	private String nibNumber;
	private int order;
	private String workitemNumber;
}
