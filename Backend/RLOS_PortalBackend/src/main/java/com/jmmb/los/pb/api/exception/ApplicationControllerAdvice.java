package com.jmmb.los.pb.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class ApplicationControllerAdvice extends AbstractExceptionHandler {

	public ApplicationControllerAdvice() {
		registerMapping(InvalidRequestException.class, HttpStatus.BAD_REQUEST);
        registerMapping(HttpMessageNotReadableException.class, HttpStatus.NOT_ACCEPTABLE);
	}
	
}
