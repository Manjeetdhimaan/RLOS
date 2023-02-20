package com.jmmb.los.pb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown=true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BusinessDetailsDTO {
    
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String country;
    private String employerName;  
    private String state;
    private String zipCode;
    private String businessName;
    private String businessAddress;
    private String businessNature;
    private String businessIncome;
    private String businessExpense;
    private String profit;

}
