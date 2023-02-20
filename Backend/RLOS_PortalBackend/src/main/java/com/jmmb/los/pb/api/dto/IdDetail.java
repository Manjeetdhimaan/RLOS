package com.jmmb.los.pb.api.dto;


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
public class IdDetail {
	private Long id;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "ID Expiration Date must be in YYYY-MM-DD Format")
	private String idExpDate;
	
	@Size(max = 60, message = "ID Type Code cannot be more than 60 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z_]*$", message = "Invalid characters found in ID Type Code")
    private String idType;
	
	@Size(max = 50, message = "ID Type cannot be more than 50 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z'\\s]*$", message = "Invalid characters found in ID Type Code")
    private String idTypeLabel;
    
    @Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "ID Issue Date must be in YYYY-MM-DD Format")
    private String idIssueDate;
    
    @Size(max = 16, message = "ID Number cannot be more than 16 characters")
    @Size(min = 2, message = "ID Number cannot be less than 2 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9]*$", message = "Invalid characters found in ID Number")
    private String idNumber;
    
    @Size(max = 35, message = "Issuing Country Code can not be more than 35 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z0-9_]*$", message = "Invalid characters found in Issuing Country Code")
    private String idIssuingCountry;
    
    @Size(max = 100, message = "Issuing Country Name can not be more than 100 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z()-,.'_\\s]*$", message = "Invalid characters found in Issuing Country Name")
	private String idIssuingCountryLabel;
}
