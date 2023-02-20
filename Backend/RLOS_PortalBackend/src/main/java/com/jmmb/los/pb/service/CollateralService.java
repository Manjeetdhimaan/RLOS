package com.jmmb.los.pb.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.xml.bind.JAXBException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.jmmb.los.pb.api.dto.CreditCardDTO;
import com.jmmb.los.pb.api.dto.LoanDetailsDTO;
import com.jmmb.los.pb.api.dto.OverdraftDTO;
import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.Attributes;
import com.jmmb.los.pb.ibps.dto.CollateralDetail;
import com.jmmb.los.pb.ibps.dto.CreditCardGrid;
import com.jmmb.los.pb.ibps.dto.LoanRequestedDetail;
import com.jmmb.los.pb.ibps.dto.OverdraftGrid;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributeResponse;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributesRequest;
import com.jmmb.los.pb.ibps.service.IbpsPushService;
import com.jmmb.los.pb.util.JaxBUtil;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CollateralService {

	@Autowired
	private IbpsPushService ibpsPushService;

	@Autowired
	private IBPSConfig iBPSConfig;

	public ApplicationDTO processCollaterals(ApplicationDTO application, String workItemNumber) throws Exception {
		log.info("Invoking createIbpsApplication method in ApplicationService for applicant : {}", workItemNumber);
		String sessionId = null;
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for applicant : {}", workItemNumber);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}

		try {
			log.info("Initiating lockWorkItem for workItem {}", workItemNumber);
			ibpsPushService.lockWorkItem(sessionId, workItemNumber);

			log.info("Started processing CollateralInfo in CollateralService for workItem {}", workItemNumber);
			upsertLoanDetails(workItemNumber, application.getLoanDetails(), sessionId);

			log.info("Initiating unlockWorkItem for workItem {}", workItemNumber);
			ibpsPushService.unlockWorkItem(workItemNumber, sessionId);

		} catch (Exception e) {
			log.error("Error While IBPS Push for applicant : {}", workItemNumber, e);
			throw e;
		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for applicant : {}", workItemNumber, e);
				}
			}
		}
		return application;
	}

	private void upsertLoanDetails(String workItemNumber, LoanDetailsDTO loanDetail, String sessionId)
			throws JAXBException {
		SetAttributesRequest req = initiateSetAttributeReq(sessionId, workItemNumber);
		if (loanDetail.getProduct().contains("Loan")) {
			processLoanDetailsGrid(loanDetail, sessionId, req);
		} else if (loanDetail.getProduct().equalsIgnoreCase("Credit Card")) {
			for (CreditCardDTO ccDto : loanDetail.getCreditCardDetails()) {
				Attributes attributes = new Attributes();
				List<CreditCardGrid> ccGridList = new ArrayList<>();
				CreditCardGrid ccGrid = new CreditCardGrid();
				ccGrid.setElementId(convertLongToString(ccDto.getId()));
				ccGrid.setMemberId(ccDto.getApplicantOrder());
				ccGrid.setRequiedFor(ccDto.getCardsRequiredFor());
				ccGrid.setCardType(ccDto.getCardType());
				ccGrid.setCardTypeLabel(ccDto.getCardTypeLabel());
				ccGrid.setBranch(ccDto.getBranchLabel());
				ccGrid.setBranchCode(ccDto.getBranch());
				ccGrid.setCardOrder(ccDto.getOrder());
				ccGridList.add(ccGrid);
				attributes.setCreditCardGridList(ccGridList);
				req.setAttributes(attributes);
				String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
				SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
				if (!Objects.isNull(response.getValues())) {
					String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
					ccDto.setId(convertStringToLong(insertionId));
				}
				log.info("Completed processing Credit Card info");
				req.setAttributes(null);
			}
		} else if (loanDetail.getProduct().equalsIgnoreCase("Overdraft")) {
			for (OverdraftDTO odDto : loanDetail.getOverdraftDetails()) {
				Attributes attributes = new Attributes();
				List<OverdraftGrid> odGridList = new ArrayList<>();
				OverdraftGrid odGrid = new OverdraftGrid();
				odGrid.setElementId(convertLongToString(odDto.getId()));
				odGrid.setMemberId(odDto.getApplicantOrder());
				odGrid.setRequiedFor(odDto.getOverdraftRequiredFor());
				odGrid.setPurpose(odDto.getOverdraftPurpose());
				odGrid.setPurposeLabel(odDto.getOverdraftPurposeLabel());
				odGrid.setOtherPurpose(odDto.getOtherOverdraftPurpose());
				odGrid.setOverdraftOrder(odDto.getOrder());
				// odGrid.setOverdraftName(odDto.getOverdraftName());
				odGridList.add(odGrid);
				attributes.setOverdraftGridList(odGridList);
				req.setAttributes(attributes);
				String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
				SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
				if (!Objects.isNull(response.getValues())) {
					String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
					odDto.setId(convertStringToLong(insertionId));
				}
				log.info("Completed processing Overdraft info");
				req.setAttributes(null);
			}
		}
		processCollateralDetails(loanDetail, sessionId, req);

	}

	private void processCollateralDetails(LoanDetailsDTO loanDetail, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		try{
			if(loanDetail.getHasCollateral().equalsIgnoreCase("yes")){
		
			if(loanDetail.getHasCollateral().equalsIgnoreCase("yes")){
		log.info("Started processing Collateral info");
		CollateralDetail ibpsCollGrid = new CollateralDetail();
		ibpsCollGrid.setElementId(convertLongToString(loanDetail.getCollateralInsertionId()));
		ibpsCollGrid.setHasCollateral(loanDetail.getHasCollateral());
		ibpsCollGrid.setCollateralType(loanDetail.getCollateralType());
		ibpsCollGrid.setOtherCollateralDetails(loanDetail.getOtherCollateral());
		ibpsCollGrid.setCollateralValue(loanDetail.getCollateralValue());
		ibpsCollGrid.setPresentCollateralValue(loanDetail.getPresentCollateralValue());
		ibpsCollGrid.setPrimaryOwner(loanDetail.getPrimaryOwner());
		ibpsCollGrid.setCurrency(loanDetail.getCurrency());
		ibpsCollGrid.setExistingCollateral("New");
		ibpsCollGrid.setCollateralOrder("1");
		ibpsCollGrid.setMemberid(loanDetail.getOrder());
		ibpsCollGrid.setCollateralName(loanDetail.getCollateralName());
		Attributes attributes = new Attributes();
		attributes.setCollateralDetails(ibpsCollGrid);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);

		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (!Objects.isNull(response.getValues())) {
			String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
			loanDetail.setCollateralInsertionId(convertStringToLong(insertionId));
		}
		log.info("Completed processing Collateral info");
		req.setAttributes(null);
			}
			else{
				CollateralDetail ibpsCollGrid = new CollateralDetail();
				ibpsCollGrid.setElementId(convertLongToString(loanDetail.getCollateralInsertionId()));
				ibpsCollGrid.setHasCollateral(loanDetail.getHasCollateral());
				Attributes attributes = new Attributes();
				attributes.setCollateralDetails(ibpsCollGrid);
				req.setAttributes(attributes);
				String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
				SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
				if (!Objects.isNull(response.getValues())) {
					String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
					loanDetail.setCollateralInsertionId(convertStringToLong(insertionId));
				}
				log.info("Completed processing Collateral info");
				req.setAttributes(null);
			}
			}
			else{
				if(Objects.isNull(loanDetail.getCollateralInsertionId())){
					
				}
				else{
					CollateralDetail ibpsCollGrid = new CollateralDetail();
					ibpsCollGrid.setElementId(convertLongToString(loanDetail.getCollateralInsertionId()));
					//ibpsCollGrid.setHasCollateral(loanDetail.getHasCollateral());
					Attributes attributes = new Attributes();
					attributes.setCollateralDetails(ibpsCollGrid);
					req.setAttributes(attributes);
					String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
					SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
					if(response.getException().getMainCode().equalsIgnoreCase("0")){
						loanDetail.setCollateralInsertionId(null);
					}
					log.info("Completed processing Collateral info");
					req.setAttributes(null);
				}
			}
		}
		catch(Exception e){
			log.info("Exception in processing collateral info");
			}
		}

	private void processLoanDetailsGrid(LoanDetailsDTO loanDetail, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		log.info("Started processing loan info");
		Attributes attributes = new Attributes();
		LoanRequestedDetail detail = new LoanRequestedDetail();
		detail.setElementId(convertLongToString(loanDetail.getId()));
		detail.setLoanType(loanDetail.getLoanType());
		// detail.setIsSecuredFacility(SECURED.equalsIgnoreCase(loanDetail.getFacilityType())
		// ? "Yes" : "No");
		detail.setLoanPurpose(loanDetail.getLoanPurposeType());
		detail.setLoanPurposeOthers(loanDetail.getLoanPurposeOthers());
		detail.setLoanAmountRequired(loanDetail.getAmountRequired());
		detail.setLoanTerm(loanDetail.getLoanTerm());

		attributes.setLoanDetailsGrid(detail);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (!Objects.isNull(response.getValues())) {
			String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
			loanDetail.setId(convertStringToLong(insertionId));
		}
		log.info("Completed processing loan info");
		req.setAttributes(null);
	}

	private SetAttributesRequest initiateSetAttributeReq(String sessionId, String workItemNumber) {
		SetAttributesRequest req = new SetAttributesRequest();
		req.setOption("WMAssignWorkItemAttributes");
		req.setEngineName(iBPSConfig.getEngineName());
		req.setSessionId(sessionId);
		req.setProcessInstanceId(workItemNumber);
		req.setWorkItemId(iBPSConfig.getWorkitemId());
		req.setProcessDefId(iBPSConfig.getProcessDefId());
		req.setActivityId(iBPSConfig.getInitiateFromActivityId());
		req.setUserDefVarFlag("Y");
		return req;
	}

	private Long convertStringToLong(String id) {
		return id == null ? null : Long.parseLong(id);
	}

	private String convertLongToString(Long id) {
		return id == null ? null : id.toString();
	}
}
