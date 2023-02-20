package com.jmmb.los.pb.api.dto.employment;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum EmploymentType {
	EMP("EMP001", "Salaried - Government", SalariedDTO.class),
	EMP2("EMP002", "Salaried - Private", SalariedDTO.class),
	SEMP("SEMP001", "Self Employed - Low Risk Business", SelfEmployedDTO.class),
	SEMP2("SEMP002", "Self Employed - Medium Risk Business", SelfEmployedDTO.class),
	SEMP3("SEMP003", "Self Employed - Medium Risk Business", SelfEmployedDTO.class),
	RET("RT001", "Retired", RetiredDTO.class),
	NEMP("NEMP001", "Non-Employed", NonEmployedDTO.class),
	STU("STU001", "Student", StudentDTO.class);
	
	private String shortName;
	private String employmentName;
	private Class<? extends IEmployment> employmentClassType;
}
