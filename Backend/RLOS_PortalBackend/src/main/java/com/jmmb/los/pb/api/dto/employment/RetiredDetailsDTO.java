package com.jmmb.los.pb.api.dto.employment;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.jmmb.los.pb.api.dto.AddressDTO;

import lombok.Data;

@Data
@Validated
public class RetiredDetailsDTO {
	@Size(max = 40, message = "Name Of The Organization cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Name Of The Organization")
	private String lastCompanyName;
	
	@Size(max = 30, message = "Employment Sector cannot be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z_]*$", message = "Invalid characters found in Employment Sector")
	private String sector;
	
	@Size(max = 30, message = "Job Title cannot be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Z_]*$", message = "Invalid characters found in Job Title")
	private String jobTitle;
	
	@Size(max = 20, message = "Job Title Description cannot be more than 20 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Job Title Description")
	private String jobTitleDescription;
	
	@Size(max = 2, message = "Years since Retired can not  be more than 2 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Years since Retired")
	private String yearOfRetirement;
	
	@Valid
	private List<AddressDTO> addresses;
}
