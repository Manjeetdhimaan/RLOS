package com.jmmb.los.pb.service;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.dto.EmailTemplate;
import com.jmmb.los.pb.config.ProcedureConfig;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.util.Helper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class EmailService {
	@Autowired
	private ProcedureConfig procedureConfig;
	@Autowired
	private Helper helper;

	public boolean triggerEmail(String arn, EmailTemplate template, String otherData) {
		boolean emailStatus = false;
		String[] params = new String[] { arn, template.getName(), otherData };
		APProcedureWithColumnNames dbData = helper
				.executeProcedure(procedureConfig.getProcedureName().get("trggerPortalEmail"), params);
		if (Objects.nonNull(dbData.getOutput())) {
			if (dbData.getMainCode().equals("0")) {
				log.info("Email trigger successfull!");
				emailStatus = true;
			} else {
				log.info("Email trigger failed with MainCode {}", dbData.getMainCode());
			}
		}
		return emailStatus;
	}
}
