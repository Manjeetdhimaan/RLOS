package com.jmmb.los.pb.api.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MasterDataDTO {

    @JsonProperty(value="COMMON_Prefix")
    private List<DataMapper> prefix = new ArrayList<>();

    @JsonProperty(value="COMMON_Suffix")
    private List<DataMapper> suffix = new ArrayList<>();

    @JsonProperty(value="COMMON_Country")
    private List<DataMapper> country = new ArrayList<>();

    @JsonProperty(value="COMMON_MaritalStatus")
    private List<DataMapper> maritalStatus = new ArrayList<>();

    @JsonProperty(value="COMMON_IDType")
    private List<DataMapper> idType = new ArrayList<>();

    @JsonProperty(value="COMMON_Employment_Type")
    private List<DataMapper> employmentType = new ArrayList<>();

    @JsonProperty(value="COMMON_EMP_SECTOR")
    private List<DataMapper> employmentSector = new ArrayList<>();

    @JsonProperty(value="COMMON_BUSINESS_TYPE")
    private List<DataMapper> businessType = new ArrayList<>();

    @JsonProperty(value="COMMON_INCOME_TYPE")
    private List<DataMapper> incomeType = new ArrayList<>();

    @JsonProperty(value="COMMON_Income_Frequency")
    private List<DataMapper> incomeFrequency = new ArrayList<>();

    @JsonProperty(value="COMMON_PEP_RELATIONSHIP")
    private List<DataMapper> pepRelation = new ArrayList<>();

    @JsonProperty(value="COMMON_GENDER_TYPE")
    private List<DataMapper> gender = new ArrayList<>();

    @JsonProperty(value="COMMON_CURRENCY_TYPE")
    private List<DataMapper> currencyType = new ArrayList<>();

    @JsonProperty(value="COMMON_FamilyRelationship")
    private List<DataMapper> familyRelationship = new ArrayList<>();

    @JsonProperty(value="COMMON_RELATIONSHIP")
    private List<DataMapper> loanRelationship = new ArrayList<>();

    @JsonProperty(value="COMMON_Product_Name")
    private List<DataMapper> productName = new ArrayList<>();

    @JsonProperty(value="COMMON_Loan_Purpose")
    private List<DataMapper> loanPurpose = new ArrayList<>();

    @JsonProperty(value="COMMON_Card_Type")
    private List<DataMapper> cardType = new ArrayList<>();

    @JsonProperty(value="COMMON_Collateral_Type")
    private List<DataMapper> collateralType = new ArrayList<>();

    @JsonProperty(value="COMMON_DOC_TYPES")
    private List<DataMapper> documentList = new ArrayList<>();

    @JsonProperty(value="COMMON_BranchList")
    private List<DataMapper> branchList = new ArrayList<>();

    @JsonProperty(value="COMMON_DependentList")
    private List<DataMapper> dependentList = new ArrayList<>();

    ////
    @JsonProperty(value="COMMON_JOB_TITLE")
    private List<DataMapper> jobTitleList = new ArrayList<>();
    
    @JsonProperty(value="COMMON_RENT_OPTION")
    private List<DataMapper> rentOptions = new ArrayList<>();    
    
    @JsonProperty(value="COMMON_Asset_Type")
    private List<DataMapper> assetTypeList = new ArrayList<>();
    
    @JsonProperty(value="COMMON_Loan_Product")
    private List<DataMapper> loanProductList = new ArrayList<>();
    
    @JsonProperty(value="DOCUMENT_TYPES")
    private List<DataMapper> documentTypes = new ArrayList<>();
    
    @JsonProperty(value="CONSENT_MESSAGE")
    private List<DataMapper> consentMessage = new ArrayList<>();
    
    @JsonProperty(value="EDUCATION_TYPES")
    private List<DataMapper> educationTypes = new ArrayList<>();
    
    @JsonProperty(value="APPOINTMENT_HOURS")
    private List<DataMapper> appointmentHours = new ArrayList<>();

    @JsonProperty(value="APPOINTMENT_MINUTES")
    private List<DataMapper> appointmentMinutes = new ArrayList<>();
    
    @JsonProperty(value="MIN_MAX_AGES")
    private List<DataMapper> minMaxAges = new ArrayList<>();
    
    @JsonProperty(value="REFERRAL_SOURCE")
    private List<DataMapper> referalSource = new ArrayList<>();

}