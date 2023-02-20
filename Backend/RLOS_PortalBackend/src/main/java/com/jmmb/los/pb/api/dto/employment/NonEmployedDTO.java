package com.jmmb.los.pb.api.dto.employment;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Validated
public class NonEmployedDTO extends IEmployment {
	@Valid
	private NonEmployedDetailsDTO empDetail;

	public NonEmployedDTO() {
		this.empType = EmploymentType.NEMP.getShortName();
	}
}
