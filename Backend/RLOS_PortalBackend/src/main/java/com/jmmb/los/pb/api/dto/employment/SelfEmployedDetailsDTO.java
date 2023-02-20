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
public class SelfEmployedDetailsDTO {
	@Size(max = 40, message = "Name Of The Organization cannot be more than 40 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Name Of The Organization")
	private String businessName;
	
	@Pattern(regexp = "^([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))$", message = "Business Start Date must be in YYYY-MM-DD Format")
	private String businessDate;
	
	@Size(max = 20, message = "Business Type cannot be more than 20 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9\\s]*$", message = "Invalid characters found in Business Type")
	private String businessType;
	
	@Size(max = 3, message = "Business Length (Years) can not  be more than 3 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Business Length (Years)")
	private String yearsBusiness;
	
	@Size(max = 2, message = "Business Length (Years) can not  be more than 2 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[0-9]*$", message = "Invalid characters found in Business Length (Months)")
	private String monthsBusiness;
	
	@Size(max = 50, message = "Job Title Description cannot be more than 50 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Job Title Description")
	private String jobTitleDescription;
	
	@Valid
	private List<AddressDTO> addresses;
}
