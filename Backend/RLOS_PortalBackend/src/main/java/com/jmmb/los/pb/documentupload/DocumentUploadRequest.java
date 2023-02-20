package com.jmmb.los.pb.documentupload;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class DocumentUploadRequest {

	private String workitemName;
	private String docName;
	private String data;
	private int docIndex;
	private String PortalRequest;
}
