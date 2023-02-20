package com.jmmb.los.pb.api.dto.employment;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Validated
public class SelfEmployedDTO extends IEmployment {
	@Valid
	private SelfEmployedDetailsDTO empDetail;

	public SelfEmployedDTO() {
		this.empType = EmploymentType.SEMP.getShortName();
	}
}
