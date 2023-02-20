package com.jmmb.los.pb.api.dto.employment;

import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

import org.springframework.validation.annotation.Validated;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.Getter;
import lombok.Setter;


@JsonIgnoreProperties(ignoreUnknown = true)
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "empType")
@JsonSubTypes({
		@JsonSubTypes.Type(value = SalariedDTO.class, name = "EMP001"),
		@JsonSubTypes.Type(value = SalariedDTO.class, name = "EMP002"),
		@JsonSubTypes.Type(value = SelfEmployedDTO.class, name = "SEMP001"),
		@JsonSubTypes.Type(value = SelfEmployedDTO.class, name = "SEMP002"),
		@JsonSubTypes.Type(value = SelfEmployedDTO.class, name = "SEMP003"),
		@JsonSubTypes.Type(value = RetiredDTO.class, name = "RT001"),
		@JsonSubTypes.Type(value = NonEmployedDTO.class, name = "NEMP001"),
		@JsonSubTypes.Type(value = StudentDTO.class, name = "STU001")
})
@Setter
@Getter
@Validated
public class IEmployment {
	protected Long id;
	
	@Size(max = 50, message = "Employment Type Code cannot be more than 30 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Employment Type Code")
	protected String empType;
	
	@Size(max = 200, message = "Employment Type cannot be more than 200 characters")
	@Pattern(regexp = "^(?!(?i)exec\\b)(?!(?i)execute\\b)(?!(?i)select\\b)(?!(?i)ping\\b)[A-Za-z0-9!@#$%&()\\-,.'\\/+\\s]*$", message = "Invalid characters found in Employment Type")
	protected String empTypeLabel;
}
