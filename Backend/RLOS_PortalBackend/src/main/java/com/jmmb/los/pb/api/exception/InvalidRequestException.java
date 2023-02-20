package com.jmmb.los.pb.api.exception;

import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.validation.Errors;

import lombok.AllArgsConstructor;

public class InvalidRequestException extends AbstractBaseException {


    private static final long serialVersionUID = 3570182455427009954L;


    public InvalidRequestException(Errors errors, Code code) {
        populateInvalidRequestObject(code);
        this.errors = errors;
    }

    public InvalidRequestException(String customMessage, Code code) {
        populateInvalidRequestObject(code);
        this.description = customMessage;
    }

    public InvalidRequestException(Errors errors, String customMessage, Code code) {
        populateInvalidRequestObject(code);
        this.errors = errors;
        this.description = customMessage;
    }

    public InvalidRequestException(Code imageToBeExtractedNotFound) {
    	populateInvalidRequestObject(imageToBeExtractedNotFound);
	}

	@AllArgsConstructor
    public enum Code {

		/* general exceptions staring from 1001 uptil 1001-1050 */

        INVALID_DATA_FOUND(1001, "Invalid data found in the request body!", "Invalid data found in the request body!"),
        APPLICATION_DATA_CANNOT_BE_MODIFIED(1029, "Invalid data found in the request body!", "Can not edit lastName, DOB and SSN is mandatory for primary applicant"),
        INVALID_ZONE_FOUND(1002, "InvalidZoneFoundInRequest", "Invalid Zone name found in the request."),
        INVALID_APPLICANT_FOUND(1003, "InvalidApplicantFound", "Invalid applicant"),
        DATABASE_EXCEPTION(1003, "Exception occurred in repo", "Exception occurred in repo"),
        INVALID_APPLICATION_FOUND(1004, "InvalidApplicationFound", "Invalid application id found in the request"),
        INVALID_COUPON_FOUND(1005, "InvalidCouponFound", "Coupon is not valid"),
        INVALID_CHECKOUT_AMOUNT(1006, "InvalidCheckoutAmount", "Checkout amount is less than minimum checkout amount"),
        APPLICATION_ALREADY_EXIST(1007, "APPLICATION_ALREADY_EXIST", "One Application already exist for the applicant!"),
        NO_ACTIVE_APPLICATION_FOUND(1020, "NO_ACTIVE_APPLICATION_FOUND",
                "No active application found with the requested credentials!"),
        INVALID_OTP(1021, "INVALID_OTP", "Invalid OTP entered, please reverify!"),
        OTP_EXPIRED(1022, "OTP_EXPIRED", "OTP expired, please regenerate it and try!"),
        USER_TEMPORARILY_BLOCKED(1023, "USER_TEMPORARILY_BLOCKED", "User is temporarily blocked!"),
        USER_BLOCKED(1024, "USER_BLOCKED", "User is blocked!"),
        PDF_GENERATION_FAILED(1025, "PDF_GENERATION_FAILED", "For Some reason pdf generation failed!"),
        INVALID_APP_DECISION_CAME_FROM_BRMS(1026, "INVALID_APP_DECISION_CAME_FROM_BRMS",
                "Invalid decision came from the BRMS, that is not mapped in the application!"),
        APPLICATION_PROD_NOT_FOUND_FROM_BRMS(1027, "APPLICATION_PROD_NOT_FOUND_FROM_BRMS",
                "Something went wrongm, application products not found for the application!"),
        INVALID_IDA_REQUEST(1028, "INVALID_IDA_REQUEST",
                "Invalid or expired IDA request!"),
        /* docuSign related exceptions staring from 9021 uptil 9040 */
        PRIMARY_SIGNER_NOT_FOUND(9001, "PRIMARY_SIGNER_NOT_FOUND",
                "Primary Signer not found for which redirect uri needs to be returned."),
        IMAGE_TO_BE_EXTRACTED_NOT_FOUND(1007, "ImageToBeExtractedNotFound", "Image data to be extracted not found."),
        INVALID_DATA_FORMAT_FOUND(1008, "InvalidImageDataFormatFound",
                "byte[] array expected but Multipart[] found or vice versa."),
        /* idScan related exceptions staring from 8020 uptil 8040 */
        INVALID_IDSCAN_REQUEST(1009, "InvalidIdScanRequest", "Please see the errorCode."),
        NO_DOCUMENT_FOUND_PRIMARY_APPLICANT(1010, "NO_VERIFICATION_DOCUMENT_FOUND_PRIMARY_APPLICANT",
                "No document found for primary applicant"),
        NO_IDENTIFICATION_DOCUMENT_FOUND_PRIMARY_APPLICANT(1011, "IDENTIFICATION_DOCUMENT_NOT_FOUND_PRIMARY_APPLICANT",
                "No identification document found for primary applicant"),
        NO_OTHER_DOCUMENT_FOUND_PRIMERY_APPLICANT(1012, "OTHER_DOCUMENT_NOT_FOUND_PRIMERY_APPLICANT",
                "No other document found primary applicant"),
        NO_DOCUMENT_FOUND_JOINT_APPLICANT(1013, "NO_VERIFICATION_DOCUMENT_FOUND_JOINT_APPLICANT",
                "No document found for joint applicant"),
        NO_IDENTIFICATION_DOCUMENT_FOUND_JOINT_APPLICANT(1014, "IDENTIFICATION_DOCUMENT_NOT_FOUND_JOINT_APPLICANT",
                "No identification document found for joint applicant"),
        NO_OTHER_DOCUMENT_FOUND_JOINT_APPLICANT(1015, "OTHER_DOCUMENT_NOT_FOUND_JOINT_APPLICANT",
                "No other document found joint applicant"),
        DUPLICATE_SSN_FOUND(1016, "DUPLICATE_SSN_FOUND_Exception",
                "SSNS must be unique through out the application"),
        APPLICATION_DOES_NOT_EXIST(1017, "Application Does not Exist.", "Application for entered details does not Exist."),
    	CANNOT_CONNECT_NADA(1018, "CannotConnectToNADA", "Error in Connecting to NADA Service or NADA service is unavialble)"),
    	CANNOT_CONNECT_USPS(1019, "CannotConnectToUSPS", "Error in Connecting to USPS Service or USPS service is unavialble)"),
    	APPLICANT_DOES_NOT_EXIST(1020, "Applicant Does not Exist", "Applicant for corresponding id is not present."),
    	APPLICANT_CONFIG_DOES_NOT_EXIST(1021, "Applicant Config Does not Exist", "Applicant for corresponding id is not present."),
    	APPLICATION_ALREADY_SUBMITTED(1022, "Application Already Submitted.", "Application is already submitted to IBPS."),
    	PRIMARY_APPLICANT_DOES_NOT_EXIST(1023, "Primary Applicant does not present", "Primary Applicant does not exist for the Application."),
    	APPLICATION_NOT_SUBMITTED(1024, "Application Not Submitted.", "Apllication not submitted to IBPS."), 
    	APPLICATION_NOT_UPDATED(1025, "Application Not Updated.", "Apllication not updated in IBPS."),
    	TOKEN_SESSION_TIMEOUT(5001,"Token Expired","Token Session Time Out"),
    	TOKEN_FOUND_INVALID(5008,"Invalid Token Found","Valid Token was not found"),
    	TOKEN_OVERRIDDEN(5009,"Token Has Been Overridden","Token Has Been Overridden"),
    	TOKEN_FROM_DIFF_DEVICE(5002,"Token being used from a different device.","Token being used from a different device."),
    	TOKEN_FROM_DIFF_APPLICATION(5004,"Token does not belong to this application","Token does not belong to this application"),
    	CANNOT_CONNECT_IDSCAN(1026, "CannotConnectToIDSCAN", "Error in Connecting to IDSCAN Service or IDSCAN service is unavialble"),
    	FILE_SIZE_EXCEEDED(1027, "FILE SIZE EXCEEDED", "File size exceeded"),
    	FILE_TYPE_NOT_MATCHED(1028, "FILE TYPE NOT MATCHED", "File type not matched"),
    	CANNOT_CONNECT_EXPERIAN(1029, "CannotConnectTo Experiaan", "Error in Connecting to Experian Service "),
    	IBPS_SESSION_ERROR(1030, "IBPS Session not established", "Error while creating session with IBPS"),
    	IBPS_WORKITEM_CREATION_ERROR(1031, "IBPS Work-Item Cannot be Created", "Error while creating Work-Item on IBPS"),
    	IBPS_WORKITEM_LOCK_ERROR(1032, "IBPS Work-Item Cannot be Locked", "Error while Locking Work-Item on IBPS"),
    	IBPS_WORKITEM_SET_ATTRIBUTES_ERROR(1033, "IBPS Work-Item Set Attributes failed", "Error while Work-Item Set Attibutes on IBPS"),
    	IBPS_WORKITEM_COMPLETE_ERROR(1034, "IBPS Work-Item cannot be completed", "Error while completing Work-Item on IBPS"),
    	IBPS_DISCONNECT_ERROR(1035, "IBPS disconnect Error", "Error while Disconnecting IBPS"),
    	LOAN_AMOUNT_EXCEEDED_ERROR(1036, "LOAN AMOUNT EXCEEDED ERROR", "Loan Amount is either Below Min Loan Amount or Above Max Loan Amount!!!"),
    	MAX_CO_APPLICANTS_EXCEEDED_ERROR(1037, "MAX CO APPLICANTS EXCEEDED ERROR", "Maximum CoApplicants Execeeded!!!"),
    	PRIMARY_APPLICANT_EXCEEDED_ERROR(1038, "PRIMARY APPLICANT EXCEEDED ERROR", "Application can have only one Primary Applicant!!!"),
    	LOAN_CLOSING_ERROR(1039, "LOAN CLOSING ERROR", "Failed to save Loan Closing Details!!!"), 
    	APPLICATION_IS_UNDER_REVIEW(1040, "APPLICATION IS UNDER REVIEW", "Application is under review"),
    	DOC_UPLOAD_LINK_EXPIRED(1041, "Document Upload link has expired", "Document Upload link has expired or you are no longer"
    			+ " required to upload any documents at this time"),
    	CUST_ACCEPTANCE_LINK_EXPIRED(1042, "Customer Acceptance link has expired", "Customer Acceptance link"
    			+ " has expired or you are no longer required to take any action at this time"),
    	AUTHENTICATION_FAILED(1043, "Authentication Failed", "Authentication Failed"),
    	IBPS_APPROCEDURE_DATA_ERROR(1044, "IBPS APProcedure data error", "IBPS APProcedure data error"),
    	DOCUMENT_UPLOAD_ERROR(1045, "Document upload error", "Document upload error");
    	
        private final int exceptionCode;
        private final String errorCode;
        private final String description;

        private static final Map<String, Code> CODE_MAPPING;

        static {
            CODE_MAPPING = Stream.of(Code.values()).collect(Collectors.toMap(Enum::toString, Function.identity()));
        }

        public static Optional<Code> getCode(String codeName) {
            return Optional.ofNullable(CODE_MAPPING.get(codeName));
        }

    }

    /* Utility method */
    private void populateInvalidRequestObject(Code code) {
        this.errorCode = code.errorCode;
        this.exceptionCode = code.exceptionCode;
        this.description = code.description;
    }

}
