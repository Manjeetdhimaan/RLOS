package com.jmmb.los.pb.documentupload;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DocumentUploadResponse {
	
	private int statusCode;
	private int docIndex;
	private String imageIndex;
	private String outputXml;
	private String errorMsg;
}
