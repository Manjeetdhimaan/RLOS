package com.jmmb.los.pb.api.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppointmentDTO {
	private String arn;
	private String branchCode;
	private String appointmentDate;
	private String hour;
	private String time;
}
