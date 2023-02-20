package com.jmmb.los.pb.service;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.ibps.dto.masterdata.Record;
import com.jmmb.los.pb.util.Helper;

import lombok.extern.slf4j.Slf4j;

@Component
@Slf4j
@ConditionalOnProperty(prefix = "reminderScheduler", name = "enable")
public class ReminderSchedulerService {

    private static final int REMINDER_1 = 1;
    private static final int FINAL_REMINDER = 4;

    @Value("${reminderScheduler.reminderHours}")
    private int reminderHours;

    @Value("${reminderScheduler.finalReminderHours}")
    private int finalReminderHours;

    @Autowired
    private IBPSConfig ibpsConfig;

    @Scheduled(cron = "${reminderScheduler.reminderCron}")
    public void reminderScheduler() {
        log.info("Inside Reminder Scheduler");
        log.info("Sending First Reminder Mails");
        sendReminder(REMINDER_1, reminderHours);
        log.info("Sending Final Reminder Mails");
        sendReminder(FINAL_REMINDER, finalReminderHours);

    }

    private void sendReminder(int reminderType, int reminderHours) {
        String sessionId = null;
        String cabName = ibpsConfig.getEngineName();
        String procName = "NG_RLOS_PORTAL_TRIGGER_REMINDER_EMAIL";

        StringBuilder sb = new StringBuilder();
        sb.append(reminderType).append(",").append(reminderHours);
        String params = sb.toString();

        APProcedureWithColumnNames dbData = Helper.executeDbCall("", cabName, sessionId, procName, params, ibpsConfig);
        if (Objects.nonNull(dbData.getOutput())) {
            List<Record> recordList = Helper.iterateRecords(dbData.getOutput().getParam1());
            int count = recordList.size();
            log.info("{} mails sent for reminder: {}", count, reminderType);
        } else {
            log.error("Data received from Query is: {}", dbData);
        }
    }
}
