import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, empty } from 'rxjs';
import { map } from "rxjs/operators";

import { AuthService } from '../../auth/auth.service';
import { PersistanceService } from '../../../app/core/services/persistence.service';


@Injectable()
export class LandingPageService {
    alertObj: {};
    constructor(private authService: AuthService, private http: HttpClient, private persistanceService: PersistanceService) { }

    dtoToModel() {
        var tabDataList: any = {};
        var applicantObj = this.persistanceService.getFromStorage("APP");
        if (applicantObj && applicantObj.applicants) {
            var applicant = applicantObj.applicants.find(x => x.type == "PRIMARY");
            if (applicant) {

                var dobTemp = applicant.dob ? applicant.dob.split('-') : '';
                applicant.dob = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);
                var expDateTemp = applicant.idExpDate ? applicant.idExpDate.split('-') : '';
                applicant.idExpDate = applicant.idExpDate ? new Date(expDateTemp[0], expDateTemp[1] - 1, expDateTemp[2]) : null;
                var issueDateTemp = applicant.idIssueDate ? applicant.idIssueDate.split('-') : '';
                applicant.idIssueDate = applicant.idIssueDate ? new Date(issueDateTemp[0], issueDateTemp[1] - 1, issueDateTemp[2]) : null;

                tabDataList = {
                    basicDetails: {
                        'haveLicense': applicant.haveLicense,
                        'prefix': applicant.prefix,
                        'firstName': applicant.firstName,
                        'middleName': applicant.middleName,
                        'lastName': applicant.lastName,
                        'suffix': applicant.suffix,
                        'dob': applicant.dob,
                        'email': applicant.email,
                        'idType': applicant.idType,
                        'idIssueDate': applicant.idIssueDate,
                        'idExpDate': applicant.idExpDate,
                        'ssn': applicant.ssn,
                        'idNumber': applicant.idNumber,
                        'isBankEmployee': applicant.isBankEmployee,
                        'id': applicant.id,
                        'arn': "abcd"
                    }
                };

                if (applicant.addressDetails) {
                    let addressDetails: any = {};
                    addressDetails.isMailingAndResidentialAddDifferent = applicant.addressDetails.isMailingAndResidentialAddDifferent ? applicant.addressDetails.isMailingAndResidentialAddDifferent : false;
                    addressDetails.ownOrRent = applicant.addressDetails.ownOrRent;
                    addressDetails.amtOfRent = applicant.addressDetails.amtOfRent;
                    addressDetails.isAddressSameAsPrimary = applicant.addressDetails.isAddressSameAsPrimary;
                    addressDetails.homePhoneNo = applicant.homePhoneNo;
                    addressDetails.mobileNo = applicant.mobileNo;
                    addressDetails.homePhoneType = applicant.homePhoneType;
                    addressDetails.altPhoneType = applicant.altPhoneType;
                    var currentAddress = applicant.addressDetails.addresses.find(address => address.type == 'CURRENT');
                    var mailingAddress = applicant.addressDetails.addresses.find(address => address.type == 'MAILING');
                    var previousAddress = applicant.addressDetails.addresses.find(address => address.type == 'PREVIOUS');

                    if (currentAddress) {
                        currentAddress.years = this.getYearsFromMonthsDuration(currentAddress.durationInMonths);
                        currentAddress.months = this.getMonthsFromMonthsDuration(currentAddress.durationInMonths);
                        addressDetails.currentAddress = Object.assign({}, currentAddress);
                    }
                    if (mailingAddress && addressDetails.isMailingAndResidentialAddDifferent) {
                        mailingAddress.years = this.getYearsFromMonthsDuration(mailingAddress.durationInMonths);
                        mailingAddress.months = this.getMonthsFromMonthsDuration(mailingAddress.durationInMonths);
                        addressDetails.mailingAddress = Object.assign({}, mailingAddress);
                    }
                    if (previousAddress && currentAddress.durationInMonths < 24) {
                        // previousAddress.years = this.getYearsFromMonthsDuration(previousAddress.durationInMonths);
                        // previousAddress.months = this.getMonthsFromMonthsDuration(previousAddress.durationInMonths);
                        addressDetails.previousAddress = Object.assign({}, previousAddress);

                        // let index = previousAddress.findIndex(address => address.type === "PREVIOUS");
                        // previousAddress.splice(index, 1);
                        // if(previousAddress) {
                        //     addressDetails.previousAddresses = [];
                        //     previousAddress.forEach((prevAddress)=> {
                        //         addressDetails.previousAddresses.push(Object.assign({}, prevAddress));
                        //     });
                        // }

                    }
                    tabDataList.addressDetails = addressDetails;
                }
            }

        }
        return tabDataList;
    }

    modelToDTO(model, applicant) {
        if (model.basicDetails) {
            applicant.firstName = model.basicDetails.firstName;
            applicant.lastName = model.basicDetails.lastName;
            applicant.email = model.basicDetails.email;
            applicant.confirmEmail = model.basicDetails.confirmEmail;           
            applicant.cellPhoneNo = model.basicDetails.primaryPhoneNumber; 
            applicant.dob = (model.basicDetails.dob && !isNaN(model.basicDetails.dob)) ? model.basicDetails.dob.getFullYear() + '-' + this.formatDate(model.basicDetails.dob.getMonth() + 1) + '-' + this.formatDate(model.basicDetails.dob.getDate()) : null         

            // address details
            // let addressDetails: any = {};
            // addressDetails.mobileNo = model.basicDetails.primaryPhoneNumber ? model.basicDetails.primaryPhoneNumber : null;
            // addressDetails.addresses = [];
            // addressDetails.addresses.push(Object.assign({ type: "CURRENT" }))
            // applicant.addressDetails = addressDetails;
        }       

        applicant.order = 1;
        return applicant;
    }

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
        }
        return "" + months + "";
    };

    getYearsFromMonthsDuration(monthsCount: number) {
        var years = null;
        if (monthsCount) {// && angular.isNumber(monthsCount)) {
            years = Math.floor(monthsCount / 12);
        }
        return "" + years + "";
    };

    updateApplicant(data) {
        var applicants = [];
        var appData = this.persistanceService.getFromStorage("APP");

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
                        data.employmentDetails[i].empStatus = data.employmentDetails[i].EMPLOYED_empStatus;
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
                    case "RT001":
                    case "OT001":
                        data.employmentDetails[i].notEmployed_income = data.employmentDetails[i].NOT_EMPLOYED_grossIncome;
                        data.employmentDetails[i].sourceRepayment = data.employmentDetails[i].NOT_EMPLOYED_sourceOfRepayment;
                        data.employmentDetails[i].duration = this.convertToMonths(data.employmentDetails[i].NOT_EMPLOYED_years, data.employmentDetails[i].NOT_EMPLOYED_months);
                        break;

                    // case "RET":
                    //     data.employmentDetails[i].lastCompany = data.employmentDetails[i].RETIRED_lastCompanyName;
                    //     data.employmentDetails[i].yearRetirement = data.employmentDetails[i].RETIRED_retirementYear;
                    //     break;

                    case "STU":
                        data.employmentDetails[i].school = data.employmentDetails[i].STUDENT_schoolName;
                        data.employmentDetails[i].yearGraduation = data.employmentDetails[i].STUDENT_yearOfGraduation;
                        break;
                }
                // data.employmentDetails = data.employmentDetails.map((item) => {
                //     return {
                //         'empType': item.empType,
                //         'designation': item.empStatus,
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

        this.persistanceService.setInStorage("APP", appData);
    };

    formatDate(value) {
        return (value < 10 ? '0' + value : value);
    };

    getByteData(str) {
        if (str) {
            return str.substr(str.indexOf(',') + 1);
        }
        else {
            return null;
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

    getApplicantValidationValues() {
        return this.authService.getValidationValues().application.applicant;
    }

    getBacicDetailValidationValues() {
        return this.authService.getValidationValues().application.applicant.basicDetails;
    }

    getEmpDetailValidationValues() {
        return this.authService.getValidationValues().application.applicant.empDetails;
    }

    getAddressDetailValidationValues() {
        return this.authService.getValidationValues().application.applicant.addressDetails;
    }

    getIncomeDetailValidationValues() {
        return this.authService.getValidationValues().application.applicant.incomeDetails;
    }

    getAssetDetailValidationValues() {
        return this.authService.getValidationValues().application.applicant.assetDetails;
    }

    // updateSSNFormat(ssn) {
    //     let updatedSSN = "";
    //     if (ssn.length === 8) {
    //         updatedSSN = ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-" + ssn.slice(5, 8);
    //     }
    //     return updatedSSN;
    // }
}
