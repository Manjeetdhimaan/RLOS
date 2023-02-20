package com.jmmb.los.pb.service;

import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.dto.DataMapper;
import com.jmmb.los.pb.api.dto.MasterDataDTO;
import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.jmmb.los.pb.config.ProcedureConfig;
import com.jmmb.los.pb.ibps.dto.masterdata.APProcedureWithColumnNames;
import com.jmmb.los.pb.ibps.dto.masterdata.DbOutput;
import com.jmmb.los.pb.ibps.dto.masterdata.Params;
import com.jmmb.los.pb.ibps.dto.masterdata.Record;
import com.jmmb.los.pb.util.Helper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LookupService {

	@Autowired
	private ProcedureConfig procedureConfig;
	@Autowired
	private Helper helper;


	public MasterDataDTO getlookupMdmData(){
		MasterDataDTO dataDTO;
		log.info("Invoking getlookupMdmData method in LookupService");
		String procName = procedureConfig.getProcedureName().get("lookupProcedure");
		try {
			log.info("Fetching Master Data from db");
			APProcedureWithColumnNames dbData = helper.executeProcedure(procName, new String[] {});
			log.info("Data received: {}", dbData);
			if (dbData.getMainCode().equalsIgnoreCase("0")) {
				dataDTO = xmlToJson(dbData);
			} else {
				throw new InvalidRequestException(dbData.getMessage(), Code.IBPS_APPROCEDURE_DATA_ERROR);
			}
		} catch (Exception e) {
			log.error("Error While Fetching Master Data");
			throw new InvalidRequestException(e.getMessage(), Code.DATABASE_EXCEPTION);
		}
		return dataDTO;
	}		

	private MasterDataDTO xmlToJson(APProcedureWithColumnNames dbData) {
		MasterDataDTO masterData = null;
		try {
			masterData = new MasterDataDTO();
			DbOutput output = dbData.getOutput();
			// common for AO,RLOS(param1-param14)
			iterateRecord(masterData.getPrefix(), output.getParam1());
			iterateRecord(masterData.getCountry(), output.getParam2());
			iterateRecord(masterData.getMaritalStatus(), output.getParam3());
			iterateRecord(masterData.getIdType(), output.getParam4());
			iterateRecord(masterData.getEmploymentType(), output.getParam5());
			iterateRecord(masterData.getEmploymentSector(), output.getParam6());
			iterateRecord(masterData.getBusinessType(), output.getParam7());
			iterateRecord(masterData.getIncomeType(), output.getParam8());
			iterateRecord(masterData.getIncomeFrequency(), output.getParam9());
			iterateRecord(masterData.getPepRelation(), output.getParam10());
			iterateRecord(masterData.getGender(), output.getParam11());
			iterateRecord(masterData.getCurrencyType(), output.getParam12());

			iterateRecord(masterData.getFamilyRelationship(), output.getParam13());
			iterateRecord(masterData.getLoanRelationship(), output.getParam14());
			iterateRecord(masterData.getProductName(), output.getParam15());
			iterateRecord(masterData.getLoanPurpose(), output.getParam16());
			iterateRecord(masterData.getCardType(), output.getParam17());
			iterateRecord(masterData.getCollateralType(), output.getParam18());
			iterateRecord(masterData.getDocumentList(), output.getParam19());
			iterateRecord(masterData.getBranchList(), output.getParam20());
			iterateRecord(masterData.getDependentList(), output.getParam21());
			//
			iterateRecord(masterData.getJobTitleList(), output.getParam22());
			iterateRecord(masterData.getRentOptions(), output.getParam23());
			iterateRecord(masterData.getAssetTypeList(), output.getParam24());
			iterateRecord(masterData.getLoanProductList(), output.getParam25());
			iterateRecord(masterData.getConsentMessage(), output.getParam26());
			iterateRecord(masterData.getEducationTypes(), output.getParam27());
			iterateRecord(masterData.getAppointmentHours(), output.getParam28());
			iterateRecord(masterData.getAppointmentMinutes(), output.getParam29());
			iterateRecord(masterData.getMinMaxAges(), output.getParam30());
			iterateRecord(masterData.getReferalSource(), output.getParam31());
		} catch (RuntimeException e) {
			log.error("Error in xml to JSON mapping ", e);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_APPROCEDURE_DATA_ERROR);
		}
		return masterData;
	}

	private void iterateRecord(List<DataMapper> common, Params param) {
		common.clear();
		if (Objects.nonNull(param.getRecords())) {
			List<Record> recordlist = param.getRecords().getRecord();
			if (Objects.nonNull(recordlist)) {
				for (Record record : recordlist) {
					DataMapper dataMapper = new DataMapper(record.getCode().replaceFirst("\t", ""), record.getLabel(),
							record.getLoanType());
					common.add(dataMapper);
				}
			}
		}
	}
}
