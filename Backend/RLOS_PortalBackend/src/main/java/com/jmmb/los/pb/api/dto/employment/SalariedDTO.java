package com.jmmb.los.pb.api.dto.employment;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Validated
public class SalariedDTO extends IEmployment {
	@Valid
	private SalariedDetailsDTO empDetail;

	public SalariedDTO() {
		this.empType = EmploymentType.EMP.getShortName();
	}
}
