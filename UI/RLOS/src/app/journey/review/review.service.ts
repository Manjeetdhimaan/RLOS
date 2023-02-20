import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { JourneyService } from '../_root/journey.service';

@Injectable()
export class SummaryService {
  constructor(private journeyService: JourneyService) { }

  getTabData() {
    var applicantObj = this.journeyService.getFromStorage();

    if (applicantObj.primaryApplicant && applicantObj.primaryApplicant.employmentDetails) {
      if (applicantObj.primaryApplicant.employmentDetails.length > 1) {
        applicantObj.primaryApplicant.employmentStatus = 'Multiple';
        applicantObj.primaryApplicant.sourceOfIncome = 'Multiple';
      } else {
        applicantObj.primaryApplicant.employmentStatus = applicantObj.primaryApplicant.employmentDetails[0].empType;
        applicantObj.primaryApplicant.sourceOfIncome = applicantObj.primaryApplicant.employmentDetails[0].sourceOfIncome;
      }
      applicantObj.primaryApplicant.employmentDetails.frequency = 'Monthly';
    }

    if (applicantObj.primaryApplicant && applicantObj.primaryApplicant.incomeDetails) {
      if (applicantObj.primaryApplicant.incomeDetails.length > 1) {
        applicantObj.primaryApplicant.incomeType = 'Multiple';
      } else {
        applicantObj.primaryApplicant.incomeType = applicantObj.primaryApplicant.incomeDetails[0].incomeType;
      }

      let _grossIncome: number = 0;
      applicantObj.primaryApplicant.incomeDetails.forEach((item) => {
        if (item.amount) {
          _grossIncome += parseInt(item.amount);
        }
      });
      applicantObj.primaryApplicant.incomeDetails.grossIncome = parseInt("" + _grossIncome / 3);
    }


    return applicantObj;
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
  //subhasree
  getPrimaryApplicantModel() {
    let appData = this.journeyService.getFromStorage();
    return appData.applicants[0];
  }

  dtoToModel(type) {
    try {
      var tabDataList: any = {};
      var coApplicants: any = [];
      var applicantObj = this.journeyService.getFromStorage();
      if (applicantObj && applicantObj.applicants) {
        const applicant = applicantObj.applicants.filter(x => x.type === 'PRIMARY');
        const applicants = applicantObj.applicants.filter(x => x.type === 'CO_APPLICANT');

        if (type === 'PRIMARY') {
          var iterator = [];
          iterator = applicant;
        } else {
          iterator = applicants;
        }
        for (const applicant of iterator) {
          if (applicant) {
            const dobTemp = applicant.dob ? applicant.dob.split('-') : '';
            applicant.dob = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);

            tabDataList = {

              basicDetails: {
                'existingCustomer': applicant.existingCustomer ? applicant.existingCustomer : false,
                'tinNumber': applicant.tinNumber,
                'citizenship': applicant.citizenship,
                'placeOfBirth': applicant.placeOfBirth,
                'haveLicense': applicant.haveLicense,
                'prefix': applicant.prefix,
                'firstName': applicant.firstName,
                'middleName': applicant.middleName,
                'lastName': applicant.lastName,
                'suffix': applicant.suffix,
                'dob': applicant.dob,
                'age': applicant.age,
                'email': applicant.email,
                'gender': applicant.gender,
                'maritalStatus': applicant.maritalStatus,
                // 'ssn': applicant.ssn ? applicant.ssn : null,
                'ssn': applicant.ssn,
                'id': applicant.id,
                'isAlreadyExist': applicant.isAlreadyExist,
                // 'isBankEmployee': applicant.isBankEmployee,
                'isGovernmentEmployee': applicant.isGovernmentEmployee,
                'lifeInsuranceRequired': applicant.lifeInsuranceRequired,
                'lifeInsuranceProviderName': applicant.lifeInsuranceProviderName,
                'lifeInsuranceAlreadyPresent': applicant.lifeInsuranceAlreadyPresent,
                idDetails: applicant.idDetails
              }
            };

            if (applicant.identificationDetails) {
              let identificationDetails: any = {};
              identificationDetails = applicant.identificationDetails;
              tabDataList.identificationDetails = identificationDetails;
            }

            if (applicant.addressDetails) {
              let addressDetails: any = {};
              addressDetails.isMailingAndResidentialAddDifferent = applicant.addressDetails.isMailingAndResidentialAddDifferent ? applicant.addressDetails.isMailingAndResidentialAddDifferent : false;
              addressDetails.ownOrRent = applicant.addressDetails.ownOrRent;
              addressDetails.amtOfRent = applicant.addressDetails.amtOfRent;
              addressDetails.relationshipWithMortgageOwner = applicant.addressDetails.relationshipWithMortgageOwner;
              addressDetails.mortgageOwnersFullName = applicant.addressDetails.mortgageOwnersFullName;
              addressDetails.mortgageOwnerPhoneNumber = applicant.addressDetails.mortgageOwnerPhoneNumber;
              addressDetails.isAddressSameAsPrimary = applicant.addressDetails.isAddressSameAsPrimary;
              addressDetails.homePhoneNo = applicant.homePhoneNo;
              addressDetails.mobileNo = applicant.mobileNo;
              addressDetails.workPhoneNo = applicant.workPhoneNo;
              addressDetails.drivingDetailsToCurrentAddress = applicant.drivingDetailsToCurrentAddress;
              var currentAddress = applicant.addressDetails.addresses.find(address => address.type == 'CURRENT');
              var mailingAddress = applicant.addressDetails.addresses.find(address => address.type == 'MAILING');
              var previousAddress = applicant.addressDetails.addresses.find(address => address.type == 'PREVIOUS');

              if (currentAddress) {
                // currentAddress.years = this.getYearsFromMonthsDuration(currentAddress.durationInMonths);
                // currentAddress.months = this.getMonthsFromMonthsDuration(currentAddress.durationInMonths);

                addressDetails.currentAddress = Object.assign({}, currentAddress);
              }
              if (mailingAddress && addressDetails.isMailingAndResidentialAddDifferent) {
                // mailingAddress.years = this.getYearsFromMonthsDuration(mailingAddress.durationInMonths);
                // mailingAddress.months = this.getMonthsFromMonthsDuration(mailingAddress.durationInMonths);
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

            if (applicant.empDetails) {
              let employmentDetails = [];
              // var dempDateTemp = applicant.empDate ? applicant.empDate.split('-') : '';
              applicant.empDetails.forEach(employment => {
                let emp: any = {};
                switch (employment.empType) {
                  case "EMP001":
                  case "EMP002":
                    emp = {
                      empEmployed: {
                        companyName: employment.empDetail.companyName,
                        sector: employment.empDetail.sector,
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
                    emp = {
                      empSelf: {
                        businessName: employment.empDetail.businessName,
                        businessDate: employment.empDetail.businessDate,
                        businessType: employment.empDetail.businessType,
                        yearsBusiness: (employment.empDetail.yearsBusiness ? employment.empDetail.yearsBusiness.toString() : null),
                        monthsBusiness: (employment.empDetail.monthsBusiness ? employment.empDetail.monthsBusiness.toString() : null)
                      }
                    }
                    break;
                  case "RT001":
                    emp = {
                      empRetired: {
                        lastCompanyName: employment.empDetail.lastCompanyName,
                        sector: employment.empDetail.sector,
                        jobTitle: employment.empDetail.jobTitle,
                        yearOfRetirement: (employment.empDetail.yearOfRetirement ? employment.empDetail.yearOfRetirement.toString() : null)
                      }
                    }
                    break;
                  case "NEMP001":
                    emp = {
                      nonEmp: {
                      }
                    }
                    break;
                }

                if (employment.empType === 'EMP001' || employment.empType === 'EMP002') {
                  var addressDetails: any = {};
                  // addressDetails = {
                  //   // isMailingAndResidentialAddDifferent: employment.empDetail.isMailingAndResidentialAddDifferent ? employment.empDetail.isMailingAndResidentialAddDifferent : "NO",
                  //   isAddressSameAsPrimary: employment.empDetail.isAddressSameAsPrimary ? employment.empDetail.isAddressSameAsPrimary : "NO"
                  // }

                  const currentAddress = employment.empDetail.addresses.find(address => address.type == 'CURRENT');
                  // const mailingAddress = employment.empDetail.addresses.find(address => address.type == 'MAILING');

                  if (currentAddress) {
                    addressDetails.currentAddress = Object.assign({}, currentAddress);
                  }
                  // if (mailingAddress) {
                  //   addressDetails.mailingAddress = Object.assign({}, mailingAddress);
                  // }

                  emp.empEmployed = {
                    ...emp.empEmployed, ...addressDetails
                  }
                }
                if (employment.empType === 'SEMP001' || employment.empType === 'SEMP002' || employment.empType === 'SEMP003') {
                  var addressDetails: any = {};
                  // addressDetails = {
                  //   // isMailingAndResidentialAddDifferent: employment.empDetail.isMailingAndResidentialAddDifferent ? employment.empDetail.isMailingAndResidentialAddDifferent : "NO",
                  //   isAddressSameAsPrimary: employment.empDetail.isAddressSameAsPrimary ? employment.empDetail.isAddressSameAsPrimary : "NO"
                  // }

                  const businessAddress = employment.empDetail.addresses.find(address => address.type == 'BUSINESS');
                  // const mailingAddress = employment.empDetail.addresses.find(address => address.type == 'MAILING');

                  if (businessAddress) {
                    addressDetails.currentAddress = Object.assign({}, businessAddress);
                  }
                  // if (mailingAddress) {
                  //   addressDetails.mailingAddress = Object.assign({}, mailingAddress);
                  // }

                  emp.empSelf = {
                    ...emp.empSelf, ...addressDetails
                  }
                }
                let income = {
                  incomeDetail: {
                    incomeType: employment.incomeDetail.incomeType,
                    amount: employment.incomeDetail.amount,
                    frequency: employment.incomeDetail.frequency,
                    income: employment.incomeDetail.income,
                    comment: employment.incomeDetail.comment
                  }
                }
                let empObject = {
                  empType: employment.empType,
                  incomeDetail: income.incomeDetail,
                }
                employmentDetails.push({ ...empObject, ...emp });
              });
              tabDataList.empDetails = employmentDetails;
            }

            if (applicant.politicallyExposedPersonDetails) {

              tabDataList.politicallyExposedPersonDetails = applicant.politicallyExposedPersonDetails;
              // tabDataList.politicallyExposedPersonDetails.relationshipDetails = applicant.relationshipDetails;
              if (applicant.politicallyExposedPersonDetails.relationshipDetails) {
                tabDataList.politicallyExposedPersonDetails.relationshipDetails = applicant.politicallyExposedPersonDetails.relationshipDetails;
              }

            }

            if (applicant.familyDetails) {
              tabDataList.familyDetails = applicant.familyDetails;
            }

            if (applicant.referenceDetails) {
              tabDataList.referenceDetails = applicant.referenceDetails;
              tabDataList.referenceDetails.forEach(reference => {
                var currentAddress = reference.addresses.find(address => address.type == 'CURRENT');
                var mailingAddress = reference.addresses.find(address => address.type == 'MAILING');
                if (currentAddress) {
                  reference.currentAddress = Object.assign({}, currentAddress);
                }
                if (mailingAddress && reference.isMailingAndResidentialAddDifferent) {
                  reference.mailingAddress = Object.assign({}, mailingAddress);
                }
                delete reference.addresses;
              });
            }
            if (type === 'CO_APPLICANT') {
              coApplicants.push(tabDataList);
            }

          }
        }

      }
      if (type === 'PRIMARY') {
        return tabDataList;
      } else {
        return coApplicants;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getCoApplicantModel() {
    try {
      let appData = this.journeyService.getFromStorage();
      return appData.applicants.filter(x => x.type == "CO_APPLICANT");
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  saveData(data) {
    try {
      var appData = this.journeyService.getFromStorage();
      appData.primaryApplicant = Object.assign({}, appData.primaryApplicant, data);
      this.journeyService.setInStorage(appData);
      return
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  isAssetsMandatory() {
    try {
      let appData = this.journeyService.getFromStorage();
      let collateralType = appData.loanDetails.collateralType;
      let loanAmount = appData.loanDetails.loanAmount;
      let typeOfLoan = appData.loanDetails.typeOfLoan;
      if (((this.isVLProductType(collateralType) || this.isOtherProductType(collateralType)) && loanAmount > 150000) || (collateralType === '046_2' && loanAmount > 30000) || ((collateralType === '046_4') && loanAmount > 50000)) {
        return true;
      }
      else if (((typeOfLoan === '00' && loanAmount > 150000) || (typeOfLoan === '01' && loanAmount > 50000))) {
        return true;
      }
      else {
        return false;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  isOtherProductType(collateralType) {
    try {
      if (collateralType === '026' || collateralType === '030' || collateralType === '015' || collateralType === '028' || collateralType === '049' || collateralType === '036' || collateralType === '000' || collateralType === '037' || collateralType === '054' || collateralType === '004' || collateralType === '031' || collateralType === '034' || collateralType === '027' || collateralType === '025' || collateralType === '006' || collateralType === '012' || collateralType === '005' || collateralType === '032' || collateralType === '038' || collateralType === '047' || collateralType === '048' || collateralType === '003') {
        return true;
      }
      return false;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  isVLProductType(collateralType) {
    try {
      if (collateralType === '026' || collateralType === '030' || collateralType === '005' || collateralType === '032' || collateralType === '038' || collateralType === '047' || collateralType === '048' || collateralType === '003') {
        return true;
      }
      return false;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getDropdownMonths() {
    try { return this.journeyService.getMonths(); }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getDropdownYears() {
    try {
      return this.journeyService.getYears();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getIssueingCountry() {
    try {
      return this.journeyService.getIssueingCountry();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getEmpType() {
    try {
      return this.journeyService.getEmpType();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getEmpStatus() {
    try {
      return this.journeyService.getEmpStatus();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getIncomeType() {
    try {
      return this.journeyService.getIncomeType();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getIncomeFrequency() {
    try {
      return this.journeyService.getIncomeFrequency();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getAssetType() {
    try {
      return this.journeyService.getAssetType();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getIssueingState() {
    try {
      return this.journeyService.getIssueingState();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getIdType() {
    try {
      return this.journeyService.getIDType();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getMaritalStatus() {
    try {
      return this.journeyService.getMaritalStatus();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getState() {
    try {
      return this.journeyService.getState();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getCity() {
    try {
      return this.journeyService.getCity();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getGender() {
    try {
      return this.journeyService.getGender();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getPrefix() {
    try {
      return this.journeyService.getPrefix();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getSuffix() {
    try {
      return this.journeyService.getSuffix();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  getPEPRelationList() {
    try {
      return this.journeyService.getPEPRelationList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getOccupationList() {
    try {
      return this.journeyService.getOccupationList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getCountryList() {
    try {
      return this.journeyService.getCountryList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getJobTitleList() {
    try {
      return this.journeyService.getJobTitleList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getBusinessType() {
    try {
      return this.journeyService.getBusinessType();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getHighestEducationList() {
    try {
      return this.journeyService.getHighestEducationList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getFamilyRelationship() {
    try {
      return this.journeyService.getFamilyRelationship();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getLoanPurposeList() {
    try {
      return this.journeyService.getLoanPurposeList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getDependentList() {
    try {
      return this.journeyService.getDependentList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getEmpSectorList() {
    try {
      return this.journeyService.getEmpSectorList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getIncomeSourceList() {
    try {
      return this.journeyService.getIncomeSourceList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getCounty() {
    try {
      return this.journeyService.getCountyState();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getPurchaseTypeList() {
    try {
      return this.journeyService.getPurchaseTypeList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getPhoneType() {
    try {
      return this.journeyService.getPhoneType();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getownOrRent() {
    try {
      return this.journeyService.getownOrRent();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getApplicantValidationValues() {
    try {
      return this.journeyService.getValidationValues().application.applicant;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getApplicationData() {
    try {
      return this.journeyService.getFromStorage();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setInStorage(data) {
    try {
      return this.journeyService.setInStorage(data);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getLoanRelationshipList(){
    try {
      return this.journeyService.getLoanRelationshipList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getAccountTypeList(){
    try {
      return this.journeyService.getAccountTypeList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }
}
