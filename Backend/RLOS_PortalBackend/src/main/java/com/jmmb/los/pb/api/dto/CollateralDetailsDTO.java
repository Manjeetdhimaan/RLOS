package com.jmmb.los.pb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CollateralDetailsDTO {

    private Long id;

    // fields for vehicle loan
    private String make;
    private String model;
    private String type;
    private String engineNumber;
    private String currencyValue;
    private String currencyCode;
    private String colour;
    private String yearOfManufacture;
    private String chasisNumber;
    private String registrationNumber;

    // fields for Mortgage loan
    private String propertyAddress;
    private String city;
    private String country;
    private String zipCode;
    private String state;
    private String valuator;
    //currencyCode
    private String appraisedValue;
    private String appraisalDate;
    private String lendingValue;

    // fields for installment loan
    // IL - Mortgage Indemnity
    private String insuranceCompany;
    private String expiryDate;
    private String policyNumber;
    private String coverageAmount;
    // currencyCode
    private String principalBalanceAtExpiry;
    // propertyAddress

    // IL - Units
    private String ownedBy;
    private String typeOfUnits;
    private String numberOfUnits;
    private String currentValue;
    // currencyCode
    private String accountNumber;
    private String certificateNo;

    // IL - Life Insurance Policy
    private String owner;
    // insuranceCompany
    private String policyType;
    // policyNumber
    // currencyCode
    private String beneficiary;
    // coverageAmount
    private String cashSurrenderValue;
    private String issueDate;

    // IL - Risk Policy
    // insuranceCompany
    // policyType
    // policyNumber
    // coverageAmount
    // currencyCode
    // make
    // model
    private String vehicleNumber;
    private String year;
    private String titleOwner;
    // expiryDate

    // IL - 3rd Party Guarantee
    private String guarantorName;
    private String guarantorAddress;
    // city
    private String extentOfguarantee;
    private String guaranteeSupported;
    private String relationshipToBorrower;
    private String supportDescription;
    private String netWorth;
    // currencyCode

    // IL - Shares
    private String companyName;
    // ownedBy
    private String numberOfShares;
    // currencyCode
    // currentValue
    // accountNumber
    private String ttseSymbol;
    private String parValue;

    // IL - Bonds
    // companyName
    // ownedBy
    // currencyCode
    // currentValue
    private String dueDate;
    private String callable;
    private String dated;

    // IL - Risk Policy Building
    // insuranceCompany
    // policyNumber
    // propertyAddress
    // city
    // coverageAmount
    // currencyCode
    // country
    // islandDistrict
    // zip

    // IL - Other bank deposit account
    // ownedBy
    private String bankName;
    private String pledgedAccountType;
    // accountNumber
    private String certificateNumber;
    private String pledgedAmount;

    // IL - Our Deposit Account
    private String collateralValue;
    // currencyCode
    // ownedBy
    // pledgedAccountType
    // AccountNo

}
