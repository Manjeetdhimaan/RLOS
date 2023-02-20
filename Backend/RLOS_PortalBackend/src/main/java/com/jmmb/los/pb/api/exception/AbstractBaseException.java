package com.jmmb.los.pb.api.exception;

import org.springframework.validation.Errors;

import lombok.Getter;

@Getter
public abstract class AbstractBaseException extends RuntimeException {

	private static final long serialVersionUID = 7924866455866803748L;
	
	protected int exceptionCode;
    protected String errorCode;
    protected String description;
    protected Errors errors;

}
