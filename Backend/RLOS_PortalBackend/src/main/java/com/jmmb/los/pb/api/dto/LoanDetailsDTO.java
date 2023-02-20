package com.jmmb.los.pb.api.dto;

import java.util.List;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonInclude(JsonInclude.Include.NON_NULL)
@Validated
public class LoanDetailsDTO {

    /*private Long id;
    //private String loanType;
    private String loanProduct;
    //private String collateralType;
    private CollateralDetailsDTO collateralTypeDetails;
    //private String loanTerm;
    //private Long amountRequired;
    */
    // Loan Details
	private Long id;
	
	private String order;
	
	@Size(max = 20, message = "Product Name cannot be more than 20 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z\\s]*$", message = "Invalid characters found in Product Name")
    private String product;
	
	@Size(max = 20, message = "Loan Type cannot be more than 20 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z\\s]*$", message = "Invalid characters found in Loan Type")
    private String loanType;
	
    //private String facilityType;
	@Size(max = 50, message = "Loan Purpose Code cannot be more than 50 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid characters found in Loan Purpose Code")
    private String loanPurposeType;
	
	@Size(max = 10, message = "Loan Purpose cannot be more than 10 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9\\-\\/_\\s]*$", message = "Invalid characters found in Loan Purpose")
    private String loanPurposeOthers;
	
	//@Min(value = 1L, message = "Invalid Order Min")
	//@Max(value = 99999999999L, message = "Invalid Loan Amount")
    private Double amountRequired;
	
	@Size(max = 5, message = "Loan Term cannot be more than 5 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Loan Term")
    private String loanTerm;
	
    // Collateral Details
    private Long collateralInsertionId;
    private String hasCollateral;
    private String collateralType;
    private String collateralName;
    private String otherCollateral;
    private Double collateralValue;
    private Double presentCollateralValue;
    private String currency;
    private String primaryOwner;
    private List<CreditCardDTO> creditCardDetails;
    private List<OverdraftDTO> overdraftDetails;
}
