import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, empty } from 'rxjs';
import { map } from "rxjs/operators";
import { DOMHelperService } from '../../shared';

import { JourneyService } from '../_root/journey.service';


@Injectable()
export class CoapplicantDetailsService {
    alertObj: {};
    constructor(private journeyService: JourneyService, private http: HttpClient, private _dom: DOMHelperService) { }

    dtoToModel() {
        var tabDataList: any = {};
        var coApplicants: any = [];
        var applicantObj = this.journeyService.getFromStorage();
        if (applicantObj && applicantObj.applicants) {
            var applicants = applicantObj.applicants.filter(x => x.type == "CO_APPLICANT");
            for (let applicant of applicants) {
                if (applicant) {

                    var dobTemp = applicant.dob ? applicant.dob.split('-') : '';
                    applicant.dob = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);


                    tabDataList = {

                        basicDetails: {
                            'existingCustomer': applicant.existingCustomer === "Yes" ? true : false,
                            'tinNumber': applicant.tinNumber,
                            'citizenship': applicant.citizenship ? applicant.citizenship : null,
                            'placeOfBirth': applicant.placeOfBirth,
                            'loanRelationship': applicant.loanRelationship,
                            'relation': applicant.relation,
                            'haveLicense': applicant.haveLicense,
                            'prefix': applicant.prefix,
                            'firstName': applicant.firstName,
                            'middleName': applicant.middleName,
                            'lastName': applicant.lastName,
                            'suffix': applicant.suffix,
                            'dob': applicant.dob,
                            'age': applicant.age,
                            'email': applicant.email,
                            'confirmEmail': applicant.confirmEmail,
                            'gender': applicant.gender,
                            'maritalStatus': applicant.maritalStatus,
                            'maidenName': applicant.maidenName,
                            'motherMaidenName': applicant.motherMaidenName,
                            // 'ssn': applicant.ssn ? applicant.ssn : null,
                            'ssn': applicant.ssn,
                            'id': applicant.id,
                            'isAlreadyExist': applicant.isAlreadyExist,
                            // 'isBankEmployee': applicant.isBankEmployee,
                            'isGovernmentEmployee': applicant.isGovernmentEmployee,
                            'noOfDependent': applicant.noOfDependent,
                            // 'lifeInsuranceRequired': applicant.lifeInsuranceRequired,
                            // 'lifeInsuranceProviderName': applicant.lifeInsuranceProviderName,
                            // 'lifeInsuranceAlreadyPresent': applicant.lifeInsuranceAlreadyPresent,
                            'cellPhoneNo': applicant.cellPhoneNo,
                            'homePhoneNo': applicant.homePhoneNo,
                            'workPhoneNo': applicant.workPhoneNo
                        }
                    }

                    if (applicant && applicant.idDetails) {
                        tabDataList.basicDetails.idDetails = applicant.idDetails.map((idDetails) => {

                            if (idDetails && idDetails.idIssueDate) {
                                const tempIssueDate = idDetails.idIssueDate ? idDetails.idIssueDate.split('-') : '';
                                idDetails.idIssueDate = new Date(tempIssueDate[0], tempIssueDate[1] - 1, tempIssueDate[2]);
                            }

                            const tempExpiryDate = idDetails.idExpDate ? idDetails.idExpDate.split('-') : '';
                            idDetails.idExpDate = new Date(tempExpiryDate[0], tempExpiryDate[1] - 1, tempExpiryDate[2]);

                            return {
                                'id': idDetails.id ? idDetails.id : null,
                                'idType': idDetails.idType ? idDetails.idType : null,
                                'idTypeLabel': idDetails.idTypeLabel ? idDetails.idTypeLabel : null,
                                'idNumber': idDetails.idNumber ? idDetails.idNumber : null,
                                'idIssuingCountry': idDetails.idIssuingCountry ? idDetails.idIssuingCountry : null,
                                'idIssueDate': idDetails.idIssueDate ? idDetails.idIssueDate : null,
                                'idExpDate': idDetails.idExpDate ? idDetails.idExpDate : null,
                            }
                        });
                    }

                    if (applicant.addressDetails) {
                        let addressDetails: any = {};
                        addressDetails.id = applicant.addressDetails.id ? applicant.addressDetails.id : null;
                        addressDetails.isMailingAndResidentialAddDifferent = applicant.addressDetails.isMailingAndResidentialAddDifferent ? applicant.addressDetails.isMailingAndResidentialAddDifferent : false;
                        addressDetails.ownOrRent = applicant.addressDetails.ownOrRent;
                        addressDetails.amtOfRent = applicant.addressDetails.amtOfRent;
                        addressDetails.relationshipWithMortgageOwner = applicant.addressDetails.relationshipWithMortgageOwner;
                        addressDetails.mortgageOwnersFullName = applicant.addressDetails.mortgageOwnersFullName;
                        addressDetails.mortgageOwnerPhoneNumber = applicant.addressDetails.mortgageOwnerPhoneNumber;
                        addressDetails.isAddressSameAsPrimary = applicant.addressDetails.isAddressSameAsPrimary;
                        // addressDetails.homePhoneNo = applicant.addressDetails.homePhoneNo;
                        // addressDetails.mobileNo = applicant.addressDetails.mobileNo;
                        // addressDetails.workPhoneNo = applicant.addressDetails.workPhoneNo;
                        addressDetails.drivingDetailsToCurrentAddress = applicant.drivingDetailsToCurrentAddress;
                        var currentAddress = applicant.addressDetails.addresses.find(address => address.type == 'CURRENT');
                        var mailingAddress = applicant.addressDetails.addresses.find(address => address.type == 'MAILING');
                        var previousAddress = applicant.addressDetails.addresses.find(address => address.type == 'PREVIOUS');

                        if (currentAddress) {
                            var dateMovedInTemp = currentAddress.dateMovedIn ? currentAddress.dateMovedIn.split('-') : '';
                            currentAddress.dateMovedIn = new Date(dateMovedInTemp[0], dateMovedInTemp[1] - 1, dateMovedInTemp[2]);
                            addressDetails.currentAddress = Object.assign({}, currentAddress);
                        }
                        if (mailingAddress && addressDetails.isMailingAndResidentialAddDifferent === 'NO') {
                            addressDetails.mailingAddress = Object.assign({}, mailingAddress);
                        }
                        if (previousAddress && parseInt(currentAddress.years) < 3) {
                            addressDetails.previousAddress = Object.assign({}, previousAddress);
                        }
                        tabDataList.addressDetails = addressDetails;
                    }

                    if (applicant.empDetails) {
                        let employmentDetails = [];
                        applicant.empDetails.forEach(employment => {
                            let emp: any = {};
                            switch (employment.empType) {
                                case "EMP001":
                                case "EMP002":

                                    var workPermitExpiryTemp = employment.empDetail.workPermitExpiry ? employment.empDetail.workPermitExpiry.split('-') : '';
                                    employment.empDetail.workPermitExpiry = new Date(workPermitExpiryTemp[0], workPermitExpiryTemp[1] - 1, workPermitExpiryTemp[2]);

                                    var empDateTemp = employment.empDetail.empDate ? employment.empDetail.empDate.split('-') : '';
                                    employment.empDetail.empDate = new Date(empDateTemp[0], empDateTemp[1] - 1, empDateTemp[2]);

                                    emp = {
                                        empEmployed: {
                                            companyName: employment.empDetail.companyName,
                                            sector: employment.empDetail.sector ? employment.empDetail.sector : null,
                                            jobTitleDescription: employment.empDetail.jobTitleDescription ? employment.empDetail.jobTitleDescription : null,
                                            jobTitle: employment.empDetail.jobTitle,
                                            workPermitPresent: employment.empDetail.workPermitPresent,
                                            workPermitNumber: employment.empDetail.workPermitNumber,
                                            workPermitExpiry: employment.empDetail.workPermitExpiry,
                                            empDate: employment.empDetail.empDate,
                                            yearsEmployed: (employment.empDetail.yearsEmployed ? employment.empDetail.yearsEmployed.toString() : null),
                                            monthsEmployed: (employment.empDetail.monthsEmployed ? employment.empDetail.monthsEmployed.toString() : null),
                                        }
                                    }
                                    break;
                                case "SEMP001":
                                case "SEMP002":
                                case "SEMP003":

                                    var businessDateTemp = employment.empDetail.businessDate ? employment.empDetail.businessDate.split('-') : '';
                                    employment.empDetail.businessDate = new Date(businessDateTemp[0], businessDateTemp[1] - 1, businessDateTemp[2]);


                                    emp = {
                                        empSelf: {
                                            businessName: employment.empDetail.businessName,
                                            jobTitleDescription: employment.empDetail.jobTitleDescription,
                                            businessDate: employment.empDetail.businessDate,
                                            // businessType: employment.empDetail.businessType,
                                            yearsBusiness: (employment.empDetail.yearsBusiness ? employment.empDetail.yearsBusiness.toString() : null),
                                            monthsBusiness: (employment.empDetail.monthsBusiness ? employment.empDetail.monthsBusiness.toString() : null)
                                        }
                                    }
                                    break;
                                case "RT001":
                                    emp = {
                                        empRetired: {
                                            lastCompanyName: employment.empDetail.lastCompanyName,
                                            sector: employment.empDetail.sector ? employment.empDetail.sector : null,
                                            jobTitle: employment.empDetail.jobTitle,
                                            jobTitleDescription: employment.empDetail.jobTitleDescription,
                                            yearOfRetirement: (employment.empDetail.yearOfRetirement ? employment.empDetail.yearOfRetirement.toString() : null)

                                        }
                                    }
                                    break;
                                case "STU001":
                                    emp = {
                                        empStudent: {
                                            organizationName: employment.empDetail.organizationName ? employment.empDetail.organizationName : null,
                                            highestEducation: employment.empDetail.highestEducation ? employment.empDetail.highestEducation : null,
                                            fundingPerson: employment.empDetail.fundingPerson ? employment.empDetail.fundingPerson : null,
                                            relationshipWithApplicant: employment.empDetail.relationshipWithApplicant ? employment.empDetail.relationshipWithApplicant : null,
                                            isFundingPersonAnExistingCustomer: employment.empDetail.isFundingPersonAnExistingCustomer ? employment.empDetail.isFundingPersonAnExistingCustomer : null,
                                        }
                                    }
                                    break;
                                case "NEMP001":
                                    emp = {
                                        nonEmp: {
                                            fundingPerson: employment.empDetail.fundingPerson ? employment.empDetail.fundingPerson : null,
                                            relationshipWithApplicant: employment.empDetail.relationshipWithApplicant ? employment.empDetail.relationshipWithApplicant : null,
                                            isFundingPersonAnExistingCustomer: employment.empDetail.isFundingPersonAnExistingCustomer ? employment.empDetail.isFundingPersonAnExistingCustomer : null,
                                        }
                                    }
                                    break;
                            }

                            if (employment.empType === 'EMP001' || employment.empType === 'EMP002' || employment.empType === 'RT001' || employment.empType === 'STU001') {
                                var addressDetails: any = {};

                                const currentAddress = employment.empDetail.addresses.find(address => address.type == 'CURRENT');
                                if (currentAddress) {
                                    addressDetails.currentAddress = Object.assign({}, currentAddress);
                                }

                                if (employment.empType === 'EMP001' || employment.empType === 'EMP002') {
                                    emp.empEmployed = {
                                        ...emp.empEmployed, ...addressDetails
                                    }
                                } else if (employment.empType === 'RT001') {
                                    emp.empRetired = {
                                        ...emp.empRetired, ...addressDetails
                                    }
                                } else if (employment.empType === 'STU001') {
                                    emp.empStudent = {
                                        ...emp.empStudent, ...addressDetails
                                    }
                                }
                            }

                            if (employment.empType === 'SEMP001' || employment.empType === 'SEMP002' || employment.empType === 'SEMP003') {
                                var addressDetails: any = {};

                                const businessAddress = employment.empDetail.addresses.find(address => address.type == 'BUSINESS');

                                if (businessAddress) {
                                    addressDetails.businessAddress = Object.assign({}, businessAddress);
                                }

                                emp.empSelf = {
                                    ...emp.empSelf, ...addressDetails
                                }
                            }

                            let empObject = {
                                empType: employment.empType,
                                id: employment.id
                            }
                            employmentDetails.push({ ...empObject, ...emp });
                        });
                        tabDataList.empDetails = employmentDetails;
                    }

                    if (applicant.politicallyExposedPersonDetails) {
                        let pepDetails: any = {};

                        var dateRemovedFromPepTemp = applicant.politicallyExposedPersonDetails.dateRemovedFromPep ? applicant.politicallyExposedPersonDetails.dateRemovedFromPep.split('-') : '';
                        var dateAddedToPepListTemp = applicant.politicallyExposedPersonDetails.dateAddedToPepList ? applicant.politicallyExposedPersonDetails.dateAddedToPepList.split('-') : '';

                        if (dateRemovedFromPepTemp) {
                            applicant.politicallyExposedPersonDetails.dateRemovedFromPep = new Date(dateRemovedFromPepTemp[0], dateRemovedFromPepTemp[1] - 1, dateRemovedFromPepTemp[2]);
                        }

                        if (dateAddedToPepListTemp) {
                            applicant.politicallyExposedPersonDetails.dateAddedToPepList = new Date(dateAddedToPepListTemp[0], dateAddedToPepListTemp[1] - 1, dateAddedToPepListTemp[2]);
                        }


                        pepDetails.id = applicant.politicallyExposedPersonDetails.id ? applicant.politicallyExposedPersonDetails.id : null;
                        pepDetails.positionTitle = applicant.politicallyExposedPersonDetails.positionTitle ? applicant.politicallyExposedPersonDetails.positionTitle : null;
                        pepDetails.dateRemovedFromPep = applicant.politicallyExposedPersonDetails.dateRemovedFromPep;
                        pepDetails.dateAddedToPepList = applicant.politicallyExposedPersonDetails.dateAddedToPepList;
                        pepDetails.yearsInPosition = applicant.politicallyExposedPersonDetails.yearsInPosition;
                        // pepDetails.detailsOfPositonHeld = applicant.politicallyExposedPersonDetails.detailsOfPositonHeld ? applicant.politicallyExposedPersonDetails.detailsOfPositonHeld : null;
                        pepDetails.pepCountry = applicant.politicallyExposedPersonDetails.pepCountry ? applicant.politicallyExposedPersonDetails.pepCountry : null;
                        pepDetails.pepFirstName = applicant.politicallyExposedPersonDetails.pepFirstName ? applicant.politicallyExposedPersonDetails.pepFirstName : null;
                        pepDetails.pepFlag = applicant.politicallyExposedPersonDetails.pepFlag ? applicant.politicallyExposedPersonDetails.pepFlag : null;
                        pepDetails.pepLastName = applicant.politicallyExposedPersonDetails.pepLastName ? applicant.politicallyExposedPersonDetails.pepLastName : null;
                        pepDetails.pepMiddleName = applicant.politicallyExposedPersonDetails.pepMiddleName ? applicant.politicallyExposedPersonDetails.pepMiddleName : null;
                        pepDetails.pepRelation = applicant.politicallyExposedPersonDetails.pepRelation ? applicant.politicallyExposedPersonDetails.pepRelation : null;
                        pepDetails.pepSuffix = applicant.politicallyExposedPersonDetails.pepSuffix ? applicant.politicallyExposedPersonDetails.pepSuffix : null;
                        pepDetails.previousPep = applicant.politicallyExposedPersonDetails.previousPep ? applicant.politicallyExposedPersonDetails.previousPep : null;

                        pepDetails.relationshipDetails = [];

                        if (applicant.politicallyExposedPersonDetails.relationshipDetails && applicant.politicallyExposedPersonDetails.relationshipDetails.length > 0) {
                            applicant.politicallyExposedPersonDetails.relationshipDetails = applicant.politicallyExposedPersonDetails.relationshipDetails.map((relationDetails) => {

                                if (relationDetails.dob) {
                                    var dobTemp = relationDetails.dob ? relationDetails.dob.split('-') : '';
                                    relationDetails.dob = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);
                                }


                                return {
                                    'id': relationDetails.id ? relationDetails.id : null,
                                    'firstName': relationDetails.firstName ? relationDetails.firstName : null,
                                    'middleName': relationDetails.middleName ? relationDetails.middleName : null,
                                    'lastName': relationDetails.lastName ? relationDetails.lastName : null,
                                    'relationship': relationDetails.relationship ? relationDetails.relationship : null,
                                    'dob': relationDetails.dob ? relationDetails.dob : null
                                }
                            });
                            pepDetails.relationshipDetails = applicant.politicallyExposedPersonDetails.relationshipDetails;
                        }
                        tabDataList.politicallyExposedPersonDetails = pepDetails;

                    }

                    if (applicant.financialDetails && applicant.financialDetails.incomeDetails) {

                        let financialDetails: any = {};
                        financialDetails.id = applicant.financialDetails.id ? applicant.financialDetails.id : null;
                        financialDetails.incomeDetails = [];

                        financialDetails.incomeDetails = applicant.financialDetails.incomeDetails.map((incomeDetail, index) => {
                            return {
                                'id': incomeDetail.id ? incomeDetail.id : null,
                                'incomeType': incomeDetail.incomeType ? incomeDetail.incomeType : null,
                                'amount': incomeDetail.amount,
                                'frequency': incomeDetail.frequency ? incomeDetail.frequency : null,
                                'income': incomeDetail.income,
                                'comment': incomeDetail.comment ? incomeDetail.comment : null,
                                'primarySourceOfIncome': incomeDetail.primarySourceOfIncome ? incomeDetail.primarySourceOfIncome : false
                            }
                        });
                        tabDataList.incomeDetails = financialDetails;
                    }

                    // if (applicant.assetDetails) {
                    //     tabDataList.assetDetails = applicant.assetDetails.map((assetDetail, index) => {
                    //         return {
                    //             'assetType': assetDetail.type ? assetDetail.type : null,
                    //             'amount': assetDetail.amount ? assetDetail.amount : null,
                    //             'instName': assetDetail.instName ? assetDetail.instName : null,
                    //             'comment': assetDetail.comment ? assetDetail.comment : null
                    //         }
                    //     });
                    // }

                    coApplicants.push(tabDataList);
                }

            };

        }
        return coApplicants;
    }

    modelToDTO(model, applicant, order) {

        if (model.basicDetails) {
            applicant.existingCustomer = model.basicDetails.existingCustomer ? "Yes" : "No";
            applicant.citizenship = model.basicDetails.citizenship,
                applicant.tinNumber = model.basicDetails.tinNumber,
                applicant.placeOfBirth = model.basicDetails.placeOfBirth,
                applicant.prefix = model.basicDetails.prefix,
                applicant.loanRelationship = model.basicDetails.loanRelationship,
                applicant.relation = model.basicDetails.relation,
                applicant.suffix = model.basicDetails.suffix,
                applicant.firstName = model.basicDetails.firstName,
                applicant.middleName = model.basicDetails.middleName,
                applicant.lastName = model.basicDetails.lastName,
                applicant.email = model.basicDetails.email,
                applicant.confirmEmail = model.basicDetails.confirmEmail,
                applicant.gender = model.basicDetails.gender,
                applicant.age = model.basicDetails.age,
                applicant.dob = (model.basicDetails.dob && !isNaN(model.basicDetails.dob)) ? model.basicDetails.dob.getFullYear() + '-' + this.formatDate(model.basicDetails.dob.getMonth() + 1) + '-' + this.formatDate(model.basicDetails.dob.getDate()) : null,
                applicant.ssn = model.basicDetails.ssn,
                applicant.maritalStatus = model.basicDetails.maritalStatus,
                applicant.maidenName = model.basicDetails.maidenName,
                applicant.motherMaidenName = model.basicDetails.motherMaidenName,
                applicant.type = applicant.type,
                applicant.id = model.basicDetails.id,
                applicant.isAlreadyExist = model.basicDetails.isAlreadyExist,
                // applicant.isBankEmployee = model.basicDetails.isBankEmployee,
                applicant.isGovernmentEmployee = model.basicDetails.isGovernmentEmployee,
                applicant.noOfDependent = model.basicDetails.noOfDependent,
                // applicant.lifeInsuranceRequired = model.basicDetails.lifeInsuranceRequired,
                // applicant.lifeInsuranceAlreadyPresent = model.basicDetails.lifeInsuranceAlreadyPresent,
                // applicant.lifeInsuranceProviderName = model.basicDetails.lifeInsuranceProviderName,
                applicant.cellPhoneNo = model.basicDetails.cellPhoneNo,
                applicant.homePhoneNo = model.basicDetails.homePhoneNo,
                applicant.workPhoneNo = model.basicDetails.workPhoneNo
        }

        if (model.basicDetails && model.basicDetails.idDetails) {
            applicant.idDetails = model.basicDetails.idDetails.map((idDetails) => {
                return {
                    'id': idDetails.id ? idDetails.id : null,
                    'idType': idDetails.idType ? idDetails.idType : null,
                    'idTypeLabel': idDetails.idType ? this.journeyService.getLabelFromCode(this.journeyService.getIDType(), idDetails.idType) : null,
                    'idNumber': idDetails.idNumber ? idDetails.idNumber : null,
                    'idIssuingCountry': idDetails.idIssuingCountry ? idDetails.idIssuingCountry : null,
                    'idIssuingCountryLabel': idDetails.idIssuingCountry ? this.journeyService.getLabelFromCode(this.journeyService.getIssueingCountry(), idDetails.idIssuingCountry) : null,
                    'idIssueDate': (idDetails.idIssueDate && !isNaN(idDetails.idIssueDate.getFullYear())) ?
                        `${idDetails.idIssueDate.getFullYear()}-${this._dom.formatDate(idDetails.idIssueDate.getMonth() + 1)}-${this._dom.formatDate(idDetails.idIssueDate.getDate())}` : null,
                    'idExpDate': (idDetails.idExpDate && !isNaN(idDetails.idExpDate.getFullYear())) ?
                        `${idDetails.idExpDate.getFullYear()}-${this._dom.formatDate(idDetails.idExpDate.getMonth() + 1)}-${this._dom.formatDate(idDetails.idExpDate.getDate())}` : null
                }
            });
        }

        if (model.addressDetails) {
            let addressDetails: any = {};
            addressDetails.id = model.addressDetails.id ? model.addressDetails.id : null;
            addressDetails.isMailingAndResidentialAddDifferent = model.addressDetails.isMailingAndResidentialAddDifferent ? model.addressDetails.isMailingAndResidentialAddDifferent : false;
            addressDetails.isAddressSameAsPrimary = model.addressDetails.isAddressSameAsPrimary;
            addressDetails.ownOrRent = model.addressDetails.ownOrRent;
            addressDetails.amtOfRent = model.addressDetails.amtOfRent;
            addressDetails.relationshipWithMortgageOwner = model.addressDetails.relationshipWithMortgageOwner;
            addressDetails.mortgageOwnersFullName = model.addressDetails.mortgageOwnersFullName;
            addressDetails.mortgageOwnerPhoneNumber = model.addressDetails.mortgageOwnerPhoneNumber;
            addressDetails.drivingDetailsToCurrentAddress = model.addressDetails.drivingDetailsToCurrentAddress;

            addressDetails.addresses = [];
            if (model.addressDetails.currentAddress) {
                model.addressDetails.currentAddress.dateMovedIn = (model.addressDetails.currentAddress.dateMovedIn && !isNaN(model.addressDetails.currentAddress.dateMovedIn.getFullYear())) ?
                    `${model.addressDetails.currentAddress.dateMovedIn.getFullYear()}-${this._dom.formatDate(model.addressDetails.currentAddress.dateMovedIn.getMonth() + 1)}-${this._dom.formatDate(model.addressDetails.currentAddress.dateMovedIn.getDate())}` : null;
                model.addressDetails.currentAddress.durationInMonths = this.convertToMonths(model.addressDetails.currentAddress.years, model.addressDetails.currentAddress.months);
                model.addressDetails.currentAddress['countryLabel'] = (model.addressDetails.currentAddress && model.addressDetails.currentAddress.country) ? this.journeyService.getLabelFromCode(this.journeyService.getIssueingCountry(), model.addressDetails.currentAddress.country) : null,
                    addressDetails.addresses.push(Object.assign({ type: "CURRENT" }, model.addressDetails.currentAddress));
            }

            if (model.addressDetails.mailingAddress && addressDetails.isMailingAndResidentialAddDifferent === 'NO') {
                model.addressDetails.mailingAddress.durationInMonths = this.convertToMonths(model.addressDetails.mailingAddress.years, model.addressDetails.mailingAddress.months);
                addressDetails.addresses.push(Object.assign({ type: "MAILING" }, model.addressDetails.mailingAddress));
            }

            if (model.addressDetails.previousAddress && model.addressDetails.currentAddress.durationInMonths < 36) {
                addressDetails.addresses.push(Object.assign({ type: "PREVIOUS" }, model.addressDetails.previousAddress));
            }
            applicant.addressDetails = addressDetails;
        }

        if (model.empDetails) {
            let employmentDetails = [];

            let emp: any = {};
            switch (model.empDetails.empType) {
                case "EMP001":
                case "EMP002":
                    emp = {
                        companyName: model.empDetails.empEmployed.companyName,
                        sector: model.empDetails.empEmployed.sector ? model.empDetails.empEmployed.sector : null,
                        jobTitleDescription: model.empDetails.empEmployed.jobTitleDescription ? model.empDetails.empEmployed.jobTitleDescription : null,
                        jobTitle: model.empDetails.empEmployed.jobTitle,
                        yearsEmployed: model.empDetails.empEmployed.yearsEmployed,
                        monthsEmployed: model.empDetails.empEmployed.monthsEmployed,
                        workPermitPresent: model.empDetails.empEmployed.workPermitPresent,
                        workPermitNumber: model.empDetails.empEmployed.workPermitNumber,
                        empDate: (model.empDetails.empEmployed.empDate && !isNaN(model.empDetails.empEmployed.empDate.getFullYear())) ?
                            `${model.empDetails.empEmployed.empDate.getFullYear()}-${this._dom.formatDate(model.empDetails.empEmployed.empDate.getMonth() + 1)}-${this._dom.formatDate(model.empDetails.empEmployed.empDate.getDate())}` : null,
                        workPermitExpiry: (model.empDetails.empEmployed.workPermitExpiry && !isNaN(model.empDetails.empEmployed.workPermitExpiry.getFullYear())) ?
                            `${model.empDetails.empEmployed.workPermitExpiry.getFullYear()}-${this._dom.formatDate(model.empDetails.empEmployed.workPermitExpiry.getMonth() + 1)}-${this._dom.formatDate(model.empDetails.empEmployed.workPermitExpiry.getDate())}` : null,
                    }

                    break;
                case "SEMP001":
                case "SEMP002":
                case "SEMP003":
                    emp = {
                        businessName: model.empDetails.empSelf.businessName,
                        jobTitleDescription: model.empDetails.empSelf.jobTitleDescription,
                        businessDate: (model.empDetails.empSelf.businessDate && !isNaN(model.empDetails.empSelf.businessDate.getFullYear())) ?
                            `${model.empDetails.empSelf.businessDate.getFullYear()}-${this._dom.formatDate(model.empDetails.empSelf.businessDate.getMonth() + 1)}-${this._dom.formatDate(model.empDetails.empSelf.businessDate.getDate())}` : null,
                        // businessType: model.empDetails.empSelf.businessType,
                        yearsBusiness: model.empDetails.empSelf.yearsBusiness,
                        monthsBusiness: model.empDetails.empSelf.monthsBusiness,

                    }
                    break;
                case "RT001":
                    emp = {
                        lastCompanyName: model.empDetails.empRetired.lastCompanyName,
                        sector: model.empDetails.empRetired.sector ? model.empDetails.empRetired.sector : null,
                        jobTitle: model.empDetails.empRetired.jobTitle,
                        yearOfRetirement: model.empDetails.empRetired.yearOfRetirement,
                        jobTitleDescription: model.empDetails.empRetired.jobTitleDescription

                    }
                    break;
                case "STU001":
                    emp = {
                        organizationName: model.empDetails.empStudent.organizationName ? model.empDetails.empStudent.organizationName : null,
                        highestEducation: model.empDetails.empStudent.highestEducation ? model.empDetails.empStudent.highestEducation : null,
                        fundingPerson: model.empDetails.empStudent.fundingPerson ? model.empDetails.empStudent.fundingPerson : null,
                        relationshipWithApplicant: model.empDetails.empStudent.relationshipWithApplicant ? model.empDetails.empStudent.relationshipWithApplicant : null,
                        isFundingPersonAnExistingCustomer: model.empDetails.empStudent.isFundingPersonAnExistingCustomer ? model.empDetails.empStudent.isFundingPersonAnExistingCustomer : null
                    }
                    break;
                case "NEMP001":
                    emp = {
                        fundingPerson: model.empDetails.nonEmp.fundingPerson ? model.empDetails.nonEmp.fundingPerson : null,
                        relationshipWithApplicant: model.empDetails.nonEmp.relationshipWithApplicant ? model.empDetails.nonEmp.relationshipWithApplicant : null,
                        isFundingPersonAnExistingCustomer: model.empDetails.nonEmp.isFundingPersonAnExistingCustomer ? model.empDetails.nonEmp.isFundingPersonAnExistingCustomer : null
                    }
                    // emp = null;
                    break;
            }

            //for employed
            if (model.empDetails.empEmployed && (model.empDetails.empType === "EMP001" || model.empDetails.empType === "EMP002")) {
                let addressDetails: any = {};

                addressDetails.addresses = [];
                if (model.empDetails.empEmployed.currentAddress) {
                    addressDetails.addresses.push(Object.assign({ type: 'CURRENT' }, model.empDetails.empEmployed.currentAddress));
                }
                emp = Object.assign(emp, addressDetails);
            }

            //for self employed
            if (model.empDetails.empSelf && (model.empDetails.empType === "SEMP001" || model.empDetails.empType === "SEMP002" || model.empDetails.empType === "SEMP003")) {
                let addressDetails: any = {};

                addressDetails.addresses = [];
                if (model.empDetails.empSelf.businessAddress) {
                    addressDetails.addresses.push(Object.assign({ type: 'BUSINESS' }, model.empDetails.empSelf.businessAddress));
                }
                emp = Object.assign(emp, addressDetails);
            }

            //for retired
            if (model.empDetails.empRetired && model.empDetails.empType === "RT001") {
                let addressDetails: any = {};
                addressDetails.addresses = [];
                if (model.empDetails.empRetired.currentAddress) {
                    addressDetails.addresses.push(Object.assign({ type: 'CURRENT' }, model.empDetails.empRetired.currentAddress));
                }
                emp = Object.assign(emp, addressDetails);
            }

            //for student
            if (model.empDetails.empStudent && model.empDetails.empType === "STU001") {
                let addressDetails: any = {};
                addressDetails.addresses = [];
                if (model.empDetails.empStudent.currentAddress) {
                    addressDetails.addresses.push(Object.assign({ type: 'CURRENT' }, model.empDetails.empStudent.currentAddress));
                }
                emp = Object.assign(emp, addressDetails);
            }


            let empData = {
                empType: model.empDetails.empType,
                empTypeLabel: model.empDetails.empType ? this.journeyService.getLabelFromCode(this.journeyService.getEmpType(), model.empDetails.empType) : null,
                id: model.empDetails.id ? model.empDetails.id : null,
                empDetail: emp
            }
            employmentDetails.push(empData);

            applicant.empDetails = employmentDetails;
        }

        if (model.politicallyExposedPersonDetails) {
            let pepDetails: any = {};

            pepDetails.id = model.politicallyExposedPersonDetails.id ? model.politicallyExposedPersonDetails.id : null;
            pepDetails.positionTitle = model.politicallyExposedPersonDetails.positionTitle ? model.politicallyExposedPersonDetails.positionTitle : null;
            pepDetails.dateRemovedFromPep = (model.politicallyExposedPersonDetails.dateRemovedFromPep && !isNaN(model.politicallyExposedPersonDetails.dateRemovedFromPep.getFullYear())) ?
                `${model.politicallyExposedPersonDetails.dateRemovedFromPep.getFullYear()}-${this._dom.formatDate(model.politicallyExposedPersonDetails.dateRemovedFromPep.getMonth() + 1)}-${this._dom.formatDate(model.politicallyExposedPersonDetails.dateRemovedFromPep.getDate())}` : null;
            pepDetails.dateAddedToPepList = (model.politicallyExposedPersonDetails.dateAddedToPepList && !isNaN(model.politicallyExposedPersonDetails.dateAddedToPepList.getFullYear())) ?
                `${model.politicallyExposedPersonDetails.dateAddedToPepList.getFullYear()}-${this._dom.formatDate(model.politicallyExposedPersonDetails.dateAddedToPepList.getMonth() + 1)}-${this._dom.formatDate(model.politicallyExposedPersonDetails.dateAddedToPepList.getDate())}` : null;
            pepDetails.yearsInPosition = model.politicallyExposedPersonDetails.yearsInPosition;
            // pepDetails.detailsOfPositonHeld = model.politicallyExposedPersonDetails.detailsOfPositonHeld ? model.politicallyExposedPersonDetails.detailsOfPositonHeld : null;
            pepDetails.pepCountry = model.politicallyExposedPersonDetails.pepCountry ? model.politicallyExposedPersonDetails.pepCountry : null;
            pepDetails.pepFirstName = model.politicallyExposedPersonDetails.pepFirstName ? model.politicallyExposedPersonDetails.pepFirstName : null;
            pepDetails.pepFlag = model.politicallyExposedPersonDetails.pepFlag ? model.politicallyExposedPersonDetails.pepFlag : null;
            pepDetails.pepLastName = model.politicallyExposedPersonDetails.pepLastName ? model.politicallyExposedPersonDetails.pepLastName : null;
            pepDetails.pepMiddleName = model.politicallyExposedPersonDetails.pepMiddleName ? model.politicallyExposedPersonDetails.pepMiddleName : null;
            pepDetails.pepRelation = model.politicallyExposedPersonDetails.pepRelation ? model.politicallyExposedPersonDetails.pepRelation : null;
            pepDetails.pepSuffix = model.politicallyExposedPersonDetails.pepSuffix ? model.politicallyExposedPersonDetails.pepSuffix : null;
            pepDetails.previousPep = model.politicallyExposedPersonDetails.previousPep ? model.politicallyExposedPersonDetails.previousPep : null;

            pepDetails.relationshipDetails = [];

            if (model.politicallyExposedPersonDetails.relationshipDetails && model.politicallyExposedPersonDetails.relationshipDetails.length > 0) {
                model.politicallyExposedPersonDetails.relationshipDetails = model.politicallyExposedPersonDetails.relationshipDetails.map((relationDetails) => {
                    return {
                        'id': relationDetails.id ? relationDetails.id : null,
                        'firstName': relationDetails.firstName ? relationDetails.firstName : null,
                        'middleName': relationDetails.middleName ? relationDetails.middleName : null,
                        'lastName': relationDetails.lastName ? relationDetails.lastName : null,
                        'relationship': relationDetails.relationship ? relationDetails.relationship : null,
                        'dob': (relationDetails.dob && !isNaN(relationDetails.dob.getFullYear())) ?
                            `${relationDetails.dob.getFullYear()}-${this._dom.formatDate(relationDetails.dob.getMonth() + 1)}-${this._dom.formatDate(relationDetails.dob.getDate())}` : null
                    }
                });
                pepDetails.relationshipDetails = model.politicallyExposedPersonDetails.relationshipDetails;
            }
            applicant.politicallyExposedPersonDetails = pepDetails;
        }

        if (model.incomeDetails) {
            let financialDetails: any = {};
            financialDetails.incomeDetails = [];

            model.incomeDetails = model.incomeDetails.map((income) => {
                return {
                    'id': income.id ? income.id : null,
                    'incomeType': income.incomeType ? income.incomeType : null,
                    'amount': income.amount,
                    'frequency': income.frequency ? income.frequency : null,
                    'income': income.income,
                    'comment': income.comment ? income.comment : null,
                    'monthlyIncome': income.income ? (income.income / 12) : 0,
                    'primarySourceOfIncome': income.primarySourceOfIncome ? income.primarySourceOfIncome : false
                }
            });
            financialDetails.incomeDetails = model.incomeDetails;
            if (applicant && applicant.financialDetails) {
                applicant.financialDetails = Object.assign(applicant.financialDetails, financialDetails);
            } else {
                applicant.financialDetails = financialDetails;
            }

        }

        // if (model.assetDetails) {
        //     applicant.assetDetails = model.assetDetails.map((asset) => {
        //         return {
        //             'type': asset.assetType ? asset.assetType : null,
        //             'amount': asset.amount ? asset.amount : null,
        //             'comment': asset.comment ? asset.comment : null,
        //             'instName': asset.instName ? asset.instName : null
        //         }
        //     });
        // }
        applicant.order = order;
        return applicant;
    };

    convertToMonths(years, months) {
        var result = null;
        if (years) {// && angular.isNumber(years)) {
            result = years * 12;
        }
        if (months) {// && angular.isNumber(months)) {
            result = result ? result : 0;
            result += +months;
        }
        return result;
    };

    getMonthsFromMonthsDuration(monthsCount: number) {
        var months = null;
        if (monthsCount) {// && angular.isNumber(monthsCount)) {
            months = monthsCount % 12;
            return "" + months + "";
        }
        return null;
    };

    getYearsFromMonthsDuration(monthsCount: number) {
        var years = null;
        if (monthsCount) {// && angular.isNumber(monthsCount)) {
            years = Math.floor(monthsCount / 12);
            return "" + years + "";
        }
        return null;
    };

    updateApplicant(data) {
        var applicants = [];
        var appData = this.journeyService.getFromStorage();

        if (data.addressDetails || data.incomeDetails || data.assetDetails) {
            var applicant = appData.applicants.find(app => app.type == "PRIMARY");
            let index = appData.applicants.findIndex(app => app.type === "PRIMARY");
            appData.applicants.splice(index, 1);
            applicant = Object.assign({}, applicant, data);
            appData.applicants.push(applicant);
        }

        if (data.employmentDetails) {
            for (var i = 0; i < data.employmentDetails.length; i++) {
                var empType = data.employmentDetails[i].empType;
                switch (empType) {
                    case "EMP001":
                    case "EMP002":
                        //data.employmentDetails[i].empStatus = data.employmentDetails[i].EMPLOYED_empStatus;
                        data.employmentDetails[i].employed_company = data.employmentDetails[i].EMPLOYED_companyName;
                        data.employmentDetails[i].empAddress = data.employmentDetails[i].EMPLOYED_empAddress;
                        data.employmentDetails[i].duration = this.convertToMonths(data.employmentDetails[i].EMPLOYED_years, data.employmentDetails[i].EMPLOYED_months);
                        data.employmentDetails[i].designation = data.employmentDetails[i].EMPLOYED_position;
                        break;

                    case "SEMP001":
                    case "SEMP002":
                    case "SEMP003":
                        data.employmentDetails[i].selfEmployed_company = data.employmentDetails[i].SELF_EMPLOYED_companyName;
                        data.employmentDetails[i].duration = this.convertToMonths(data.employmentDetails[i].SELF_EMPLOYED_years, data.employmentDetails[i].SELF_EMPLOYED_months);
                        data.employmentDetails[i].companyType = data.employmentDetails[i].SELF_EMPLOYED_companyType;
                        data.employmentDetails[i].indClass = data.employmentDetails[i].SELF_EMPLOYED_industryClassification;
                        data.employmentDetails[i].selfEmployed_income = data.employmentDetails[i].SELF_EMPLOYED_grossIncome;
                        break;

                    case "NEMP001":
                        data.employmentDetails[i].notEmployed_income = data.employmentDetails[i].NOT_EMPLOYED_grossIncome;
                        data.employmentDetails[i].sourceRepayment = data.employmentDetails[i].NOT_EMPLOYED_sourceOfRepayment;
                        data.employmentDetails[i].duration = this.convertToMonths(data.employmentDetails[i].NOT_EMPLOYED_years, data.employmentDetails[i].NOT_EMPLOYED_months);
                        break;

                    case "RT001":
                        data.employmentDetails[i].lastCompany = data.employmentDetails[i].RETIRED_lastCompanyName;
                        data.employmentDetails[i].yearRetirement = data.employmentDetails[i].RETIRED_retirementYear;
                        break;

                    case "STU":
                        data.employmentDetails[i].school = data.employmentDetails[i].STUDENT_schoolName;
                        data.employmentDetails[i].yearGraduation = data.employmentDetails[i].STUDENT_yearOfGraduation;
                        break;
                }
                // data.employmentDetails = data.employmentDetails.map((item) => {
                //     return {
                //         'empType': item.empType,
                ////         'designation': item.empStatus,
                //         'companyName': item.companyName,
                //         'position': item.position,
                //         'empAddress': item.empAddress,
                //         'duration': this.convertToMonths(item.years, item.months),
                //         'typeOfBusiness': item.typeOfBusiness,
                //         'industryClassification': item.industryClassification,
                //         'grossIncome': item.grossIncome,
                //         'ownershipPercent': item.ownershipPercent,
                //         'yearInBusiness': item.yearInBusiness,
                //         'fromDate': item.fromDate,
                //         'toDate': item.toDate,
                //         'comment': item.comment,
                //         'previousOccupation': item.previousOccupation,
                //         'active': item.active,
                //         'lastCompanyName': item.active,
                //         'retirementYear': item.active,
                //         'schoolName': item.active,
                //         'yearOfGraduation': item.active,
                //         'sourceOfRepayment': item.active
                //     }
                // });
            }

            var applicant = appData.applicants.find(app => app.type == "PRIMARY");
            let index = appData.applicants.findIndex(app => app.type === "PRIMARY");
            appData.applicants.splice(index, 1);
            applicant = Object.assign({}, applicant, data);
            appData.applicants.push(applicant);
        }

        this.journeyService.setInStorage(appData);
    };

    formatDate(value) {
        return (value < 10 ? '0' + value : value);
    };

    getUSPSData(data) {
        return this.journeyService.getUSPSData(data);
    }

    saveAndExit(data) {
        return this.journeyService.saveAndExitApplication(data);
    }

    extractIdScanData(payload) {
        payload = {
            "images": [
                {
                    "data": this.getByteData(payload[0].data),
                    "fileExtension": payload[0].ext.toUpperCase(),
                    "name": payload[0].name
                }
            ]
        }
        return this.journeyService.extractIdScanData(payload);
    };

    getByteData(str) {
        return str.substr(str.indexOf(',') + 1);
    }

    saveProductType(data) {
        var appData = this.journeyService.getFromStorage();
        if (!appData.collateralDetail.productType) {
            if (data.productType) {
                appData.collateralDetail = Object.assign({}, appData.collateralDetail, data);
            }
            this.journeyService.setInStorage(appData);
        }
    }

    getMonths(numberOfMonths) {
        var months: number = null;
        if (numberOfMonths) {
            months = parseInt("" + numberOfMonths % 12);
        }
        return months;
    };

    getYears(numberOfMonths) {
        var years = null;
        if (numberOfMonths) {
            years = parseInt("" + numberOfMonths / 12);
        }
        return years;
    };

    getDropdownMonths() {
        return this.journeyService.getMonths();
    }
    getrelationship() {
        return this.journeyService.getrelationship();
    }
    getOptionList() {
        return this.journeyService.getOptionList();
    }
    getSuffix() {
        return this.journeyService.getSuffix();
    }
    getPrefix() {
        return this.journeyService.getPrefix();
    }


    getDropdownYears() {
        return this.journeyService.getYears();
    }

    getEmpType() {
        return this.journeyService.getEmpType();
    }

    getEmpStatus() {
        return this.journeyService.getEmpStatus();
    }

    getIssueingCountry() {
        return this.journeyService.getIssueingCountry();
    }

    getIncomeType() {
        return this.journeyService.getIncomeType();
    }

    getIncomeFrequency() {
        return this.journeyService.getIncomeFrequency();
    }

    getAssetType() {
        return this.journeyService.getAssetType();
    }

    getIssueingState() {
        return this.journeyService.getIssueingState();
    }

    getState() {
        return this.journeyService.getState();
    }

    getownOrRent() {
        return this.journeyService.getownOrRent();
    }


    getCounty() {
        return this.journeyService.getCounty();
    }

    getPhoneType() {
        return this.journeyService.getPhoneType();
    }

    getIDType() {
        return this.journeyService.getIDType();
    }

    getMaritalStatus() {
        return this.journeyService.getMaritalStatus();
    }

    getGender() {
        return this.journeyService.getGender();
    }

    getCity() {
        return this.journeyService.getCity();
    }

    getPEPRelationList() {
        return this.journeyService.getPEPRelationList();
    }

    getestimatedAmountList() {
        return this.journeyService.getestimatedAmountList();
    }

    getOccupationList() {
        return this.journeyService.getOccupationList();
    }

    getEmpSectorList() {
        return this.journeyService.getEmpSectorList();
    }

    getIncomeSourceList() {
        return this.journeyService.getIncomeSourceList();
    }

    getApplicantValidationValues() {
        return this.journeyService.getValidationValues().application.applicant;
    }

    getBacicDetailValidationValues() {
        return this.journeyService.getValidationValues().application.applicant.basicDetails;
    }

    getEmpDetailValidationValues() {
        return this.journeyService.getValidationValues().application.applicant.empDetails;
    }

    getAddressDetailValidationValues() {
        return this.journeyService.getValidationValues().application.applicant.addressDetails;
    }

    getIncomeDetailValidationValues() {
        return this.journeyService.getValidationValues().application.applicant.incomeDetails;
    }

    getAssetDetailValidationValues() {
        return this.journeyService.getValidationValues().application.applicant.assetDetails;
    }

    getBusinessType() {
        return this.journeyService.getBusinessType();
    }

    getJobTitleList() {
        return this.journeyService.getJobTitleList();
    }

    getHighestEducationList() {
        return this.journeyService.getHighestEducationList();
    }

    getAllowedAgeList() {
        try { return this.journeyService.getAllowedAgeList(); }
        catch (exception) {
            console.log(exception.message)
        }
    }

    updateSSNFormat(ssn) {
        let updatedSSN = "";
        if (ssn.length === 8) {
            updatedSSN = ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-" + ssn.slice(5, 8);
        }
        else if (ssn.length === 10) {
            return ssn;
        }
        return updatedSSN;
    }

    updatePhoneFormat(phone) {
        if (!this._dom.isEmpty(phone)) {
            let updatedPhone = '';
            if (phone.length === 10) {
                updatedPhone = '(' + phone.slice(0, 3) + ')-' + phone.slice(3, 6) + '-' + phone.slice(6, 10);
            } else if (phone.length === 14) {
                return phone;
            }
            return updatedPhone;
        }
        return phone;
    }

    //Added by Hemlata for Loan Relationship dropdown on 17 Oct 2022
    getLoanRelationshipList() {
        return this.journeyService.getLoanRelationshipList();
    }

    //Added by Hemlata for Account Type dropdown on 17 Oct 2022
    getAccountTypeList() {
        return this.journeyService.getAccountTypeList();
    }
}
