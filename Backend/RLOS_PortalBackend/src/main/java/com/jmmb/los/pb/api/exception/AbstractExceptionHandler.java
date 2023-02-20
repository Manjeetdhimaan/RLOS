package com.jmmb.los.pb.api.exception;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletResponse;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@SuppressWarnings({"unused","rawtypes"})
public abstract class AbstractExceptionHandler {

	@Value("${exception.return-stack-trace}")
    public final boolean  returnStaceTrace=true;
    
	public final Map<Class, ExceptionMapping> exceptionMappings = new HashMap<>();
    public static final ExceptionMapping DEFAULT_ERROR = new ExceptionMapping(HttpStatus.INTERNAL_SERVER_ERROR);


    @ExceptionHandler(value = {Throwable.class})
    @ResponseBody
    public ResponseEntity<ErrorResource> handleThrowable(final Throwable exception, final HttpServletResponse response) {
        final ExceptionMapping mapping = exceptionMappings.getOrDefault(exception.getClass(), DEFAULT_ERROR);
        final String[] rootCauseStackTrace = ExceptionUtils.getRootCauseStackTrace(exception);
        return handleException(exception, mapping, rootCauseStackTrace);
    }


    /* *********************** Utility methods *********************** */


    public void registerMapping(final Class<?> clazz, final HttpStatus status) {
        exceptionMappings.put(clazz, new ExceptionMapping(status));
    }


    private ResponseEntity<ErrorResource> handleException(Throwable exception, ExceptionMapping mapping, String[] rootCauseStackTrace) {
    	if (exception instanceof HttpMessageNotReadableException) {
            return this.handleException((HttpMessageNotReadableException) exception, mapping, rootCauseStackTrace);
        } else if (exception instanceof AbstractBaseException)
            return getErrorResponseResponseEntity(mapping, rootCauseStackTrace,((AbstractBaseException) exception).getExceptionCode());
        else if (exception instanceof ConstraintViolationException)
            return this.handleException((ConstraintViolationException) exception, mapping, rootCauseStackTrace);

        log.error("Exception: {} : {}", exception.getMessage(), exception);
        return getErrorResponseResponseEntity(mapping, rootCauseStackTrace,5000);
    }

    
	private ResponseEntity<ErrorResource> handleException(AbstractBaseException exception, ExceptionMapping mapping, String[] rootCauseStackTrace) {
    	List<ErrorResource.FieldErrorResource> fieldErrorResources = null;
        if (exception.getErrors() != null)
            fieldErrorResources = getFieldErrorResourcesForValidationViolations(exception);

        final ErrorResource errorResponse = ErrorResource.createERWith_ExCode_ErrorCode_FER(exception.getExceptionCode(), exception.getErrorCode(), exception.getDescription(), fieldErrorResources);
        if (returnStaceTrace)
            errorResponse.setStackTrace(rootCauseStackTrace);
        log.error("Exception: "+ exception.getErrorCode()+ " "+ exception+"\n "+ errorResponse);
        return new ResponseEntity<>(errorResponse, mapping.httpStatus);
    }

    private ResponseEntity<ErrorResource> handleException(ConstraintViolationException exception, ExceptionMapping mapping, String[] rootCauseStackTrace) {
    	final Set<ConstraintViolation<?>> constraintViolations = exception.getConstraintViolations();
        log.error("Exception: {} : {} \n {}", exception.getConstraintViolations(), mapping.getClass());
        final List<FieldError> fieldErrorsFound = constraintViolations.stream()
                .map(constraintViolation -> {
                    FieldError fieldError = new FieldError(String.valueOf(constraintViolation.getPropertyPath()),
                            String.valueOf(constraintViolation.getInvalidValue()), constraintViolation.getMessage());
                    return fieldError;
                })
                .collect(Collectors.toList());

        final List<ErrorResource.FieldErrorResource> fieldErrorResources = handleFeildErrors(fieldErrorsFound);
        //FER - field error resource
        final ErrorResource errorResponse = ErrorResource.createERWith_ExCode_ErrorCode_FER(3000, "Invalid Data Found in the request", fieldErrorResources);
        if (returnStaceTrace)
            errorResponse.setStackTrace(rootCauseStackTrace);
        return new ResponseEntity<>(errorResponse, mapping.httpStatus);
    }

    private List<ErrorResource.FieldErrorResource> getFieldErrorResourcesForValidationViolations(AbstractBaseException exception) {
    	return handleFeildErrors(exception.getErrors().getFieldErrors());
    }

    private List<ErrorResource.FieldErrorResource> handleFeildErrors(List<FieldError> fieldErrors) {
    	List<ErrorResource.FieldErrorResource> fieldErrorResources = new ArrayList<>();
        for (FieldError fieldError : fieldErrors) {
            ErrorResource.FieldErrorResource fieldErrorResource = new ErrorResource.FieldErrorResource();
            fieldErrorResource.setField(fieldError.getObjectName());
            fieldErrorResource.setMessage(fieldError.getDefaultMessage());
            fieldErrorResources.add(fieldErrorResource);
        }
        return fieldErrorResources;
    }

    private ResponseEntity<ErrorResource> handleException(HttpMessageNotReadableException exception, ExceptionMapping mapping, String[] rootCauseStackTrace) {
    	ErrorResource errorResource = new ErrorResource(4000, "INVALID_REQUEST_JSON", "Please check your request JSON, it's incorrect!");
        if (this.returnStaceTrace)
            errorResource.setStackTrace(rootCauseStackTrace);
        return new ResponseEntity<>(errorResource, mapping.httpStatus);
    }

    private ResponseEntity<ErrorResource> getErrorResponseResponseEntity(ExceptionMapping mapping, String[] rootCauseStackTrace,int code) {
    	ErrorResource internal_server_error = new ErrorResource(code, "INTERNAL_SERVER_ERROR", "Some error occured, please contact support.");
        if (this.returnStaceTrace)
            internal_server_error.setStackTrace(rootCauseStackTrace);
        return new ResponseEntity<>(internal_server_error, mapping.httpStatus);
    }


    /* *********************** Utility Inner Classes *********************** */

    @Data
    @AllArgsConstructor(staticName = "of")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ErrorResource {

        public int exceptionCode;
        public String errorCode;
        public String description;
        private String[] stackTrace;
        private List<FieldErrorResource> fieldErrors;
        private final String timestamp = LocalDateTime.now().toString();

        public ErrorResource(Integer exceptionCode, String errorCode, String description) {
            this.exceptionCode = exceptionCode;
            this.errorCode = errorCode;
            this.description = description;
        }

        private ErrorResource(Integer exceptionCode, String errorCode, String description, List<FieldErrorResource> fieldErrorResources) {
            this.exceptionCode = exceptionCode;
            this.errorCode = errorCode;
            this.description = description;
            this.fieldErrors = fieldErrorResources;
        }

        private ErrorResource(Integer exceptionCode, String errorCode, List<FieldErrorResource> fieldErrorResources) {
            this.exceptionCode = exceptionCode;
            this.errorCode = errorCode;
            this.fieldErrors = fieldErrorResources;
        }

        public static ErrorResource createERWith_ExCode_ErrorCode_FER(int exceptionCode, String errorCode, String description, List<FieldErrorResource> fieldErrorResources) {
            return new ErrorResource(exceptionCode, errorCode, description, fieldErrorResources);
        }

        public static ErrorResource createERWith_ExCode_ErrorCode_FER(int exceptionCode, String errorCode, List<FieldErrorResource> fieldErrorResources) {
            return new ErrorResource(exceptionCode, errorCode, fieldErrorResources);
        }


        @Data
        public static class FieldErrorResource {
            private String field;
            private String message;
        }

    }


    @AllArgsConstructor
    public static class ExceptionMapping {
        public final HttpStatus httpStatus;
    }
	
}
