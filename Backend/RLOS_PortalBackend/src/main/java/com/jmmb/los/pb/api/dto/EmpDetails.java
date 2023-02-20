package com.jmmb.los.pb.api.dto;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown=true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmpDetails {

    //emp Type = employed
    private String companyName; //employer name
    private String jobTitle;
    private String sector;
    private String empDate; //employment start date
    private String yearsEmployed;
    private String monthsEmployed;
    private Boolean workPermitPresent;
    private String workPermitExpiry;
//    private String empStreetName;
//    private String empApartment;
//    private String empCity;
//    private String empCountry;
//    private String empIslandDistrict;
//    private String empPOBoxNo;

    //Self Employed
    private String businessName;
    private String businessType;
    private String businessDate;
    private String yearsBusiness;
    private String monthsBusiness;

//    private String businessStreetName;
//    private String businessApartment;
//    private String businessCity;
//    private String businessCountry;
//    private String businessIslandDistrict;
//    private String businessPOBoxNo;

    //Retired
    private String lastCompanyName;
    private String yearOfRetirement;

    List<AddressDTO> addresses;



}
