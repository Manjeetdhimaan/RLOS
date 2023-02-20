package com.jmmb.los.pb.util;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.extern.slf4j.Slf4j;
@Slf4j
public class DateUtil {
	
	public static LocalDateTime stringToDate(String dateString) {
		String[] d= dateString.split("\\.");
		dateString= d[0];
		if (dateString != null) {
			DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
			LocalDateTime dateTime = null;
			dateTime = LocalDateTime.parse(dateString, formatter);
			return dateTime;
		} else
			return null;

	}

	public static LocalDateTime timeStampToDate(Timestamp timestamp) {
		log.info("Converting Timestamp to Date");
		if (timestamp != null) {
			return timestamp.toLocalDateTime();
		} else
			return null;
	}
	
	public static String removeTimestampToDate(LocalDateTime localDateTime) {
		log.info("Converting Timestamp to Date");
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
		if (localDateTime != null) {
			return localDateTime.format(formatter);
		} else
			return null;

	}
}
