package com.jmmb.los.pb.api.dto;

import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@Validated
public class AssetDTO {
    private Long id;
    
    @JsonProperty("applicantOrder")
    private Long applicantId;
    
    @Size(max = 200, message = "Asset Type cannot be more than 200 characters")
    private String type;

    @Size(max = 20, message = "Asset Code cannot be more than 200 characters")
    private String assetCode;
    
    @Size(max = 100, message = "Institution Name cannot be more than 100 characters")
    @JsonProperty("instName")
    private String institutionName;
    
    @Size(max = 13, message = "Value of Asset cannot be more than 13 characters")
    private String amount;
    
    @Size(max = 50, message = "Comments cannot be more than 50 characters")
    @JsonProperty("comment")
    private String comments;
}
