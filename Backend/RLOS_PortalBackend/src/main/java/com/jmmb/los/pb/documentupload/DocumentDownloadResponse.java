package com.jmmb.los.pb.documentupload;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DocumentDownloadResponse {
	
	private int statusCode;
	private String message;
	private String document;
}
