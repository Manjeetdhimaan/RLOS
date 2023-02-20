package com.jmmb.los.pb.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.xml.bind.JAXBException;

import com.jmmb.los.pb.api.dto.*;
import com.jmmb.los.pb.api.dto.employment.EmploymentType;
import com.jmmb.los.pb.api.dto.employment.IEmployment;
import com.jmmb.los.pb.api.dto.employment.NonEmployedDTO;
import com.jmmb.los.pb.api.dto.employment.NonEmployedDetailsDTO;
import com.jmmb.los.pb.api.dto.employment.RetiredDTO;
import com.jmmb.los.pb.api.dto.employment.RetiredDetailsDTO;
import com.jmmb.los.pb.api.dto.employment.SalariedDTO;
import com.jmmb.los.pb.api.dto.employment.SalariedDetailsDTO;
import com.jmmb.los.pb.api.dto.employment.SelfEmployedDTO;
import com.jmmb.los.pb.api.dto.employment.SelfEmployedDetailsDTO;
import com.jmmb.los.pb.api.dto.employment.StudentDTO;
import com.jmmb.los.pb.api.dto.employment.StudentDetailsDTO;
import com.jmmb.los.pb.ibps.dto.*;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributeResponse;
import com.jmmb.los.pb.ibps.dto.setattributes.SetAttributesRequest;
import com.jmmb.los.pb.ibps.service.IbpsPushService;
import com.jmmb.los.pb.util.JaxBUtil;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ApplicantService {

	private static final String MAILING = "MAILING";
	private static final String CURRENT = "CURRENT";
	private static final String BUSINESS = "BUSINESS";
	private static final String PREVIOUS = "PREVIOUS";
	private static final String BASIC = "BASIC";
	private static final String CONTACT = "CONTACT";
	private static final String EMPLOYMENT = "EMPLOYMENT";
	private static final String INCOME = "INCOME";
	private static final String PEP = "PEP";
	private static final String FAMILY = "FAMILY";
	private static final String REFERENCE = "REFERENCE";
	private static final String FINANCIAL = "FINANCIAL";
	private static final String CONSENT = "CONSENT";
	private static final String HOME = "HOME";
	private static final String ALT = "ALT";
	private static final String WORK = "WORK";
	private static final String INITIAL = "INITIAL";

	@Autowired
	private IbpsPushService ibpsPushService;

	@Autowired
	private IBPSConfig iBPSConfig;

	public synchronized ApplicantDTO processApplicants(ApplicantDTO applicant, String workItemNumber, String context) {
		String applicantName = getFullName(applicant);
		log.info("Invoking processApplicants method in ApplicantService for applicant : {} and workItem {}",
				applicantName, workItemNumber);
		String sessionId = null;
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for applicant : {}", applicantName);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}

		try {
			log.info("Initiating lockWorkItem for workItem {}", workItemNumber);
			ibpsPushService.lockWorkItem(sessionId, workItemNumber);

			log.info(
					"Started processing ApplicantInfo in ApplicantService for applicant : {} and workItem {} with current context {}",
					applicantName, workItemNumber, context);
			processApplicantInfo(workItemNumber, applicant, sessionId, context);

			log.info("Initiating unlockWorkItem for workItem {}", workItemNumber);
			ibpsPushService.unlockWorkItem(workItemNumber, sessionId);

		} catch (Exception e) {
			log.error("Error While IBPS Push for applicant : {}", applicantName + " - " + workItemNumber, e);

		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for applicant : {}",
							applicantName + " - " + workItemNumber, e);
				}
			}
		}
		return applicant;
	}

	private void processApplicantInfo(String workItemNumber, ApplicantDTO request, String sessionId, String context)
			throws JAXBException {
		SetAttributesRequest req = initiateSetAttributeReq(sessionId, workItemNumber);

		if (checkApplicantContext(context, BASIC)) {
			processBasicInformation(request, sessionId, req);			
		}

		if (checkApplicantContext(context, CONTACT)) {
			processAddressInformation(request, sessionId, req);
		}

		if (checkApplicantContext(context, EMPLOYMENT)) {
			processEmployementDetails(request, sessionId, req);
		}

		if (checkApplicantContext(context, INCOME)) {
			processIncomeDetails(request, sessionId, req);
		}

		if (checkApplicantContext(context, PEP)) {
			processPEPDetails(request, sessionId, req);
		}

		/*if (checkApplicantContext(context, FAMILY)) {
			processFamilyDetails(request, sessionId, req);
		}*/

		if (checkApplicantContext(context, REFERENCE)) {
			processReferenceDetails(request, sessionId, req);
		}

		// if (checkApplicantContext(context, FINANCIAL)) {
		// processIncomeDetails(request, sessionId, req);
		// processAssetDetails(request, sessionId, req);
		// processLiabilityDetails(request, sessionId, req);
		// processExpenseDetails(request, sessionId, req);
		// }
		// if (checkApplicantContext(context, CONSENT)) {
		// processConsentDetails(request, sessionId, req);
		// }
	}

	private boolean checkApplicantContext(String context, String value) {
		return context == null || context.equalsIgnoreCase(value);
	}

	private void processIncomeDetails(ApplicantDTO request, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		log.info("Started processing applicant income details");
		List<IncomeDetailsDTO> incomeDtoList = request.getFinancialDetails().getIncomeDetails();
		if (incomeDtoList == null) {
			return;
		}

		Attributes attributes = new Attributes();
		List<FinancialDetailsGrid> finGridList = new ArrayList<>();
		FinancialDetailsGrid finGrid = new FinancialDetailsGrid();
		finGrid.setElementId(convertLongToString(request.getFinancialDetails().getId()));
		finGrid.setMemberId(convertLongToString(request.getOrder()));
		finGrid.setMemberName(getFullName(request));
		if (request.getOrder() > 0) {
			finGrid.setMemberName(finGrid.getMemberName() + " [" + request.getOrder() + "]");
		}
		finGrid.setMemberType(request.getType());
		finGridList.add(finGrid);
		attributes.setFinancialDetailsGridList(finGridList);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);

		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (request.getFinancialDetails().getId() == null || request.getFinancialDetails().getId() == 0) {
			if (!Objects.isNull(response.getValues())) {
				String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
				request.getFinancialDetails().setId(convertStringToLong(insertionId));
				finGrid.setElementId(insertionId);
			}
		}
		for (IncomeDetailsDTO incomeDto : incomeDtoList) {
			List<IncomeDetailGrid> ibpsIncomeGridList = new ArrayList<>();
			IncomeDetailGrid ibpsIncomeGrid = new IncomeDetailGrid();
			ibpsIncomeGrid.setMemberId(convertLongToString(request.getOrder()));
			ibpsIncomeGrid.setElementId(convertLongToString(incomeDto.getId()));
			ibpsIncomeGrid.setIncomeType(incomeDto.getIncomeType());
			ibpsIncomeGrid.setFrequency(incomeDto.getFrequency());
			ibpsIncomeGrid.setAmount(incomeDto.getAmount());
			ibpsIncomeGrid.setMonthlyIncome(incomeDto.getMonthlyIncome());
			ibpsIncomeGrid.setAnnualIncome(incomeDto.getIncome());
			ibpsIncomeGrid.setPrimaryIncome(String.valueOf(incomeDto.isPrimarySourceOfIncome()));
			ibpsIncomeGrid.setRemarks(incomeDto.getComment());
			ibpsIncomeGridList.add(ibpsIncomeGrid);

			finGrid.setIncomeGridList(ibpsIncomeGridList);
			finGridList.clear();
			finGridList.add(finGrid);
			attributes.setFinancialDetailsGridList(finGridList);
			req.setAttributes(attributes);
			reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);

			response = ibpsPushService.setAttributes(reqStr, sessionId);
			if (isInsertionOrderIdValid(response, incomeDto.getId())) {
				String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
				incomeDto.setId(convertStringToLong(insertionId));
			}
			if (incomeDto.getId() < 0) {
				incomeDtoList.remove(incomeDto);
			}
		}
		req.setAttributes(null);
		log.info("Completed processing applicant income details");
	}

	@SuppressWarnings("unchecked")
	private void processPEPDetails(ApplicantDTO request, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		log.info("Started processing applicant income details");
		PEPDetailsDTO pepDto = request.getPoliticallyExposedPersonDetails();
		if (pepDto == null) {
			return;
		}

		Attributes attributes = new Attributes();
		List<PEPDetailsGrid> ibpsPEPGridList = new ArrayList<>();
		PEPDetailsGrid ibpsPEPGrid = new PEPDetailsGrid();
		ibpsPEPGrid.setMemberId(convertLongToString(request.getOrder()));
		ibpsPEPGrid.setMemberName(getFullName(request));
		if (request.getOrder() > 0) {
			ibpsPEPGrid.setMemberName(ibpsPEPGrid.getMemberName() + " [" + request.getOrder() + "]");
		}
		ibpsPEPGrid.setMemberType(request.getType());
		ibpsPEPGrid.setElementId(convertLongToString(pepDto.getId()));
		ibpsPEPGrid.setCurrentlyPep(pepDto.getPepFlag());
		ibpsPEPGrid.setPreviouslyPep(pepDto.getPreviousPep());
		ibpsPEPGrid.setRelationToPep(pepDto.getPepRelation());
		ibpsPEPGrid.setPepFirstName(pepDto.getPepFirstName());
		ibpsPEPGrid.setPepMiddleName(pepDto.getPepMiddleName());
		ibpsPEPGrid.setPepLastName(pepDto.getPepLastName());
		ibpsPEPGrid.setPepSuffix(pepDto.getPepSuffix());
		ibpsPEPGrid.setPepCountry(pepDto.getPepCountry());
		ibpsPEPGrid.setPositionTitle(pepDto.getPositionTitle());
		ibpsPEPGrid.setDetailsOfPositonHeld(pepDto.getDetailsOfPositonHeld());
		ibpsPEPGrid.setDateAddedToPepList(pepDto.getDateAddedToPepList());
		ibpsPEPGrid.setYearsInPosition(pepDto.getYearsInPosition());
		ibpsPEPGrid.setDateRemovedFromPep(pepDto.getDateRemovedFromPep());
		ibpsPEPGridList.add(ibpsPEPGrid);
		attributes.setPepDetailsGridList(ibpsPEPGridList);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (pepDto.getId() == null || pepDto.getId() <= 0) {
			if (!Objects.isNull(response.getValues())) {
				String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
				pepDto.setId(convertStringToLong(insertionId));
				ibpsPEPGrid.setElementId(insertionId);
			}
		}

		for (PEPRelationDTO pepRelDto : pepDto.getRelationshipDetails()) {
			List<PEPRelationGrid> ibpsPEPRelGridList = new ArrayList<>();
			PEPRelationGrid ibpsPEPRelGrid = new PEPRelationGrid();
			ibpsPEPRelGrid.setElementId(convertLongToString(pepRelDto.getId()));
			ibpsPEPRelGrid.setFirstName(pepRelDto.getFirstName());
			ibpsPEPRelGrid.setMiddleName(pepRelDto.getMiddleName());
			ibpsPEPRelGrid.setLastName(pepRelDto.getLastName());
			ibpsPEPRelGrid.setRelationship(pepRelDto.getRelationship());
			ibpsPEPRelGrid.setDob(pepRelDto.getDob());
			ibpsPEPRelGridList.add(ibpsPEPRelGrid);
			ibpsPEPGrid.setRelationGrid(ibpsPEPRelGridList);
			ibpsPEPGridList.clear();
			ibpsPEPGridList.add(ibpsPEPGrid);
			attributes.setPepDetailsGridList(ibpsPEPGridList);
			req.setAttributes(attributes);
			reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
			response = ibpsPushService.setAttributes(reqStr, sessionId);
			if (pepRelDto.getId() == null || pepRelDto.getId() <= 0) {
				if (!Objects.isNull(response.getValues())) {
					String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
					pepRelDto.setId(convertStringToLong(insertionId));
				}
			}
			if (pepRelDto.getId() < 0) {
				pepDto.getRelationshipDetails().remove(pepRelDto);
			}
		}
		req.setAttributes(null);
		log.info("Completed processing applicant PEP details");
	}

	/*@SuppressWarnings("unchecked")
	private void processFamilyDetails(ApplicantDTO request, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		log.info("Started processing applicant family details");
		FamilyDetailsDTO familyDto = request.getFamilyDetails();
		if (familyDto == null) {
			return;
		}

		Attributes attributes = new Attributes();
		FamilyDetailsGrid ibpsFamilyGrid = new FamilyDetailsGrid();
		ibpsFamilyGrid.setElementId(convertLongToString(familyDto.getId()));
		//ibpsFamilyGrid.setNoOfDependent(familyDto.getNoOfDependent());
		ibpsFamilyGrid.setFatherName(familyDto.getFatherName());
		ibpsFamilyGrid.setFatherEmployerName(familyDto.getEmployerName());
		ibpsFamilyGrid.setFatherAddress(familyDto.getResidentialAddress());
		ibpsFamilyGrid.setFatherTelephoneNo(familyDto.getTelephoneNumber());
		ibpsFamilyGrid.setFatherMobileNo(familyDto.getMobilePhoneNumber());
		ibpsFamilyGrid.setMotherName(familyDto.getMotherName());
		ibpsFamilyGrid.setMotherEmployerName(familyDto.getMotherEmployerName());
		ibpsFamilyGrid.setMotherAddress(familyDto.getMotherResidentialAddress());
		ibpsFamilyGrid.setMotherTelephoneNo(familyDto.getMotherTelephoneNumber());
		ibpsFamilyGrid.setMotherMobileNo(familyDto.getMotherTelephoneNumber());
		attributes.setFamilyDetailsGrid(ibpsFamilyGrid);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (familyDto.getId() == null || familyDto.getId() <= 0) {
			if (!Objects.isNull(response.getValues())) {
				String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
				familyDto.setId(convertStringToLong(insertionId));
			}
		}

		for (ChildDetailsDTO childDto : familyDto.getChildrenDetails()) {
			List<ChildrenDetailsGrid> ibpsChildrenGridList = new ArrayList<>();
			ChildrenDetailsGrid ibpsChildrenGrid = new ChildrenDetailsGrid();
			ibpsChildrenGrid.setElementId(convertLongToString(childDto.getId()));
			ibpsChildrenGrid.setName(childDto.getName());
			ibpsChildrenGrid.setRelationship(childDto.getRelationship());
			ibpsChildrenGrid.setEmployerName(childDto.getEmployerName());
			ibpsChildrenGrid.setAddress(childDto.getAddress());
			ibpsChildrenGrid.setTelephoneNo(childDto.getTelephoneNumber());
			ibpsChildrenGrid.setMobileNo(childDto.getMobilePhoneNumber());
			ibpsChildrenGridList.add(ibpsChildrenGrid);
			attributes = new Attributes();
			attributes.setChildrenDetailsGrid(ibpsChildrenGridList);
			req.setAttributes(attributes);
			reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
			response = ibpsPushService.setAttributes(reqStr, sessionId);
			if (childDto.getId() == null || childDto.getId() <= 0) {
				if (!Objects.isNull(response.getValues())) {
					String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
					childDto.setId(convertStringToLong(insertionId));
				}
			}
			if (childDto.getId() < 0) {
				familyDto.getChildrenDetails().remove(childDto);
			}
		}
		req.setAttributes(null);
		log.info("Completed processing applicant PEP details");
	}
*/
	private void processReferenceDetails(ApplicantDTO request, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		log.info("Started processing applicant reference info");
		List<ReferenceDTO> refDtoList = request.getReferenceDetails();
		if (refDtoList == null) {
			return;
		}
		Attributes attributes = new Attributes();
		List<Reference> ibpsRefGridList = new ArrayList<>();
		
		for (ReferenceDTO refDto : refDtoList) {
			if(!Objects.isNull(refDto.getFirstName())){
				Reference ibpsRefGrid = new Reference();
				ibpsRefGridList.clear();

				ibpsRefGrid.setElementId(convertLongToString(refDto.getId()));
				ibpsRefGrid.setTitle(refDto.getTitle());
				ibpsRefGrid.setFirstName(refDto.getFirstName());
				ibpsRefGrid.setMiddleName(refDto.getMiddleName());
				ibpsRefGrid.setLastName(refDto.getLastName());
				ibpsRefGrid.setReferenceName(refDto.getFirstName() + " " + refDto.getLastName());
				ibpsRefGrid.setEmployer(refDto.getEmployer());
				ibpsRefGrid.setRelationship(refDto.getRelationship());
				ibpsRefGrid.setPhoneNo(refDto.getPhoneNo());
				ibpsRefGrid.setIsMailingAndResidentialAddDifferent(refDto.getIsMailingAndResidentialAddDifferent());
				for (AddressDTO addressDto : refDto.getAddresses()) {
					if (CURRENT.equalsIgnoreCase(addressDto.getType())) {
						ibpsRefGrid.setAddressLine1(addressDto.getAddressLine1());
						ibpsRefGrid.setAddressLine2(addressDto.getAddressLine2());
						ibpsRefGrid.setCity(addressDto.getCity());
						ibpsRefGrid.setState(addressDto.getState());
						ibpsRefGrid.setCountry(addressDto.getCountry());
						ibpsRefGrid.setPoBoxNo(addressDto.getPoBoxNo());
					}
					if (MAILING.equalsIgnoreCase(addressDto.getType())) {
						ibpsRefGrid.setMailingAddressLine1(addressDto.getAddressLine1());
						ibpsRefGrid.setMailingAddressLine2(addressDto.getAddressLine2());
						ibpsRefGrid.setMailingCity(addressDto.getCity());
						ibpsRefGrid.setMailingState(addressDto.getState());
						ibpsRefGrid.setMailingCountry(addressDto.getCountry());
						ibpsRefGrid.setPoBoxNoMailing(addressDto.getPoBoxNo());
					}
				}
				ibpsRefGridList.add(ibpsRefGrid);
				attributes.setReferences(ibpsRefGridList);
				req.setAttributes(attributes);
				String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
				SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
				if (refDto.getId() == null || refDto.getId() <= 0) {
					if (!Objects.isNull(response.getValues())) {
						String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
						refDto.setId(convertStringToLong(insertionId));
					}
				}
				if (refDto.getId() < 0) {
					refDtoList.remove(refDto);
				}
			}
			req.setAttributes(null);
			log.info("Completed processing applicant reference info");
		}
	
			}
			
	private void processEmployementDetails(ApplicantDTO request, String sessionId, SetAttributesRequest req)
			throws JAXBException {
		log.info("Started processing applicant employment info");
		List<IEmployment> empDtoList = request.getEmpDetails();
		if (empDtoList == null) {
			return;
		}
		Attributes attributes = new Attributes();
		List<EmploymentDetail> ibpsEmpGridList = new ArrayList<>();
		attributes.setEmployementDetails(ibpsEmpGridList);
		req.setAttributes(attributes);

		for (IEmployment empDto : empDtoList) {
			ibpsEmpGridList.clear();
			// EmploymentDetail emp = new EmploymentDetail();
			EmploymentDetail ibpsEmpGrid = new EmploymentDetail();
			ibpsEmpGrid.setMemberId(convertLongToString(request.getOrder()));
			ibpsEmpGrid.setMemberType(request.getType());
			ibpsEmpGrid.setElementId(convertLongToString(empDto.getId()));
			ibpsEmpGrid.setEmpType(empDto.getEmpType());
			ibpsEmpGrid.setEmpTypeLabel(empDto.getEmpTypeLabel());
			ibpsEmpGrid.setMemberName(getFullName(request));
			if (request.getOrder() > 0) {
				ibpsEmpGrid.setMemberName(ibpsEmpGrid.getMemberName() + " [" + request.getOrder() + "]");
			}
			if (empDto.getEmpType().equalsIgnoreCase(EmploymentType.EMP.getShortName())) {
				SalariedDetailsDTO empDetailsDto = ((SalariedDTO) empDto).getEmpDetail();
				ibpsEmpGrid.setCompanyName(empDetailsDto.getCompanyName());
				ibpsEmpGrid.setSector(empDetailsDto.getSector());
				ibpsEmpGrid.setJobTitle(empDetailsDto.getJobTitle());
				ibpsEmpGrid.setJobTitleDescription(empDetailsDto.getJobTitleDescription());
				ibpsEmpGrid.setYearsEmployed(empDetailsDto.getYearsEmployed());
				ibpsEmpGrid.setMonthsEmployed(empDetailsDto.getMonthsEmployed());
				ibpsEmpGrid.setWorkPermitPresent(empDetailsDto.getWorkPermitPresent());
				ibpsEmpGrid.setWorkPermitExpiry(empDetailsDto.getWorkPermitExpiry());
				ibpsEmpGrid.setWorkpermitNumber(empDetailsDto.getWorkPermitNumber());
				ibpsEmpGrid.setEmpDate(empDetailsDto.getEmpDate());
				for (AddressDTO addressDto : empDetailsDto.getAddresses()) {
					if (CURRENT.equalsIgnoreCase(addressDto.getType())) {
						ibpsEmpGrid.setEmpApartment(addressDto.getAddressLine1());
						ibpsEmpGrid.setEmpPOBoxNo(addressDto.getAddressLine2());
						ibpsEmpGrid.setEmpStreetName(addressDto.getPoBoxNo());
						ibpsEmpGrid.setEmpCity(addressDto.getState());
						ibpsEmpGrid.setEmpIslandState(addressDto.getCity());
						ibpsEmpGrid.setEmpCountry(addressDto.getCountry());
						ibpsEmpGrid.setEmpPhoneNo(addressDto.getPhoneNo());
					}
				}
			}
			if (empDto.getEmpType().equalsIgnoreCase(EmploymentType.SEMP.getShortName())) {
				SelfEmployedDetailsDTO empDetailsDto = ((SelfEmployedDTO) empDto).getEmpDetail();
				// ibpsEmpGrid.setBusinessName(empDetailsDto.getBusinessName());
				ibpsEmpGrid.setCompanyName(empDetailsDto.getBusinessName());
				ibpsEmpGrid.setJobTitleDescription(empDetailsDto.getJobTitleDescription());
				ibpsEmpGrid.setBusinessType(empDetailsDto.getBusinessType());
				ibpsEmpGrid.setBusinessDate(empDetailsDto.getBusinessDate());
				ibpsEmpGrid.setYearsBusiness(empDetailsDto.getYearsBusiness());
				ibpsEmpGrid.setMonthsBusiness(empDetailsDto.getMonthsBusiness());
				for (AddressDTO addressDto : empDetailsDto.getAddresses()) {
					if (BUSINESS.equalsIgnoreCase(addressDto.getType())) {
						// ibpsEmpGrid.setBusinessApartment(addressDto.getAddressLine1());
						ibpsEmpGrid.setEmpApartment(addressDto.getAddressLine1());
						// ibpsEmpGrid.setBusinessStreetName(addressDto.getAddressLine2());
						ibpsEmpGrid.setEmpStreetName(addressDto.getPoBoxNo());
						// ibpsEmpGrid.setBusinessCity(addressDto.getCity());
						ibpsEmpGrid.setEmpCity(addressDto.getState());
						// ibpsEmpGrid.setBusinessIslandState(addressDto.getState());
						ibpsEmpGrid.setEmpIslandState(addressDto.getCity());
						// ibpsEmpGrid.setBusinessCountry(addressDto.getCountry());
						ibpsEmpGrid.setEmpCountry(addressDto.getCountry());
						// ibpsEmpGrid.setBusinessPOBoxNo(addressDto.getPoBoxNo());
						ibpsEmpGrid.setEmpPOBoxNo(addressDto.getAddressLine2());
						// ibpsEmpGrid.setBusinessPhoneNo(addressDto.getPhoneNo());
						ibpsEmpGrid.setEmpPhoneNo(addressDto.getPhoneNo());
					}
				}
			}
			if (empDto.getEmpType().equalsIgnoreCase(EmploymentType.RET.getShortName())) {
				RetiredDetailsDTO empDetailsDto = ((RetiredDTO) empDto).getEmpDetail();
				// ibpsEmpGrid.setLastCompanyName(empDetailsDto.getLastCompanyName());
				ibpsEmpGrid.setCompanyName(empDetailsDto.getLastCompanyName());
				ibpsEmpGrid.setJobTitle(empDetailsDto.getJobTitle());
				ibpsEmpGrid.setJobTitleDescription(empDetailsDto.getJobTitleDescription());
				ibpsEmpGrid.setSector(empDetailsDto.getSector());
				ibpsEmpGrid.setYearOfRetirement(empDetailsDto.getYearOfRetirement());
				for (AddressDTO addressDto : empDetailsDto.getAddresses()) {
					if (CURRENT.equalsIgnoreCase(addressDto.getType())) {
						ibpsEmpGrid.setEmpApartment(addressDto.getAddressLine1());
						ibpsEmpGrid.setEmpStreetName(addressDto.getPoBoxNo());
						ibpsEmpGrid.setEmpCity(addressDto.getState());
						ibpsEmpGrid.setEmpIslandState(addressDto.getCity());
						ibpsEmpGrid.setEmpCountry(addressDto.getCountry());
						ibpsEmpGrid.setEmpPOBoxNo(addressDto.getAddressLine2());
						ibpsEmpGrid.setEmpPhoneNo(addressDto.getPhoneNo());
					}
				}
			}
			if (empDto.getEmpType().equalsIgnoreCase(EmploymentType.STU.getShortName())) {
				StudentDetailsDTO empDetailsDto = ((StudentDTO) empDto).getEmpDetail();
				ibpsEmpGrid.setHighestEducation(empDetailsDto.getHighestEducation());
				// ibpsEmpGrid.setOrganizationName(empDetailsDto.getOrganizationName());
				ibpsEmpGrid.setCompanyName(empDetailsDto.getOrganizationName());
				ibpsEmpGrid.setFundingPerson(empDetailsDto.getFundingPerson());
				ibpsEmpGrid.setRelationshipWithApplicant(empDetailsDto.getRelationshipWithApplicant());
				ibpsEmpGrid.setIsFundingPersonAnExistingCustomer(empDetailsDto.getIsFundingPersonAnExistingCustomer());
				for (AddressDTO addressDto : empDetailsDto.getAddresses()) {
					if (CURRENT.equalsIgnoreCase(addressDto.getType())) {
						ibpsEmpGrid.setEmpApartment(addressDto.getAddressLine1());
						ibpsEmpGrid.setEmpStreetName(addressDto.getPoBoxNo());
						ibpsEmpGrid.setEmpCity(addressDto.getState());
						ibpsEmpGrid.setEmpIslandState(addressDto.getCity());
						ibpsEmpGrid.setEmpCountry(addressDto.getCountry());
						ibpsEmpGrid.setEmpPOBoxNo(addressDto.getAddressLine2());
						ibpsEmpGrid.setEmpPhoneNo(addressDto.getPhoneNo());
					}
				}
			}
			if (empDto.getEmpType().equalsIgnoreCase(EmploymentType.NEMP.getShortName())) {
				NonEmployedDetailsDTO empDetailsDto = ((NonEmployedDTO) empDto).getEmpDetail();
				ibpsEmpGrid.setFundingPerson(empDetailsDto.getFundingPerson());
				ibpsEmpGrid.setRelationshipWithApplicant(empDetailsDto.getRelationshipWithApplicant());
				ibpsEmpGrid.setIsFundingPersonAnExistingCustomer(empDetailsDto.getIsFundingPersonAnExistingCustomer());
			}

			ibpsEmpGridList.add(ibpsEmpGrid);
			String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
			SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
			if (isInsertionOrderIdValid(response, empDto.getId())) {
				String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
				empDto.setId(convertStringToLong(insertionId));
				// empDto.setApplicantId(request.getOrder());
			}
		}
		req.setAttributes(null);
		log.info("Completed processing applicant employment info");
	}

	private void processAddressInformation(ApplicantDTO request, String sessionId, SetAttributesRequest req)
			throws JAXBException {

		log.info("Started processing applicant address info");
		AddressDetailsDTO addressDetails = request.getAddressDetails();
		if (addressDetails == null) {
			return;
		}

		Attributes attributes = new Attributes();

		List<AddressDetail> ibpsContactInfoGridList = new ArrayList<>();
		AddressDetail ibpsContactInfoGrid = new AddressDetail();
		ibpsContactInfoGrid.setElementId(convertLongToString(addressDetails.getId()));
		ibpsContactInfoGrid.setMemberId(convertLongToString(request.getOrder()));
		ibpsContactInfoGrid.setApplicantType(request.getType());
		ibpsContactInfoGrid.setApplicantName(getFullName(request));
		if (request.getOrder() > 0) {
			ibpsContactInfoGrid
					.setApplicantName(ibpsContactInfoGrid.getApplicantName() + " [" + request.getOrder() + "]");
		}
		ibpsContactInfoGrid.setMonthlyRent(addressDetails.getAmtOfRent());
		ibpsContactInfoGrid.setMortgageOwnerName(addressDetails.getMortgageOwnersFullName());
		ibpsContactInfoGrid.setMortgageOwnerPhoneNo(addressDetails.getMortgageOwnerPhoneNumber());
		ibpsContactInfoGrid.setRelationwithMortgageOwner(addressDetails.getRelationshipWithMortgageOwner());
		// ibpsContactInfoGrid.setHomePhoneNo(addressDetails.getHomePhoneNo());
		// ibpsContactInfoGrid.setMobilePhoneNo(addressDetails.getMobileNo());
		// ibpsContactInfoGrid.setWorkPhoneNo(addressDetails.getWorkPhoneNo());
		if (addressDetails.getIsMailingAndResidentialAddDifferent() != null) {
			ibpsContactInfoGrid.setIsMailAddSameAsRes(
					addressDetails.getIsMailingAndResidentialAddDifferent().equalsIgnoreCase("Yes") ? true : false);
		}
		for (AddressDTO add : addressDetails.getAddresses()) {
			if (CURRENT.equalsIgnoreCase(add.getType())) {
				ibpsContactInfoGrid.setApartment(add.getAddressLine2());
				ibpsContactInfoGrid.setStreetAddress(add.getAddressLine1());
				ibpsContactInfoGrid.setCity(add.getCity());
				ibpsContactInfoGrid.setState(add.getState());
				ibpsContactInfoGrid.setCountry(add.getCountry());
				ibpsContactInfoGrid.setCountryLabel(add.getCountryLabel());				
				ibpsContactInfoGrid.setPOBoxNo(add.getPoBoxNo());
				ibpsContactInfoGrid.setOwnOrRent(add.getOwnOrRent());
				ibpsContactInfoGrid.setDateMovedIn(add.getDateMovedIn());
				ibpsContactInfoGrid.setYears(add.getYears());
				ibpsContactInfoGrid.setMonths(add.getMonths());
				ibpsContactInfoGrid.setDrivingDetailsToCurrentAddress(add.getDrivingDetailsToCurrentAddress()); //
			}
			if (MAILING.equalsIgnoreCase(add.getType())) {
				ibpsContactInfoGrid.setMailingApartment(add.getAddressLine2());
				ibpsContactInfoGrid.setMailingStreetAddress(add.getAddressLine1());
				ibpsContactInfoGrid.setMailingCity(add.getCity());
				ibpsContactInfoGrid.setMailingState(add.getState());
				ibpsContactInfoGrid.setMailingCountry(add.getCountry());
				ibpsContactInfoGrid.setMailingPOBoxNo(add.getPoBoxNo());
			}
			if (PREVIOUS.equalsIgnoreCase(add.getType())) {
				ibpsContactInfoGrid.setPreviousApartment(add.getAddressLine2());
				ibpsContactInfoGrid.setPreviousStreetAddress(add.getAddressLine1());
				ibpsContactInfoGrid.setPreviousCity(add.getCity());
				ibpsContactInfoGrid.setPreviousState(add.getState());
				ibpsContactInfoGrid.setPreviousCountry(add.getCountry());
				ibpsContactInfoGrid.setPreviousPOBoxNo(add.getPoBoxNo());
			}
		}

		ibpsContactInfoGridList.add(ibpsContactInfoGrid);
		attributes.setAddressDetails(ibpsContactInfoGridList);
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);

		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (isInsertionOrderIdValid(response, addressDetails.getId())) {
			String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
			addressDetails.setId(convertStringToLong(insertionId));
			request.setAddressDetails(addressDetails);
		}
		req.setAttributes(null);
		log.info("Completed processing applicant address info");
	}

	private void processBasicInformation(ApplicantDTO request, String sessionId, SetAttributesRequest req)
			throws JAXBException {

		log.info("Started processing applicant basic info");
		Attributes attributes = new Attributes();
		List<ApplicantDetail> ibpsApplicantGridList = new ArrayList<>();
		ApplicantDetail ibpsApplicantGrid = new ApplicantDetail();
		long order = request.getOrder();
		ibpsApplicantGrid.setElementId(convertLongToString(request.getId()));
		ibpsApplicantGrid.setMemberId(convertLongToString(order));
		ibpsApplicantGrid.setMemberType(request.getType());
		ibpsApplicantGrid.setExistingCustomer(request.getExistingCustomer());
		ibpsApplicantGrid.setPrefix(request.getPrefix());
		ibpsApplicantGrid.setSuffix(request.getSuffix());
		ibpsApplicantGrid.setFirstName(request.getFirstName());
		ibpsApplicantGrid.setMiddleName(request.getMiddleName());
		ibpsApplicantGrid.setLastName(request.getLastName());
		ibpsApplicantGrid.setMaidenName(request.getMaidenName());
		ibpsApplicantGrid.setMotherMaidenName(request.getMotherMaidenName());
		ibpsApplicantGrid.setEmailAddress(request.getEmail());
		ibpsApplicantGrid.setConfirmEmailAddress(request.getConfirmEmail());
		ibpsApplicantGrid.setCellPhone(request.getCellPhoneNo());
		ibpsApplicantGrid.setWorkPhone(request.getWorkPhoneNo());
		ibpsApplicantGrid.setHomePhone(request.getHomePhoneNo());

		ibpsApplicantGrid.setGender(request.getGender());
		ibpsApplicantGrid.setMaritalStatus(request.getMaritalStatus());
		ibpsApplicantGrid.setDob(request.getDob());
		ibpsApplicantGrid.setCitizenship(request.getCitizenship());
		ibpsApplicantGrid.setPlaceOfBirth(request.getPlaceOfBirth());
		ibpsApplicantGrid.setNoOfDependent(request.getNoOfDependent());
		
		ibpsApplicantGrid.setSsn(request.getSsn());
		ibpsApplicantGrid.setIsBankEmployee(request.getIsBankEmployee());
		ibpsApplicantGrid.setIsGovernmentEmployee(request.getIsGovernmentEmployee());
		ibpsApplicantGrid.setRelationToPrimary(request.getRelation());

		ibpsApplicantGrid.setAge(String.valueOf(request.getAge()));
		ibpsApplicantGrid.setHowLongInYears(request.getHowLongInYears());
		ibpsApplicantGrid.setTin(request.getTinNumber());
		ibpsApplicantGrid.setLifeInsuranceRequired(request.getLifeInsuranceRequired());
		ibpsApplicantGrid.setLifeInsuranceAlreadyPresent(request.getLifeInsuranceAlreadyPresent());
		ibpsApplicantGrid.setLifeInsuranceProviderName(request.getLifeInsuranceProviderName());
		ibpsApplicantGrid.setIsFilledAtPortal("Yes");

		ibpsApplicantGridList.add(ibpsApplicantGrid);
		attributes.setApplicantDetails(ibpsApplicantGridList);
		if (request.getOrder() == 1) {
			attributes.setNationalIdNo(request.getSsn());
		}
		req.setAttributes(attributes);
		String reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
		SetAttributeResponse response = ibpsPushService.setAttributes(reqStr, sessionId);
		if (request.getId() == null || request.getId() <= 0) {
			if (!Objects.isNull(response.getValues())) {
				String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
				request.setId(convertStringToLong(insertionId));
			}
		}

		log.info("Started processing applicant identification info");
		for (IdDetail idDetailDto : request.getIdDetails()) {
			List<IdentificationDetail> list = new ArrayList<>();
			IdentificationDetail ibpsIdInfo = new IdentificationDetail();
			ibpsIdInfo.setElementId(convertLongToString(idDetailDto.getId()));
			ibpsIdInfo.setIdType(idDetailDto.getIdType());
			ibpsIdInfo.setIdTypeLabel(idDetailDto.getIdTypeLabel());
			ibpsIdInfo.setMemberId(convertLongToString(request.getOrder()));
			ibpsIdInfo.setMemberType(request.getType());
			ibpsIdInfo.setIdNumber(idDetailDto.getIdNumber());
			ibpsIdInfo.setIdIssueDate(idDetailDto.getIdIssueDate());
			ibpsIdInfo.setIdExpDate(idDetailDto.getIdExpDate());
			ibpsIdInfo.setIdIssuingCountry(idDetailDto.getIdIssuingCountry());
			ibpsIdInfo.setIdIssuingCountryName(idDetailDto.getIdIssuingCountryLabel());
			ibpsIdInfo.setApplicantName(getFullName(request) + " [" + request.getOrder() + "]");
			list.add(ibpsIdInfo);
			attributes = new Attributes();
			attributes.setIdentificationDetails(list);
			req.setAttributes(attributes);
			reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true, true);
			response = ibpsPushService.setAttributes(reqStr, sessionId);
			if (idDetailDto.getId() == null || idDetailDto.getId() <= 0) {
				if (!Objects.isNull(response.getValues())) {
					String insertionId = response.getValues().get(0).getValue().getInsertionOrderId();
					idDetailDto.setId(convertStringToLong(insertionId));
				}
			}
			if (idDetailDto.getId() < 0) {
				request.getIdDetails().remove(idDetailDto);
			}
		}
		log.info("Completed processing applicant identification info");
		if (order > 1) {
			// To be discussed: Q_Application_Details doesn't exist in iBPS
			// ApplicationDetails applicationDetails = new ApplicationDetails();
			// applicationDetails.setCoApplicant("Yes");
			// ibpsApplicantGrid.setLoanRelationship(request.getLoanRelationship());
			// attributes.setApplicationDetails(applicationDetails);
			// req.setAttributes(attributes);
			// reqStr = JaxBUtil.marshal(SetAttributesRequest.class, req, true,
			// true);
			// response = ibpsPushService.setAttributes(reqStr, sessionId);
		}
		req.setAttributes(null);
		log.info("Completed processing applicant basic info");
	}

	private String getFullName(ApplicantDTO applicant) {
		String name = "";
		name = (StringUtils.defaultIfBlank(applicant.getFirstName(), "") + " "
				+ StringUtils.defaultIfBlank(applicant.getLastName(), "")).replaceAll("  ", " ");

		return name;
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

	private boolean isInsertionOrderIdValid(SetAttributeResponse response, Long id) {
		return id == null
				|| CollectionUtils.isNotEmpty(response.getValues()) && response.getValues().get(0).getValue() != null;
	}

	private String checkStringForNull(String id, String defaultvalue) {
		return id == null ? defaultvalue : id;
	}

	private Long convertStringToLong(String id) {
		return id == null ? null : Long.parseLong(id);
	}

	private String convertLongToString(Long id) {
		return id == null ? null : id.toString();
	}
}
