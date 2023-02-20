package com.jmmb.los.pb.service;

import java.time.LocalDate;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.util.Helper;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service
public class AppointmentReminderService {

	@Autowired
	private Helper helper;
	
	@Scheduled(cron = "${spring.appointmentTime}")
	public void triggerEmail(){
		try{
		String sessionId = StringUtils.EMPTY;
		LocalDate dt = LocalDate.now().plusDays(1);
		String dateOfAppointment = String.valueOf(dt);
		String template = "Appointment Reminder email";
		String[] params = new String[2];
		params[0]= dateOfAppointment;
		params[1]=template;
		APProcedureWithColumnNames dbData = helper.executeProcedure("NG_RLOS_PORTAL_APPOINTMENT_REMINDER", params);
		log.info("Data received -{}", dbData);
		
	}
		catch(Exception e){
			log.info("Error in appointment reminder");
			}
		}
	private String checkStringForNull(String value, String defaultValue) {
		return value == null ? defaultValue : value;
	}
	
	
}
