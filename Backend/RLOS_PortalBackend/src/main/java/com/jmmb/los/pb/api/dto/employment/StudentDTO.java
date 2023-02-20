package com.jmmb.los.pb.api.dto.employment;

import javax.validation.Valid;

import org.springframework.validation.annotation.Validated;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Validated
public class StudentDTO extends IEmployment {
	@Valid
	private StudentDetailsDTO empDetail;

	public StudentDTO() {
		this.empType = EmploymentType.STU.getShortName();
	}
}
