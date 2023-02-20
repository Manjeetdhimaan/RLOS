package com.jmmb.los.pb.api.dto.employment;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Validated
public class RetiredDTO extends IEmployment {
	@Valid
	private RetiredDetailsDTO empDetail;

	public RetiredDTO() {
		this.empType = EmploymentType.RET.getShortName();
	}
}
