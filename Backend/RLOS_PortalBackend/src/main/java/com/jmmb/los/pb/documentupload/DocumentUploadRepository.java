package com.jmmb.los.pb.documentupload;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import com.google.gson.Gson;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Repository
public class DocumentUploadRepository {

    @Value("${spring.od-upload-url}")
    private String uploadUrl;
    
    @Value("${spring.od-download-url}")
    private String downloadUrl;

    public DocumentUploadResponse fetchResponseFromOD(String requestJson) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestBody = new HttpEntity<>(requestJson, httpHeaders);
        log.info("Request is: " + requestBody);
        ResponseEntity<String> response = restTemplate.postForEntity(uploadUrl, requestBody, String.class);

        if (response.getBody() != null) {
            String responseOutput = response.getBody();
            log.info("Response is: " + responseOutput);
            DocumentUploadResponse documentUploadResponse = new Gson().fromJson(responseOutput,
                    DocumentUploadResponse.class);
            if(String.valueOf(documentUploadResponse.getDocIndex()).equalsIgnoreCase("0")){
            	return null;
            }
            log.info("DocumnetUploadResponse -> " + documentUploadResponse);
            return documentUploadResponse;
        } else {
            return null;
        }

    }
    
    public DocumentDownloadResponse fetchDocumentFromOD(String requestJson) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> requestBody = new HttpEntity<>(requestJson, httpHeaders);

        ResponseEntity<String> response = restTemplate.postForEntity(downloadUrl, requestBody, String.class);

        if (response.getBody() != null) {
            String responseOutput = response.getBody();
            log.info("Response is: " + responseOutput);
            DocumentDownloadResponse documentDownloadResponse = new Gson().fromJson(responseOutput,
            		DocumentDownloadResponse.class);
            log.info("DocumnetUploadResponse -> " + documentDownloadResponse);
            return documentDownloadResponse;
        } else {
            return null;
        }

    }
}
