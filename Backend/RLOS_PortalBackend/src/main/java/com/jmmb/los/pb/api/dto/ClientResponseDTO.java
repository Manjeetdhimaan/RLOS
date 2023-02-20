package com.jmmb.los.pb.api.dto;

import java.io.Serializable;
import java.util.List;

public class ClientResponseDTO<T> implements Serializable {

	private static final long serialVersionUID = 6731395971331376018L;

    /** Response data which will be sent back to the client */
    private T data;

    /** Indicates success of the request by client */
    private boolean success;
    
    /** Indicates the statusCode from the response */
    private Integer statusCode;
    
    /** Indicates the error Message from the response */
	//private String errorMessage;
    private List<String> errorMessageList;

    /**
     * Instantiates a new ClientResponseDTO.
     */
    public ClientResponseDTO(){}

    /**
     * Instantiates a new ClientResponseDTO.
     *
     * @param data the data
     */
    public ClientResponseDTO(T data) {
        this.data = data;
        this.success = true;
    }

    /**
     * Instantiates a new ClientResponseDTO.
     *
     * @param data    the data
     * @param success the success
     */
    public ClientResponseDTO(T data, boolean success) {
        this.data = data;
        this.success = success;
    }
    
    public ClientResponseDTO(T data, boolean success, Integer statusCode) {
		super();
		this.data = data;
		this.success = success;
		this.statusCode = statusCode;
	}

    public ClientResponseDTO(T data, boolean success, Integer statusCode, List<String> errorMessageList) {
		super();
		this.data = data;
		this.success = success;
		this.statusCode = statusCode;
		//this.errorMessage = errorMessage;
		this.errorMessageList = errorMessageList;
	}

	/**
     * Gets response data.
     *
     * @return the data
     */
    public T getData() {
        return data;
    }

    /**
     * Sets response data.
     *
     * @param data the data
     */
    public void setData(T data) {
        this.data = data;
    }

    /**
     * Is success.
     *
     * @return the boolean
     */
    public boolean isSuccess() {
        return success;
    }

    /**
     * Sets success of the call.
     *
     * @param success the success
     */
    public void setSuccess(boolean success) {
        this.success = success;
    }


    public Integer getStatusCode() {
		return statusCode;
	}

	public List<String> getErrorMessageList() {
		return this.errorMessageList;
	}

	public void setErrorMessageList(List<String> errorMessageList) {
		this.errorMessageList = errorMessageList;
	}
	
	public void setStatusCode(Integer statusCode) {
		this.statusCode = statusCode;
	}

	@Override
	public String toString() {
		return "ClientResponseDTO [data=" + data + ", success=" + success + ", statusCode=" + statusCode
				+ ", errorMessage=" + errorMessageList + "]";
	}

}