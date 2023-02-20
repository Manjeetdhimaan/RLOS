package com.jmmb.los.pb.api.dto.employment;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import com.jmmb.los.pb.api.dto.AddressDTO;

@Data
@Validated
public class SalariedDetailsDTO {
	@Size(max = 40, message = "Name Of The Organization cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Name Of The Organization")
	private String companyName;
	
	@Size(max = 30, message = "Employment Sector cannot be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z_]*$", message = "Invalid characters found in Employment Sector")
	private String sector;
	
	@Size(max = 30, message = "Job Title cannot be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z_]*$", message = "Invalid characters found in Job Title")
	private String jobTitle;
	
	@Size(max = 20, message = "Job Title Description cannot be more than 20 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Job Title Description")
	private String jobTitleDescription;
	
	@Size(max = 3, message = "Employment Length (Years) can not  be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Employment Length (Years)")
	private String yearsEmployed;
	
	@Size(max = 2, message = "Employment Length (Months) can not  be more than 2 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Employment Length (Months)")
	private String monthsEmployed;
	
	@Size(max = 15, message = "Work Permit Present can not  be more than 15 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z\\s]*$", message = "Invalid characters found in Work Permit Present")
	private String workPermitPresent;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Work Permit Expiry must be in YYYY-MM-DD Format")
	private String workPermitExpiry;
	
	private String workPermitNumber;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Employment Start Date must be in YYYY-MM-DD Format")
	private String empDate;
	
	@Valid
	private List<AddressDTO> addresses;
}
