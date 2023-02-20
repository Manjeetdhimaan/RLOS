package com.jmmb.los.pb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown=true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmploymentDetailsDTO {
    
    private Long id;
    private Long applicantId;
    private String empType;
    private EmpDetails empDetail;

    //to remove
    private BusinessDetailsDTO empDetailOld;
    
}
