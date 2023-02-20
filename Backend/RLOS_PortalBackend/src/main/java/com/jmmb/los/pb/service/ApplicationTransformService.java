package com.jmmb.los.pb.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.validation.constraints.NotNull;
import javax.xml.bind.JAXBException;

import com.jmmb.los.pb.ibps.dto.*;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jmmb.los.pb.api.dto.AddressDTO;
import com.jmmb.los.pb.api.dto.AddressDetailsDTO;
import com.jmmb.los.pb.api.dto.ApplicantDTO;
import com.jmmb.los.pb.api.dto.ApplicationDTO;
import com.jmmb.los.pb.api.dto.ApplicationPreferenceDTO;
import com.jmmb.los.pb.api.dto.AssetDTO;
import com.jmmb.los.pb.api.dto.ChildDetailsDTO;
import com.jmmb.los.pb.api.dto.CollateralDetailsDTO;
import com.jmmb.los.pb.api.dto.CreditCardDTO;
import com.jmmb.los.pb.api.dto.DocumentDetailsDTO;
import com.jmmb.los.pb.api.dto.EmploymentDetailsDTO;
import com.jmmb.los.pb.api.dto.ExpenseDetailsDTO;
import com.jmmb.los.pb.api.dto.FamilyDetailsDTO;
import com.jmmb.los.pb.api.dto.FinancialDetailsDTO;
import com.jmmb.los.pb.api.dto.IdDetail;
import com.jmmb.los.pb.api.dto.IncomeDetailsDTO;
import com.jmmb.los.pb.api.dto.LiabilityDetailsDTO;
import com.jmmb.los.pb.api.dto.LoanDetailsDTO;
import com.jmmb.los.pb.api.dto.OverdraftDTO;
import com.jmmb.los.pb.api.dto.PEPDetailsDTO;
import com.jmmb.los.pb.api.dto.PEPRelationDTO;
import com.jmmb.los.pb.api.dto.ReferenceDTO;
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
import com.jmmb.los.pb.api.exception.InvalidRequestException;
import com.jmmb.los.pb.api.exception.InvalidRequestException.Code;
import com.jmmb.los.pb.ibps.config.IBPSConfig;
import com.jmmb.los.pb.ibps.service.IbpsPushService;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ApplicationTransformService {

	// private static final String OUR_DEPOSIT_ACCOUNT = "Our Deposit Account";
	// private static final String OTHER_BANK_DEPOSIT_ACCOUNT = "Other bank
	// deposit account";
	// private static final String BONDS = "Bonds";
	// private static final String SHARES = "Shares";
	// private static final String PARTY_GUARANTEE = "3rd Party Guarantee";
	// private static final String RISK_POLICY = "Risk Policy";
	// private static final String LIFE_INSURANCE_POLICY = "Life Insurance
	// Policy";
	// private static final String UNITS = "Units";
	// private static final String MORTGAGE_INDEMNITY = "Mortgage Indemnity";
	// private static final String INSTALLMENT_LOAN = "installment loan";
	// private static final String MORTGAGE_LOAN = "Mortgage loan";
	// private static final String VEHICLE_LOAN = "vehicle loan";
	// private static final String MAILING = "mailing";
	// private static final String LEGAL = "legal";

	@Autowired
	private IbpsPushService ibpsPushService;

	@Autowired
	private IBPSConfig iBPSConfig;

	@Autowired
	private PreferenceService preferenceService;

	public ApplicationDTO getApplicationUsingArn(@NotNull String arn) {
		log.info("Starting to fetch IBPS data for arn {}", arn);
		String workItemNumber = arn;
		String sessionId = null;
		Attributes attributes = null;
		try {
			sessionId = ibpsPushService.createSession();
		} catch (Exception e) {
			log.info("Error While Creating session with IBPS for arn : {}", arn);
			throw new InvalidRequestException(e.getMessage(), Code.IBPS_SESSION_ERROR);
		}
		try {
			ibpsPushService.lockWorkItem(sessionId, workItemNumber);
			attributes = ibpsPushService.fetchWorkItemData(sessionId, workItemNumber);
			ibpsPushService.unlockWorkItem(workItemNumber, sessionId);
		} catch (InstantiationException | IllegalAccessException | JAXBException | IOException e) {
			log.error("Error while Fetching Data from IBPS for arn {}", arn, e);
		} finally {
			if (sessionId != null) {
				try {
					ibpsPushService.disconnectSession(sessionId, iBPSConfig.getIbpsPushUserName());
				} catch (Exception e) {
					log.error("Error While IBPS session disconnect for arn : {}", arn, e);
				}
			}
		}
		if (Objects.isNull(attributes)) {
			log.error("Unable to fetch any attribute from IBPS for arn {}", arn);
			return null;
		} else {
			ApplicationDTO applicationDTO = new ApplicationDTO();
			dataTransformer(attributes, workItemNumber, applicationDTO);
			return applicationDTO;
		}
	}

	private void dataTransformer(Attributes attributes, String workItemNumber, ApplicationDTO applicationDTO) {

		try {
			log.info("Starting to transform the data");

			applicationDTO.setArn(workItemNumber);
			// applicationDTO.setWorkItemNumber(workItemNumber);
			applicationDTO.setBranchCode(attributes.getBranchCode());
			applicationDTO.setBranchName(attributes.getBranchName());
			/*
			 * ApplicationDetails applicationDetails =
			 * attributes.getApplicationDetails(); if
			 * (Objects.isNull(applicationDetails)) { log.error(
			 * "Data received with null branch Code under Basic Detail Grid"); }
			 * else { applicationDTO.setBranchCode(nullCheck(applicationDetails.
			 * getBranchCode())); }
			 */
			processApplicantsInformation(attributes, applicationDTO);
			processLoanInformation(attributes, applicationDTO);
			processDocumentsDetails(applicationDTO, attributes.getDocumentsGrid());
			processConsentInfo(applicationDTO, attributes.getConsentGrid(), attributes.getDecisionGrid());
			processApplicationPreferences(workItemNumber, applicationDTO);
			log.info("Successfully transformed the data");
		} catch (Exception e) {
			log.info("Unable to transform the attributes received for arn {}", workItemNumber, e);
		}
	}

	private void processConsentInfo(ApplicationDTO applicationDTO, ConsentsGrid consentGrid, DecisionGrid decisionGrid) {
		try {
			if (!Objects.isNull(consentGrid)) {
				// applicationDTO.setCutomerRemarks(String.valueOf(decisionGrid.getCustomerRemarks()));
				applicationDTO.setConsent(consentGrid.getConsent());
			}
			if (!Objects.isNull(decisionGrid)) {
				applicationDTO.setReferralSource(decisionGrid.getReferalCode());
				applicationDTO.setCutomerRemarks(decisionGrid.getCustomerRemarks());
			}
		} catch (Exception e) {
			log.info("error in consents");
		}
	}

	private void processApplicationPreferences(String workItemNumber, ApplicationDTO applicationDTO) {
		ApplicationPreferenceDTO applicationPreferences = preferenceService.loadPreference(workItemNumber);
		applicationDTO.setPreferences(applicationPreferences);
	}

	private void processLoanInformation(Attributes attributes, ApplicationDTO applicationDTO) {
		LoanRequestedDetail loanGrid = attributes.getLoanDetailsGrid();
		List<CreditCardGrid> creditCardGridList = attributes.getCreditCardGridList();
		List<OverdraftGrid> overdraftGridList = attributes.getOverdraftGridList();
		CollateralDetail collGrid = attributes.getCollateralDetails();
		if (Objects.isNull(loanGrid) || Objects.isNull(creditCardGridList) || Objects.isNull(overdraftGridList)) {
			if (Objects.isNull(loanGrid)) {
				log.info("Loan Details grid is empty for arn {}", applicationDTO.getArn());
			}
			if (Objects.isNull(creditCardGridList)) {
				log.info("Credit Card Details grid is empty for arn {}", applicationDTO.getArn());
			}
			if (Objects.isNull(overdraftGridList)) {
				log.info("Overdraft Details grid is empty for arn {}", applicationDTO.getArn());
			}
		}
		LoanDetailsDTO loanDTO = new LoanDetailsDTO();
		loanDTO.setProduct(attributes.getProductType());
		loanDTO.setLoanType(attributes.getLoanType());
		if (!Objects.isNull(loanGrid)) {
			log.info("Loan Details Transformation Starts");
			loanDTO.setId(convertToLong(loanGrid.getAttributeId()));
			loanDTO.setLoanType(loanGrid.getLoanType());
			// loanDTO.setFacilityType(loanGrid.getIsSecuredFacility().equalsIgnoreCase("Yes")
			// ? "Secured" : "Unsecured");
			loanDTO.setLoanPurposeType(loanGrid.getLoanPurpose());
			loanDTO.setLoanPurposeOthers(loanGrid.getLoanPurposeOthers());
			loanDTO.setAmountRequired(loanGrid.getLoanAmountRequired());
			loanDTO.setLoanTerm(loanGrid.getLoanTerm());
			applicationDTO.setLoanDetails(loanDTO);
			log.info("Loan Details Transformation completed successfully!");
		}
		if (!Objects.isNull(creditCardGridList) && !creditCardGridList.isEmpty()) {
			log.info("Credit Card details transformation starts");
			loanDTO.setLoanType(attributes.getProductType());
			List<CreditCardDTO> ccDTOList = new ArrayList<>();
			for (CreditCardGrid ccGrid : creditCardGridList) {
				CreditCardDTO ccDTO = new CreditCardDTO();
				ccDTO.setId(convertToLong(ccGrid.getAttributeId()));
				ccDTO.setApplicantOrder(ccGrid.getMemberId());
				ccDTO.setCardsRequiredFor(ccGrid.getRequiedFor());
				ccDTO.setCardType(ccGrid.getCardType());
				ccDTO.setCardTypeLabel(ccGrid.getCardTypeLabel());
				ccDTO.setOrder(ccGrid.getCardOrder());
				ccDTO.setBranch(ccGrid.getBranchCode());
				ccDTO.setBranchLabel(ccGrid.getBranch());
				ccDTOList.add(ccDTO);
			}
			loanDTO.setCreditCardDetails(ccDTOList);
			log.info("Credit Card transformation completed successfully!");
		}
		if (!Objects.isNull(overdraftGridList) && !overdraftGridList.isEmpty()) {
			log.info("Overdraft details transformation starts");
			loanDTO.setLoanType(attributes.getProductType());
			List<OverdraftDTO> odDTOList = new ArrayList<>();
			for (OverdraftGrid odGrid : overdraftGridList) {
				OverdraftDTO odDTO = new OverdraftDTO();
				odDTO.setId(convertToLong(odGrid.getAttributeId()));
				odDTO.setApplicantOrder(odGrid.getMemberId());
				odDTO.setOverdraftRequiredFor(odGrid.getRequiedFor());
				odDTO.setOverdraftPurpose(odGrid.getPurpose());
				odDTO.setOverdraftPurposeLabel(odGrid.getPurposeLabel());
				odDTO.setOtherOverdraftPurpose(odGrid.getOtherPurpose());
				odDTOList.add(odDTO);
			}
			loanDTO.setOverdraftDetails(odDTOList);
			log.info("Overdraft details transformation completed successfully!");
		}
		log.info("Collateral details transformation starts");
		if (Objects.isNull(collGrid)) {
			collGrid = new CollateralDetail();
			collGrid.setHasCollateral("No");
		}
		loanDTO.setCollateralInsertionId(convertToLong(collGrid.getAttributeId()));
		loanDTO.setHasCollateral(collGrid.getHasCollateral());
		loanDTO.setCollateralType(collGrid.getCollateralType());
		loanDTO.setOtherCollateral(collGrid.getOtherCollateralDetails());
		loanDTO.setCollateralValue(collGrid.getCollateralValue());
		loanDTO.setPresentCollateralValue(collGrid.getPresentCollateralValue());
		loanDTO.setPrimaryOwner(collGrid.getPrimaryOwner());
		loanDTO.setCurrency(collGrid.getCurrency());
		loanDTO.setCollateralName(collGrid.getCollateralName());
		log.info("Collateral details transformation completed successfully!");

		applicationDTO.setLoanDetails(loanDTO);

	}

	private void processApplicantsInformation(Attributes attributes, ApplicationDTO applicationDTO) {
		List<ApplicantDetail> applicantGridList = attributes.getApplicantDetails();
		// ---- Saving the attributes received from IBPS ---
		List<ApplicantDTO> applicantDTOList = new ArrayList<>();
		for (ApplicantDetail applicantGrid : applicantGridList) {
			ApplicantDTO applicantDTO = new ApplicantDTO();
			// Process Basic Information of the Applicant
			String memberId = nullCheck(applicantGrid.getMemberId());
			processApplicantDetail(applicantDTO, applicantGrid, applicationDTO);

			// Set the Address Details corresponding to the MemberId
			processApplicantAddress(memberId, applicantDTO, attributes.getAddressDetails(), applicationDTO);

			// Set the basic identification Information corresponding to the
			// MemberId
			processApplicantBasicIdentification(memberId, applicantDTO, attributes.getIdentificationDetails(),
					applicationDTO);

			// Set the employment Details corresponding to the memberId
			processApplicantEmployment(memberId, applicantDTO, attributes.getEmployementDetails(), applicationDTO);

			// Set the Reference Details
			processApplicantReference(applicantDTO, attributes.getReferences(), applicationDTO);

			// Set the financial Details
			processFinancialDetails(memberId, applicantDTO, attributes.getFinancialDetailsGridList(), applicationDTO);

			// Set PEP details
			processApplicantPEPDetails(memberId, applicantDTO, attributes.getPepDetailsGridList());

			// Set Family details
			/*if (applicantDTO.getType().equals("PRIMARY")) {
				processApplicantFamilyDetails(applicantDTO, attributes.getFamilyDetailsGrid(),
						attributes.getChildrenDetailsGrid());
			}*/

			applicantDTOList.add(applicantDTO);
		}
		applicationDTO.setApplicants(applicantDTOList);

	}

	private void processFinancialDetails(String memberId, ApplicantDTO applicantDTO,
			List<FinancialDetailsGrid> finGridList, ApplicationDTO applicationDTO) {
		if (Objects.isNull(finGridList) || (!Objects.isNull(finGridList) && finGridList.isEmpty())) {
			log.error("Financial Details is null for arn {}", applicationDTO.getArn());
			return;
		}
		log.info("Financial Details Transformation Starts for memberId: {}", memberId);
		for (FinancialDetailsGrid finGrid : finGridList) {
			if (memberId.equals(finGrid.getMemberId())) {
				FinancialDetailsDTO finDTO = new FinancialDetailsDTO();
				finDTO.setId(convertToLong(finGrid.getAttributeId()));
				if (!Objects.isNull(finGrid.getIncomeGridList()) && !finGrid.getIncomeGridList().isEmpty()) {
					log.info("Income Details Transformation Starts for memberId: {}", memberId);
					List<IncomeDetailsDTO> incomeDTOList = new ArrayList<>();
					for (IncomeDetailGrid incomeGrid : finGrid.getIncomeGridList()) {
						IncomeDetailsDTO incomeDTO = new IncomeDetailsDTO();
						incomeDTO.setId(convertToLong(incomeGrid.getAttributeId()));
						incomeDTO.setIncomeType(incomeGrid.getIncomeType());
						incomeDTO.setFrequency(incomeGrid.getFrequency());
						incomeDTO.setAmount(convertToDouble(incomeGrid.getAmount()));
						incomeDTO.setMonthlyIncome(convertToDouble(incomeGrid.getMonthlyIncome()));
						incomeDTO.setIncome(convertToDouble(incomeGrid.getAnnualIncome()));
						incomeDTO.setPrimarySourceOfIncome(Boolean.valueOf(incomeGrid.getPrimaryIncome()));
						incomeDTO.setComment(incomeGrid.getRemarks());
						incomeDTOList.add(incomeDTO);
					}
					if (incomeDTOList.isEmpty()) {
						log.error("Income Grid is empty for memberId: {}", memberId);
					} else {
						finDTO.setIncomeDetails(incomeDTOList);
						log.info("Income Details Transformation Successful for memberId: {}", memberId);
					}

				} else {
					log.error("Income Grid is empty for memberId: {}", memberId);
				}
				if (!Objects.isNull(finGrid.getAssetGridList()) && !finGrid.getAssetGridList().isEmpty()) {
					log.info("Asset Details Transformation Starts for memberId: {}", memberId);
					List<AssetDTO> assetDTOList = new ArrayList<>();
					for (AssetDetailGrid assetGrid : finGrid.getAssetGridList()) {
						AssetDTO assetDTO = new AssetDTO();
						assetDTO.setId(convertToLong(assetGrid.getAttributeId()));
						assetDTO.setType(assetGrid.getAssetTypeLabel());
						assetDTO.setAssetCode(assetGrid.getAssetType());
						assetDTO.setInstitutionName(assetGrid.getInstitutionName());
						assetDTO.setAmount(assetGrid.getValueOfAsset());
						assetDTO.setComments(assetGrid.getRemarks());
						assetDTOList.add(assetDTO);
					}
					if (assetDTOList.isEmpty()) {
						log.error("Asset Grid is empty for memberId: {}", memberId);
					} else {
						finDTO.setAssetDetails(assetDTOList);
						log.info("Asset Details Transformation Successful for memberId: {}", memberId);
					}
				}
				applicantDTO.setFinancialDetails(finDTO);
			}
		}
	}

	private void processApplicantReference(ApplicantDTO applicantDTO, List<Reference> refGridList,
			ApplicationDTO applicationDTO) {
		if (Objects.isNull(refGridList) || refGridList.isEmpty()) {
			log.error("Reference Details is null for arn {}", applicationDTO.getArn());
			return;
		}
		log.info("Reference Details Transformation Starts");
		List<ReferenceDTO> refDTOList = new ArrayList<>();
		for (Reference refGrid : refGridList) {
			ReferenceDTO refDTO = new ReferenceDTO();
			refDTO.setId(convertToLong(refGrid.getAttributeId()));
			refDTO.setTitle(refGrid.getTitle());
			refDTO.setFirstName(refGrid.getFirstName());
			refDTO.setMiddleName(refGrid.getMiddleName());
			refDTO.setLastName(refGrid.getLastName());
			refDTO.setEmployer(refGrid.getEmployer());
			refDTO.setRelationship(refGrid.getRelationship());
			refDTO.setPhoneNo(refGrid.getPhoneNo());
			refDTO.setIsMailingAndResidentialAddDifferent(refGrid.getIsMailingAndResidentialAddDifferent());
			List<AddressDTO> addressDTOList = new ArrayList<>();
			AddressDTO currAddress = new AddressDTO();
			currAddress.setType("CURRENT");
			currAddress.setAddressLine1(refGrid.getAddressLine1());
			currAddress.setAddressLine2(refGrid.getAddressLine2());
			currAddress.setCity(refGrid.getCity());
			currAddress.setState(refGrid.getState());
			currAddress.setCountry(refGrid.getCountry());
			currAddress.setPoBoxNo(refGrid.getPoBoxNo());
			addressDTOList.add(currAddress);
			if (!StringUtils.isAllEmpty(refGrid.getMailingAddressLine1(), refGrid.getMailingAddressLine2(),
					refGrid.getMailingCity(), refGrid.getMailingState(), refGrid.getMailingCountry())) {
				AddressDTO mailAddress = new AddressDTO();
				mailAddress.setType("MAILING");
				mailAddress.setAddressLine1(refGrid.getMailingAddressLine1());
				mailAddress.setAddressLine2(refGrid.getMailingAddressLine2());
				mailAddress.setCity(refGrid.getMailingCity());
				mailAddress.setState(refGrid.getMailingState());
				mailAddress.setCountry(refGrid.getMailingCountry());
				mailAddress.setPoBoxNo(refGrid.getPoBoxNoMailing());
				addressDTOList.add(mailAddress);
			}
			refDTO.setAddresses(addressDTOList);
			refDTOList.add(refDTO);
		}
		if (!refDTOList.isEmpty()) {
			applicantDTO.setReferenceDetails(refDTOList);
			log.info("Reference Details Transformation Successful");
		} else {
			log.info("Reference Details Empty");
		}
	}

	private void processApplicantEmployment(String memberId, ApplicantDTO applicantDTO,
			List<EmploymentDetail> employementDetails, ApplicationDTO applicationDTO) {
		if (Objects.isNull(employementDetails) || employementDetails.isEmpty()) {
			log.error("Employment Details is null for arn {}", applicationDTO.getArn());
			return;
		}
		log.info("Employment Details Transformation Starts");
		List<IEmployment> empDTOList = new ArrayList<>();
		for (EmploymentDetail empGrid : employementDetails) {
			if (memberId.equals(empGrid.getMemberId())) {
				// EmploymentDetailsDTO employementDetailsDTO = new
				// EmploymentDetailsDTO();
				// IEmployment empDTO;
				if (EmploymentType.EMP.getShortName().equals(empGrid.getEmpType())) {
					SalariedDTO empDTO = new SalariedDTO();
					empDTO.setId(convertToLong(empGrid.getAttributeId()));
					empDTO.setEmpType(empGrid.getEmpType());
					empDTO.setEmpTypeLabel(empGrid.getEmpTypeLabel());
					SalariedDetailsDTO empDetailsDTO = new SalariedDetailsDTO();
					empDetailsDTO.setCompanyName(empGrid.getCompanyName());
					empDetailsDTO.setSector(empGrid.getSector());
					empDetailsDTO.setJobTitle(empGrid.getJobTitle());
					empDetailsDTO.setJobTitleDescription(empGrid.getJobTitleDescription());
					empDetailsDTO.setYearsEmployed(empGrid.getYearsEmployed());
					empDetailsDTO.setMonthsEmployed(empGrid.getMonthsEmployed());
					empDetailsDTO.setWorkPermitPresent(empGrid.getWorkPermitPresent());
					empDetailsDTO.setWorkPermitNumber(empGrid.getWorkpermitNumber());
					empDetailsDTO.setWorkPermitExpiry(dateCheck(empGrid.getWorkPermitExpiry()));
					empDetailsDTO.setEmpDate(dateCheck(empGrid.getEmpDate()));
					List<AddressDTO> addressDTOList = new ArrayList<>();
					AddressDTO addressDTO = new AddressDTO();
					addressDTO.setType("CURRENT");
					addressDTO.setAddressLine1(empGrid.getEmpApartment());
					addressDTO.setAddressLine2(empGrid.getEmpStreetName());
					addressDTO.setCity(empGrid.getEmpCity());
					addressDTO.setState(empGrid.getEmpIslandState());
					addressDTO.setCountry(empGrid.getEmpCountry());
					addressDTO.setPoBoxNo(empGrid.getEmpPOBoxNo());
					addressDTO.setPhoneNo(empGrid.getEmpPhoneNo());
					addressDTOList.add(addressDTO);
					empDetailsDTO.setAddresses(addressDTOList);

					empDTO.setEmpDetail(empDetailsDTO);
					empDTOList.add(empDTO);
				}
				if (EmploymentType.SEMP.getShortName().equals(empGrid.getEmpType())) {
					SelfEmployedDTO empDTO = new SelfEmployedDTO();
					empDTO.setId(convertToLong(empGrid.getAttributeId()));
					empDTO.setEmpType(empGrid.getEmpType());
					empDTO.setEmpTypeLabel(empGrid.getEmpTypeLabel());
					SelfEmployedDetailsDTO empDetailsDTO = new SelfEmployedDetailsDTO();
					// empDetailsDTO.setBusinessName(empGrid.getBusinessName());
					empDetailsDTO.setBusinessName(empGrid.getCompanyName());
					empDetailsDTO.setBusinessType(empGrid.getBusinessType());
					empDetailsDTO.setJobTitleDescription(empGrid.getJobTitleDescription());
					empDetailsDTO.setBusinessDate(dateCheck(empGrid.getBusinessDate()));
					empDetailsDTO.setYearsBusiness(empGrid.getYearsBusiness());
					empDetailsDTO.setMonthsBusiness(empGrid.getMonthsBusiness());
					List<AddressDTO> addressDTOList = new ArrayList<>();
					AddressDTO addressDTO = new AddressDTO();
					addressDTO.setType("BUSINESS");
					// addressDTO.setAddressLine1(empGrid.getBusinessApartment());
					addressDTO.setAddressLine1(empGrid.getEmpApartment());
					// addressDTO.setAddressLine2(empGrid.getBusinessStreetName());
					addressDTO.setAddressLine2(empGrid.getEmpStreetName());
					// addressDTO.setCity(empGrid.getBusinessCity());
					addressDTO.setCity(empGrid.getEmpCity());
					// addressDTO.setState(empGrid.getBusinessIslandState());
					addressDTO.setState(empGrid.getEmpIslandState());
					// addressDTO.setCountry(empGrid.getBusinessCountry());
					addressDTO.setCountry(empGrid.getEmpCountry());
					// addressDTO.setPoBoxNo(empGrid.getBusinessPOBoxNo());
					addressDTO.setPoBoxNo(empGrid.getEmpPOBoxNo());
					//addressDTO.setPhoneNo(empGrid.getBusinessPhoneNo());
					addressDTO.setPhoneNo(empGrid.getEmpPhoneNo());
					addressDTOList.add(addressDTO);
					empDetailsDTO.setAddresses(addressDTOList);

					empDTO.setEmpDetail(empDetailsDTO);
					empDTOList.add(empDTO);
				}
				if (EmploymentType.RET.getShortName().equals(empGrid.getEmpType())) {
					RetiredDTO empDTO = new RetiredDTO();
					empDTO.setId(convertToLong(empGrid.getAttributeId()));
					empDTO.setEmpType(empGrid.getEmpType());
					empDTO.setEmpTypeLabel(empGrid.getEmpTypeLabel());
					RetiredDetailsDTO empDetailsDTO = new RetiredDetailsDTO();
					//empDetailsDTO.setLastCompanyName(empGrid.getLastCompanyName());
					empDetailsDTO.setLastCompanyName(empGrid.getCompanyName());
					empDetailsDTO.setJobTitle(empGrid.getJobTitle());
					empDetailsDTO.setJobTitleDescription(empGrid.getJobTitleDescription());
					empDetailsDTO.setSector(empGrid.getSector());
					empDetailsDTO.setYearOfRetirement(empGrid.getYearOfRetirement());
					List<AddressDTO> addressDTOList = new ArrayList<>();
					AddressDTO addressDTO = new AddressDTO();
					addressDTO.setType("CURRENT");
					addressDTO.setAddressLine1(empGrid.getEmpApartment());
					addressDTO.setAddressLine2(empGrid.getEmpStreetName());
					addressDTO.setCity(empGrid.getEmpCity());
					addressDTO.setState(empGrid.getEmpIslandState());
					addressDTO.setCountry(empGrid.getEmpCountry());
					addressDTO.setPoBoxNo(empGrid.getEmpPOBoxNo());
					addressDTO.setPhoneNo(empGrid.getEmpPhoneNo());
					addressDTOList.add(addressDTO);
					empDetailsDTO.setAddresses(addressDTOList);

					empDTO.setEmpDetail(empDetailsDTO);
					empDTOList.add(empDTO);
				}
				if (EmploymentType.STU.getShortName().equals(empGrid.getEmpType())) {
					StudentDTO empDTO = new StudentDTO();
					empDTO.setId(convertToLong(empGrid.getAttributeId()));
					empDTO.setEmpType(empGrid.getEmpType());
					empDTO.setEmpTypeLabel(empGrid.getEmpTypeLabel());
					StudentDetailsDTO empDetailsDTO = new StudentDetailsDTO();
					empDetailsDTO.setHighestEducation(empGrid.getHighestEducation());
					//empDetailsDTO.setOrganizationName(empGrid.getOrganizationName());
					empDetailsDTO.setOrganizationName(empGrid.getCompanyName());
					empDetailsDTO.setFundingPerson(empGrid.getFundingPerson());
					empDetailsDTO.setRelationshipWithApplicant(empGrid.getRelationshipWithApplicant());
					empDetailsDTO.setIsFundingPersonAnExistingCustomer(empGrid.getIsFundingPersonAnExistingCustomer());
					
					List<AddressDTO> addressDTOList = new ArrayList<>();
					AddressDTO addressDTO = new AddressDTO();
					addressDTO.setType("CURRENT");
					addressDTO.setAddressLine1(empGrid.getEmpApartment());
					addressDTO.setAddressLine2(empGrid.getEmpStreetName());
					addressDTO.setCity(empGrid.getEmpCity());
					addressDTO.setState(empGrid.getEmpIslandState());
					addressDTO.setCountry(empGrid.getEmpCountry());
					addressDTO.setPoBoxNo(empGrid.getEmpPOBoxNo());
					addressDTO.setPhoneNo(empGrid.getEmpPhoneNo());
					addressDTOList.add(addressDTO);
					empDetailsDTO.setAddresses(addressDTOList);

					empDTO.setEmpDetail(empDetailsDTO);
					empDTOList.add(empDTO);
				}
				if (EmploymentType.NEMP.getShortName().equals(empGrid.getEmpType())) {
					NonEmployedDTO empDTO = new NonEmployedDTO();
					empDTO.setId(convertToLong(empGrid.getAttributeId()));
					empDTO.setEmpType(empGrid.getEmpType());
					empDTO.setEmpTypeLabel(empGrid.getEmpTypeLabel());
					NonEmployedDetailsDTO empDetailsDTO = new NonEmployedDetailsDTO();
					empDetailsDTO.setFundingPerson(empGrid.getFundingPerson());
					empDetailsDTO.setRelationshipWithApplicant(empGrid.getRelationshipWithApplicant());
					empDetailsDTO.setIsFundingPersonAnExistingCustomer(empGrid.getIsFundingPersonAnExistingCustomer());
					empDTO.setEmpDetail(empDetailsDTO);
					empDTOList.add(empDTO);
				}
			}
		}
		if (!empDTOList.isEmpty()) {
			applicantDTO.setEmpDetails(empDTOList);
			log.info("Employment Details Transformation Successful");
		} else {
			log.error("Employment Details Empty");
		}
	}

	private void processApplicantBasicIdentification(String memberId, ApplicantDTO applicantDTO,
			List<IdentificationDetail> identificationDetails, ApplicationDTO applicationDTO) {
		if (Objects.isNull(identificationDetails) || identificationDetails.isEmpty()) {
			log.error("Identification Details is null for arn {}", applicationDTO.getArn());
			return;
		}
		log.info("Basic Details Transformation Starts");
		List<IdDetail> idDTOList = new ArrayList<>();
		for (IdentificationDetail idGrid : identificationDetails) {
			if (memberId.equals(idGrid.getMemberId())) {
				IdDetail idDTO = new IdDetail();
				idDTO.setId(convertToLong(idGrid.getAttributeId()));
				idDTO.setIdType(idGrid.getIdType());
				idDTO.setIdTypeLabel(idGrid.getIdTypeLabel());
				idDTO.setIdNumber(idGrid.getIdNumber());
				idDTO.setIdIssueDate(dateCheck(idGrid.getIdIssueDate()));
				idDTO.setIdExpDate(dateCheck(idGrid.getIdExpDate()));
				idDTO.setIdIssuingCountry(idGrid.getIdIssuingCountry());
				idDTO.setIdIssuingCountryLabel(idGrid.getIdIssuingCountryName());
				idDTOList.add(idDTO);
			}
		}
		applicantDTO.setIdDetails(idDTOList);
		log.info("Basic Details Transformation Successful");
	}

	private void processApplicantAddress(String memberId, ApplicantDTO applicantDTO,
			List<AddressDetail> contactGridList, ApplicationDTO applicationDTO) {
		if (Objects.isNull(contactGridList) || contactGridList.isEmpty()) {
			log.error("Address Details is null for arn {}", applicationDTO.getArn());
			return;
		}
		log.info("Address Details Transformation Starts");

		AddressDetailsDTO addressDetailsDTO = new AddressDetailsDTO();
		for (AddressDetail contactGrid : contactGridList) {
			if (memberId.equals(contactGrid.getMemberId())) {
				addressDetailsDTO.setId(convertToLong(contactGrid.getAttributeId()));
				addressDetailsDTO
						.setIsMailingAndResidentialAddDifferent(contactGrid.getIsMailAddSameAsRes() ? "YES" : "NO");
				addressDetailsDTO.setAmtOfRent(contactGrid.getMonthlyRent());
				addressDetailsDTO.setMortgageOwnersFullName(contactGrid.getMortgageOwnerName());
				addressDetailsDTO.setMortgageOwnerPhoneNumber(contactGrid.getMortgageOwnerPhoneNo());
				addressDetailsDTO.setRelationshipWithMortgageOwner(contactGrid.getRelationwithMortgageOwner());
				List<AddressDTO> addressDTOList = new ArrayList<>();
				AddressDTO address = new AddressDTO();
				address.setType("CURRENT");
				address.setAddressLine2(contactGrid.getApartment());
				address.setAddressLine1(contactGrid.getStreetAddress());
				address.setCity(contactGrid.getCity());
				address.setState(contactGrid.getState());
				address.setCountry(contactGrid.getCountry());
				address.setCountryLabel(contactGrid.getCountryLabel());
				address.setPoBoxNo(contactGrid.getPOBoxNo());
				address.setOwnOrRent(contactGrid.getOwnOrRent());
				address.setDateMovedIn(dateCheck(contactGrid.getDateMovedIn()));
				address.setYears(contactGrid.getYears());
				address.setMonths(contactGrid.getMonths());
				address.setDrivingDetailsToCurrentAddress(contactGrid.getDrivingDetailsToCurrentAddress());
				addressDTOList.add(address);
				if (!StringUtils.isAllEmpty(contactGrid.getMailingApartment(), contactGrid.getMailingStreetAddress(),
						contactGrid.getMailingCity(), contactGrid.getMailingState(), contactGrid.getMailingCountry())) {
					AddressDTO mailAddress = new AddressDTO();
					mailAddress.setType("MAILING");
					mailAddress.setAddressLine2(contactGrid.getMailingApartment());
					mailAddress.setAddressLine1(contactGrid.getMailingStreetAddress());
					mailAddress.setCity(contactGrid.getMailingCity());
					mailAddress.setState(contactGrid.getMailingState());
					mailAddress.setCountry(contactGrid.getMailingCountry());
					mailAddress.setPoBoxNo(contactGrid.getMailingPOBoxNo());
					addressDTOList.add(mailAddress);
				}
				if (!StringUtils.isAllEmpty(contactGrid.getPreviousApartment(), contactGrid.getPreviousStreetAddress(),
						contactGrid.getPreviousCity(), contactGrid.getPreviousState(),
						contactGrid.getPreviousCountry())) {
					AddressDTO prevAddress = new AddressDTO();
					prevAddress.setType("PREVIOUS");
					prevAddress.setAddressLine2(contactGrid.getPreviousApartment());
					prevAddress.setAddressLine1(contactGrid.getPreviousStreetAddress());
					prevAddress.setCity(contactGrid.getPreviousCity());
					prevAddress.setState(contactGrid.getPreviousState());
					prevAddress.setCountry(contactGrid.getPreviousCountry());
					prevAddress.setPoBoxNo(contactGrid.getPreviousPOBoxNo());
					addressDTOList.add(prevAddress);
				}
				addressDetailsDTO.setAddresses(addressDTOList);
				applicantDTO.setAddressDetails(addressDetailsDTO);
				log.info("Address Details Transformation Successful");
			}
		}
	}

	private void processApplicantDetail(ApplicantDTO applicantDTO, ApplicantDetail applicantGrid,
			ApplicationDTO applicationDTO) {
		if (Objects.isNull(applicantGrid)) {
			log.error("Applicant Details is null for arn {}", applicationDTO.getArn());
			return;
		}
		log.info("Applicant Details Transformation Starts");
		applicantDTO.setId(convertToLong(applicantGrid.getAttributeId()));
		applicantDTO.setOrder(convertToLong(applicantGrid.getMemberId()));
		applicantDTO.setExistingCustomer(applicantGrid.getExistingCustomer());
		applicantDTO.setFirstName(nullCheck(applicantGrid.getFirstName()));
		applicantDTO.setMiddleName(nullCheck(applicantGrid.getMiddleName()));
		applicantDTO.setLastName(nullCheck(applicantGrid.getLastName()));
		applicantDTO.setType(nullCheck(applicantGrid.getMemberType()));
		applicantDTO.setPrefix(nullCheck(applicantGrid.getPrefix()));
		applicantDTO.setSuffix(nullCheck(applicantGrid.getSuffix()));
		applicantDTO.setMaidenName(nullCheck(applicantGrid.getMaidenName()));
		applicantDTO.setMotherMaidenName(nullCheck(applicantGrid.getMotherMaidenName()));
		applicantDTO.setEmail(nullCheck(applicantGrid.getEmailAddress()));
		applicantDTO.setConfirmEmail(nullCheck(applicantGrid.getConfirmEmailAddress()));
		applicantDTO.setGender(nullCheck(applicantGrid.getGender()));
		applicantDTO.setDob(dateCheck(applicantGrid.getDob()));
		applicantDTO.setMaritalStatus(nullCheck(applicantGrid.getMaritalStatus()));
		applicantDTO.setCellPhoneNo(nullCheck(applicantGrid.getCellPhone()));
		applicantDTO.setHomePhoneNo(nullCheck(applicantGrid.getHomePhone()));
		applicantDTO.setWorkPhoneNo(nullCheck(applicantGrid.getWorkPhone()));
		applicantDTO.setCitizenship(nullCheck(applicantGrid.getCitizenship()));
		applicantDTO.setPlaceOfBirth(nullCheck(applicantGrid.getPlaceOfBirth()));
		applicantDTO.setNoOfDependent(nullCheck(applicantGrid.getNoOfDependent()));
		applicantDTO.setSsn(nullCheck(applicantGrid.getSsn()));
		applicantDTO.setIsBankEmployee(applicantGrid.getIsBankEmployee());
		applicantDTO.setIsGovernmentEmployee(applicantGrid.getIsGovernmentEmployee());
		applicantDTO.setRelation(applicantGrid.getRelationToPrimary());
		
		applicantDTO.setAge(StringUtils.isNotEmpty(applicantGrid.getAge()) ? Integer.parseInt(applicantGrid.getAge()) : 0);
		applicantDTO.setHowLongInYears(applicantGrid.getHowLongInYears());
		applicantDTO.setTinNumber(applicantGrid.getTin());
		applicantDTO.setLifeInsuranceRequired(applicantGrid.getLifeInsuranceRequired());
		applicantDTO.setLifeInsuranceAlreadyPresent(applicantGrid.getLifeInsuranceAlreadyPresent());
		applicantDTO.setLifeInsuranceProviderName(applicantGrid.getLifeInsuranceProviderName());
		/*
		 * applicantDTO.setPep(nullCheck(applicantDetail.getPep()));
		 * applicantDTO.setPepType(nullCheck(applicantDetail.getPepType()));
		 * applicantDTO.setNationality(nullCheck(applicantDetail.getNationality(
		 * ))); applicantDTO.setCountryOfBirth(nullCheck(applicantDetail.
		 * getCountryOfBirth()));
		 */
		log.info("Applicant Details Transformation Successful");
	}

	private void processApplicantPEPDetails(String memberId, ApplicantDTO applicantDTO,
			List<PEPDetailsGrid> pepGridList) {
		if (Objects.isNull(pepGridList) || pepGridList.isEmpty()) {
			log.info("PEP details grid is empty");
			return;
		}
		log.info("PEP Details transformation starts for memberId: {}", memberId);
		PEPDetailsDTO pepDTO = new PEPDetailsDTO();
		for (PEPDetailsGrid pepGrid : pepGridList) {
			if (memberId.equals(pepGrid.getMemberId())) {
				pepDTO.setId(convertToLong(pepGrid.getAttributeId()));
				pepDTO.setPepFlag(pepGrid.getCurrentlyPep());
				pepDTO.setPreviousPep(pepGrid.getPreviouslyPep());
				pepDTO.setPepRelation(pepGrid.getRelationToPep());
				pepDTO.setPepFirstName(pepGrid.getPepFirstName());
				pepDTO.setPepMiddleName(pepGrid.getPepMiddleName());
				pepDTO.setPepLastName(pepGrid.getPepLastName());
				pepDTO.setPepLastName(pepGrid.getPepLastName());
				pepDTO.setPepSuffix(pepGrid.getPepSuffix());
				pepDTO.setPepCountry(pepGrid.getPepCountry());
				pepDTO.setPositionTitle(pepGrid.getPositionTitle());
				pepDTO.setDetailsOfPositonHeld(pepGrid.getDetailsOfPositonHeld());
				pepDTO.setDateAddedToPepList(dateCheck(pepGrid.getDateAddedToPepList()));
				pepDTO.setYearsInPosition(pepGrid.getYearsInPosition());
				pepDTO.setDateRemovedFromPep(dateCheck(pepGrid.getDateRemovedFromPep()));
				List<PEPRelationDTO> pepRelDTOList = new ArrayList<>();
				if (!Objects.isNull(pepGrid.getRelationGrid())) {
					for (PEPRelationGrid pepRelGrid : pepGrid.getRelationGrid()) {
						PEPRelationDTO pepRelDTO = new PEPRelationDTO();
						pepRelDTO.setId(convertToLong(pepRelGrid.getAttributeId()));
						pepRelDTO.setFirstName(pepRelGrid.getFirstName());
						pepRelDTO.setMiddleName(pepRelGrid.getMiddleName());
						pepRelDTO.setLastName(pepRelGrid.getLastName());
						pepRelDTO.setRelationship(pepRelGrid.getRelationship());
						pepRelDTO.setDob(dateCheck(pepRelGrid.getDob()));
						pepRelDTOList.add(pepRelDTO);
					}
				}
				if (pepRelDTOList.isEmpty()) {
					PEPRelationDTO pepRelDTO = new PEPRelationDTO();
					pepRelDTO.setId(null);
					pepRelDTO.setFirstName(null);
					pepRelDTO.setMiddleName(null);
					pepRelDTO.setLastName(null);
					pepRelDTO.setRelationship(null);
					pepRelDTO.setDob(null);
					pepRelDTOList.add(pepRelDTO);
				}
				pepDTO.setRelationshipDetails(pepRelDTOList);
			}
		}
		if (Objects.isNull(pepDTO)) {
			log.info("PEP details is empty for memberId: {}", memberId);
		} else {
			applicantDTO.setPoliticallyExposedPersonDetails(pepDTO);
			log.info("PEP Details transformation completed successfully for memberId: {}", memberId);
		}
	}

	/*private void processApplicantFamilyDetails(ApplicantDTO applicantDTO, FamilyDetailsGrid familyDetailsGrid,
			List<ChildrenDetailsGrid> childrenGridList) {
		if (Objects.isNull(familyDetailsGrid)) {
			log.info("Family Details Grid is empty");
			return;
		}
		log.info("Family Details transformation starts");
		FamilyDetailsDTO familyDTO = new FamilyDetailsDTO();
		familyDTO.setId(convertToLong(familyDetailsGrid.getAttributeId()));
		//familyDTO.setNoOfDependent(familyDetailsGrid.getNoOfDependent());
		familyDTO.setFatherName(familyDetailsGrid.getFatherName());
		familyDTO.setEmployerName(familyDetailsGrid.getFatherEmployerName());
		familyDTO.setResidentialAddress(familyDetailsGrid.getFatherAddress());
		familyDTO.setTelephoneNumber(familyDetailsGrid.getFatherTelephoneNo());
		familyDTO.setMobilePhoneNumber(familyDetailsGrid.getFatherMobileNo());
		familyDTO.setMotherName(familyDetailsGrid.getMotherName());
		familyDTO.setMotherEmployerName(familyDetailsGrid.getMotherEmployerName());
		familyDTO.setMotherResidentialAddress(familyDetailsGrid.getMotherAddress());
		familyDTO.setMotherTelephoneNumber(familyDetailsGrid.getMotherTelephoneNo());
		familyDTO.setMotherMobilePhoneNumber(familyDetailsGrid.getMotherMobileNo());
		List<ChildDetailsDTO> childDTOList = new ArrayList<>();
		if (!Objects.isNull(childrenGridList)) {
			for (ChildrenDetailsGrid childrenGrid : childrenGridList) {
				ChildDetailsDTO childDTO = new ChildDetailsDTO();
				childDTO.setId(convertToLong(childrenGrid.getAttributeId()));
				childDTO.setName(childrenGrid.getName());
				childDTO.setRelationship(childrenGrid.getRelationship());
				childDTO.setEmployerName(childrenGrid.getEmployerName());
				childDTO.setAddress(childrenGrid.getAddress());
				childDTO.setTelephoneNumber(childrenGrid.getTelephoneNo());
				childDTO.setMobilePhoneNumber(childrenGrid.getMobileNo());
				childDTOList.add(childDTO);
			}
		}
		if (childDTOList.isEmpty()) {
			ChildDetailsDTO childDTO = new ChildDetailsDTO();
			childDTO.setId(null);
			childDTO.setName(null);
			childDTO.setRelationship(null);
			childDTO.setEmployerName(null);
			childDTO.setAddress(null);
			childDTO.setTelephoneNumber(null);
			childDTO.setMobilePhoneNumber(null);
			childDTOList.add(childDTO);
		}
		familyDTO.setChildrenDetails(childDTOList);
		applicantDTO.setFamilyDetails(familyDTO);
		log.info("Family Details transformation completed successfully");
	}*/

	private void processDocumentsDetails(ApplicationDTO applicationDTO, List<DocumentDetailsGrid> docGridList) {
		if (Objects.isNull(docGridList) || docGridList.isEmpty()) {
			log.info("Documents grid is empty for WI#: {}", applicationDTO.getArn());
			return;
		}
		log.info("Document details transformation starts");
		List<DocumentDetailsDTO> docDTOList = new ArrayList<>();
		for (DocumentDetailsGrid docGrid : docGridList) {
			if (StringUtils.isNotBlank(docGrid.getDocIndex())) {
				DocumentDetailsDTO docDTO = new DocumentDetailsDTO();
				docDTO.setId(convertToLong(docGrid.getAttributeId()));
				docDTO.setApplicantId(convertToLong(docGrid.getApplicantId()));
				docDTO.setApplicantType(docGrid.getApplicantType());
				docDTO.setDocumentType(docGrid.getDocumentName());
				docDTO.setDocIndex(docGrid.getDocIndex());
				docDTO.setUploadDate(docGrid.getUploadDate());
				docDTOList.add(docDTO);				
			}
		}
		applicationDTO.setDocuments(docDTOList);
		log.info("Document details transformation completed successfully!");
	}

	private String nullCheck(String value) {
		return value == null ? "" : value.trim();
	}

	private String dateCheck(String value) {
		if (value != null && !value.equals(StringUtils.EMPTY)) {
			value = value.replace("00:00:00.0", "").trim();
		}
		return StringUtils.EMPTY.equals(value) ? null : value;
	}

	private Long convertToLong(String value) {
		return StringUtils.isEmpty(nullCheck(value)) ? 0L : Long.parseLong(value);
	}

	private Double convertToDouble(String value) {
		return StringUtils.isEmpty(nullCheck(value)) ? 0L : Double.parseDouble(value);
	}
}
