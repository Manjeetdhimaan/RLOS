import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { JourneyService } from '../_root/journey.service';
import { SummaryService } from './review.service';
import { PersistanceService } from '../../core/services';
import { MessageService } from '../../shared';
import { environment } from 'environments/environment';
import { SaveExitConfirmComponent } from '../common/overlays';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-summary',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class SummaryComponent implements OnInit {
  step = 0;
  private formControls;
  startForm: FormGroup;
  personalForm: FormGroup;
  model: any = {};
  isReadOnly;
  cardTypeList;
  branchList;
  currencyList;
  colateralTypeList;
  stateList;
  countyList;
  phoneType;
  assetTypeList;
  idTypeList;
  maritalStatusList;
  empTypeList;
  empStatusList;
  incomeTypeList;
  incomeFrequencyList;
  alert: {};
  loanType;
  coApplicantindex;
  loanProduct;
  loanPurchaseType;
  collateralItem;
  loanPurpose;
  tempLoanProduct;
  tempCollateralItem;
  cityList;
  tempLoanPurpose;
  loanFinance;
  notSpecified;
  countryList;
  listItems;
  idIssuingCountryList;
  states;
  state;
  showVINNumber;
  genderList;
  prefixList;
  suffixList;
  hasCollateral;
  pepRelationList;
  occupationList;
  empSectorList;
  incomeSourceList;
  purchaseTypeList;

  // code added by Akash Arora for financial details
  financialAssetDetails;


  constructor(private journeyService: JourneyService, private messageService: MessageService, private formBuilder: FormBuilder,
    private _route: Router, private summaryService: SummaryService, public persistenceService: PersistanceService, public dialog: MatDialog) {
    this.journeyService.setStepper(4);
    let currentStep = 4;
    this.messageService.sendStepper(currentStep);
  }

  // ngOnInit() {
  //   this.initModel();
  //   //this.initViewCollateralDetails();
  //   this.initViewPersonalDetails();
  //   this.initViewAddressDetails();
  //   this.isReadOnly = true;
  // };
  ngOnInit() {
    try {
      //this.initViewCollateralDetails();
      this.initModel();
      this.isReadOnly = true;
    }
    catch (exception) {
      console.log(exception.message)
    }
  };
  initModel() {
    try {
      this.notSpecified = "Not Specified";
      this.listItems = {
        monthsList: this.summaryService.getDropdownMonths(),
        yearsList: this.summaryService.getDropdownYears(),
        countryList: this.summaryService.getIssueingCountry(),
        stateList: this.summaryService.getState(),
        cityList: this.summaryService.getCity(),
        idIssueStateList: this.summaryService.getIssueingState(),
        idTypeList: this.summaryService.getIdType(),
        maritalStatusList: this.summaryService.getMaritalStatus(),
        countyList: this.summaryService.getCounty(),
        phoneType: this.summaryService.getPhoneType(),
        ownOrRentList: this.summaryService.getownOrRent(),
        empTypeList: this.summaryService.getEmpType(),
        empStatusList: this.summaryService.getEmpStatus(),
        incomeTypeList: this.summaryService.getIncomeType(),
        incomeFrequencyList: this.summaryService.getIncomeFrequency(),
        purchaseTypeList: this.summaryService.getPurchaseTypeList(),
        assetType: this.summaryService.getAssetType(),
        genderList: this.summaryService.getGender(),
        prefixList: this.summaryService.getPrefix(),
        suffixList: this.summaryService.getSuffix(),
        pepRelationList: this.summaryService.getPEPRelationList(),
        occupationList: this.summaryService.getOccupationList(),
        empSectorList: this.summaryService.getEmpSectorList(),
        incomeSourceList: this.summaryService.getIncomeSourceList(),
        validationValues: this.summaryService.getApplicantValidationValues(),
        commonResidenceTypes: this.getCommonResidenceTypeList(),
        idIssuingCountryList: this.summaryService.getCountryList(),
        jobTitleList: this.summaryService.getJobTitleList(),
        businessTypeList: this.summaryService.getBusinessType(),
        highestEducationList: this.summaryService.getHighestEducationList(),
        familyRelationshipList: this.summaryService.getFamilyRelationship(),
        loanPurposeList: this.summaryService.getLoanPurposeList(),
        dependentList: this.summaryService.getDependentList(),
        loanRelationshipList: this.summaryService.getLoanRelationshipList(),
        accountTypeList: this.summaryService.getAccountTypeList()

      }
      this.getPrimaryApplicant();
      this.getCoApplicantData();


      // code added by Akash Arora for financial details
      this.model.financialAssetDetails = this.journeyService.getFinanceTypeList();


      this.model.loanDetails = this.journeyService.getFromStorage().loanDetails;
      if (this.model.loanDetails) {
        this.loanProduct = this.model.loanDetails.loanProduct;
        this.hasCollateral = this.model.loanDetails.hasCollateral;
        // let loanTypes = this.journeyService.getLoanType();
        // let loanProducts = this.journeyService.getLoanProductType();
        // let loanPurposeList = this.journeyService.getLoanPurposeList(this.model.loanDetails.loanProduct);
        let loanPurposeList = this.journeyService.getLoanPurposeList();
        this.cardTypeList = this.journeyService.getCardType();
        this.branchList = this.journeyService.getBranchList();
        let hasCollateralList = [{ code: "Yes", label: "Yes" }, { code: "No", label: "No" }];
        this.currencyList = [{ code: "USD", label: "USD" }, { code: "BSD", label: "BSD" }];
        this.colateralTypeList = this.journeyService.getCollateralTypeList();

        //subhasree
        // this.model.loanDetails.loanProduct = this.journeyService.getLabelFromCode(loanProducts, this.model.loanDetails.loanProduct);
        // if ((this.model.loanDetails.loanType = !'CreditCard') && (this.model.loanDetails.loanType = !'OverdraftFacility')) {
        //   this.model.loanDetails.loanPurposeType = this.journeyService.getLabelFromCode(loanPurposeList, this.model.loanDetails.loanPurposeType);
        // }


        if (this.model.loanDetails.hasCollateral === 'Yes') {
          this.model.loanDetails.collateralType = this.journeyService.getLabelFromCode(this.colateralTypeList, this.model.loanDetails.collateralType);
          this.model.loanDetails.currency = this.journeyService.getLabelFromCode(this.currencyList, this.model.loanDetails.currency);
        }
        this.model.loanDetails.hasCollateral = this.model.loanDetails.hasCollateral ? this.journeyService.getLabelFromCode(hasCollateralList, this.model.loanDetails.hasCollateral) : null;
        this.model.loanDetails.loanType = this.model.loanDetails.loanType ? this.model.loanDetails.loanType : null;
        this.model.loanDetails.loanPurposeType = this.model.loanDetails.loanPurposeType ? this.journeyService.getLabelFromCode(loanPurposeList, this.model.loanDetails.loanPurposeType) : null;

        //credit card details
        if (this.model.loanDetails.creditCardDetails && this.model.loanDetails.creditCardDetails.length > 0) {
          this.model.loanDetails.creditCardDetails.forEach(element => {
            element.branch = element.branch ? this.journeyService.getLabelFromCode(this.branchList, element.branch) : null;
            element.cardType = element.cardType ? this.journeyService.getLabelFromCode(this.cardTypeList, element.cardType) : null;
          });
        }

        //overdraft details
        if (this.model.loanDetails.overdraftDetails && this.model.loanDetails.overdraftDetails.length > 0) {
          this.model.loanDetails.overdraftDetails.forEach(element => {
            element.overdraftPurpose = element.overdraftPurpose ? this.journeyService.getLabelFromCode(this.listItems.loanPurposeList, element.overdraftPurpose) : null;
          });
        }

      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getPrimaryApplicant() {
    try {
      //subhasree
      this.model.applicant = this.summaryService.getPrimaryApplicantModel();
      this.model.applicant = this.setDropDownData(this.model.applicant);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getCoApplicantData() {
    try {
      this.model.coApplicants = this.summaryService.getCoApplicantModel();
      this.model.coApplicants.forEach(coApplicant => {
        coApplicant = this.setDropDownData(coApplicant);
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  formatDate(value) {
    return (value < 10 ? '0' + value : value);
  };

  setDropDownData(applicant) {

    //subhasree
    try {
      //for basic details
      applicant.gender = applicant.gender ? this.journeyService.getLabelFromCode(this.listItems.genderList, applicant.gender) : null;
      applicant.prefix = applicant.prefix ? this.journeyService.getLabelFromCode(this.listItems.prefixList, applicant.prefix) : null;
      // applicant.suffix = applicant.suffix ? this.journeyService.getLabelFromCode(this.listItems.suffixList, applicant.suffix) : null;
      applicant.idType = applicant.idType ? this.journeyService.getLabelFromCode(this.listItems.idTypeList, applicant.idType) : null;
      applicant.citizenship = applicant.citizenship ? this.journeyService.getLabelFromCode(this.listItems.countryList, applicant.citizenship) : null;
      applicant.placeOfBirth = applicant.placeOfBirth ? this.journeyService.getLabelFromCode(this.listItems.countryList, applicant.placeOfBirth) : null;
      applicant.maritalStatus = applicant.maritalStatus ? this.journeyService.getLabelFromCode(this.listItems.maritalStatusList, applicant.maritalStatus) : null;
      applicant.noOfDependent = applicant.noOfDependent ? this.journeyService.getLabelFromCode(this.listItems.dependentList, applicant.noOfDependent) : null;
      applicant.loanRelationship = applicant.loanRelationship ? this.journeyService.getLabelFromCode(this.listItems.loanRelationshipList, applicant.loanRelationship) : null;
      applicant.accountType = applicant.accountType ? this.journeyService.getLabelFromCode(this.listItems.accountTypeList, applicant.accountType) : null;


      if (applicant.idDetails) {
        applicant.idDetails.forEach((id) => {
          id.idIssuingCountry = id.idIssuingCountry ? this.journeyService.getLabelFromCode(this.listItems.countryList, id.idIssuingCountry) : null;
          id.idType = id.idType ? this.journeyService.getLabelFromCode(this.listItems.idTypeList, id.idType) : null;
        });
      }

      //address details
      if (applicant.addressDetails) {
        applicant.addressDetails.addresses.forEach((address) => {
          address.ownOrRent = address.ownOrRent ? this.journeyService.getLabelFromCode(this.listItems.ownOrRentList, address.ownOrRent) : null;
          address.country = address.country ? this.journeyService.getLabelFromCode(this.listItems.countryList, address.country) : null;
        });
      }

      //employment details
      if (applicant.empDetails) {
        applicant.empDetails.forEach((employment) => {

          employment.empType = employment.empType ? this.journeyService.getLabelFromCode(this.listItems.empTypeList, employment.empType) : null;

          if (employment.empDetail && employment.empDetail.jobTitle) {
            employment.empDetail.jobTitle = employment.empDetail.jobTitle ? this.journeyService.getLabelFromCode(this.listItems.jobTitleList, employment.empDetail.jobTitle) : null;
          }

          if (employment.empDetail && employment.empDetail.sector) {
            employment.empDetail.sector = employment.empDetail.sector ? this.journeyService.getLabelFromCode(this.listItems.empSectorList, employment.empDetail.sector) : null;
          }

          if (employment.empDetail && employment.empDetail.businessType) {
            employment.empDetail.businessType = employment.empDetail.businessType ? this.journeyService.getLabelFromCode(this.listItems.businessTypeList, employment.empDetail.businessType) : null;
          }

          if (employment.empDetail && employment.empDetail.highestEducation) {
            employment.empDetail.highestEducation = employment.empDetail.highestEducation ? this.journeyService.getLabelFromCode(this.listItems.highestEducationList, employment.empDetail.highestEducation) : null;
          }

          if (employment.empDetail && employment.empDetail.addresses) {
            employment.empDetail.addresses.forEach(element => {
              element.country = element.country ? this.journeyService.getLabelFromCode(this.listItems.countryList, element.country) : null;
            });
          }
        });
      }

      //income details
      if (applicant.financialDetails.incomeDetails) {
        for (var i = 0; i < applicant.financialDetails.incomeDetails.length; i++) {
          applicant.financialDetails.incomeDetails[i].incomeType = applicant.financialDetails.incomeDetails[i].incomeType ? this.journeyService.getLabelFromCode(this.listItems.incomeTypeList, applicant.financialDetails.incomeDetails[i].incomeType) : null;
          applicant.financialDetails.incomeDetails[i].frequency = applicant.financialDetails.incomeDetails[i].frequency ? this.journeyService.getLabelFromCode(this.listItems.incomeFrequencyList, applicant.financialDetails.incomeDetails[i].frequency) : null;
        }
      }

      //PEP Declaration (Politically Exposed Person)
      if (applicant.politicallyExposedPersonDetails) {
        applicant.politicallyExposedPersonDetails.pepCountry = applicant.politicallyExposedPersonDetails.pepCountry ? this.journeyService.getLabelFromCode(this.listItems.countryList, applicant.politicallyExposedPersonDetails.pepCountry) : null;
        applicant.politicallyExposedPersonDetails.pepRelation = applicant.politicallyExposedPersonDetails.pepRelation ? this.journeyService.getLabelFromCode(this.listItems.pepRelationList, applicant.politicallyExposedPersonDetails.pepRelation) : null;
        // applicant.politicallyExposedPersonDetails.pepSuffix = applicant.politicallyExposedPersonDetails.pepSuffix ? this.journeyService.getLabelFromCode(this.listItems.suffixList, applicant.politicallyExposedPersonDetails.pepSuffix) : null;
      }

      //family details
      // if (applicant.familyDetails) {

      //   applicant.familyDetails.noOfDependent = applicant.familyDetails.noOfDependent ? this.journeyService.getLabelFromCode(this.listItems.dependentList, applicant.familyDetails.noOfDependent) : null;

      //   if (applicant.familyDetails.childrenDetails && applicant.familyDetails.childrenDetails.length > 0) {
      //     applicant.familyDetails.childrenDetails.forEach(element => {
      //       element.relationship = element.relationship ? this.journeyService.getLabelFromCode(this.listItems.familyRelationshipList, element.relationship) : null;
      //     });
      //   }
      // }

      //Reference details
      if (applicant.referenceDetails) {
        applicant.referenceDetails.forEach((reference) => {
          reference.addresses.forEach(address => {
            address.country = address.country ? this.journeyService.getLabelFromCode(this.listItems.countryList, address.country) : null;
          });
        });
      }

      return applicant;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  showAutoDebit(data) {
    return this.journeyService.checkAutoDebit(data);
  }

  deleteCoApplicant(index) {
    try {
      this.coApplicantindex = index;
      let self = this;
      let appData = self.summaryService.getApplicationData();
      let coApplicant = appData.applicants[self.coApplicantindex + 1];

      self.journeyService.deleteData(appData.arn, coApplicant.id).subscribe(
        response => {
          self.model.coApplicants.splice(self.coApplicantindex, 1);
          let applicationData = self.summaryService.getApplicationData();
          applicationData.applicants.splice(self.coApplicantindex + 1, 1);
          self.summaryService.setInStorage(applicationData);
        },
        error => {
          var alertObj = {
            type: "error",
            message: error.message,
            showAlert: true,
            stackTrace: {}
          }
          self.alert = alertObj;
        });
    }
    catch (exception) {
      console.log(exception.message)
    }

  }

  saveAndExitApp() {
    const dialogRef = this.dialog.open(SaveExitConfirmComponent, {
      width: '600px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "Y") {
        this.continue('SAVE');
      }
    });
  }

  // saveAndExitApp() {
  //   try {
  //     let appData = this.journeyService.getFromStorage();
  //     this.journeyService.updateData(appData).subscribe(
  //       response => {
  //         this.journeyService.setInStorage(response);
  //         let preferenceData = {
  //           lastVisitedPage: "REVIEW"
  //         };
  //         this.journeyService.savePreference({
  //           contextObj: preferenceData
  //         }).subscribe(
  //           response => {
  //             this._route.navigate(['journey/save']);
  //           },
  //           error => {
  //             var alertObj = {
  //               type: "error",
  //               message: error.message,
  //               showAlert: true,
  //               stackTrace: {}
  //             }
  //             this.alert = alertObj;
  //           }
  //         )
  //       },
  //       error => {
  //         var alertObj = {
  //           type: "error",
  //           message: error.message,
  //           showAlert: true,
  //           stackTrace: {}
  //         }
  //         this.alert = alertObj;
  //       });
  //   }
  //   catch (exception) {
  //     console.log(exception.message)
  //   }
  // }

  isVLProductType(collateralType) {
    if (collateralType === '026' || collateralType === '030' || collateralType === '005' || collateralType === '032' || collateralType === '038' || collateralType === '047' || collateralType === '048' || collateralType === '003') {
      return true;
    }
    return false;
  }

  isOtherProductType(collateralType) {
    if (collateralType === '026' || collateralType === '030' || collateralType === '015' || collateralType === '028' || collateralType === '049' || collateralType === '036' || collateralType === '000' || collateralType === '037' || collateralType === '054' || collateralType === '004' || collateralType === '031' || collateralType === '034' || collateralType === '027' || collateralType === '025' || collateralType === '006' || collateralType === '012' || collateralType === '005' || collateralType === '032' || collateralType === '038' || collateralType === '047' || collateralType === '048' || collateralType === '003') {
      return true;
    }
    return false;
  }

  continue(action?) {
    try {
      if (environment.isMockingEnabled) {
        this._route.navigate(['journey/consents']);
      } else {
        let appData = this.journeyService.getFromStorage();
        let preferenceData = "REVIEW";

        this.journeyService.savePreference({
          arn: appData.arn,
          lastVisitedPage: preferenceData,
          visitorIP: null,
          saveFlag: action === "SAVE" ? true : false
        }).subscribe((response) => {
          if (response) {
            if (action === "SAVE") {
              this._route.navigate(['journey/save']);
            } else {
              this._route.navigate(['journey/consents']);
            }
          }
        }, error => {
          const alertObj = {
            type: "error",
            message: error.message,
            showAlert: true,
            stackTrace: {}
          }
          this.alert = alertObj;
          window.scroll(0, 0);
        });
      }



    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  back() {
    try {
      // let isAssetMandatory = this.summaryService.isAssetsMandatory();
      // if (isAssetMandatory)
      //   this._route.navigate(['journey/financial-info'])
      // else {
      this._route.navigate(['journey/financial-info'])
    }
    catch (exception) {
      console.log(exception.message)
    }
    // }
  }

  closeError() {
    this.alert = {};
  }

  getCommonResidenceTypeList() {
    return [
      {
        "code": "Home Owner/Buying",
        "label": "Own"
      },
      {
        "code": "Renting Property",
        "label": "Rent"
      },
      {
        "code": "Living with Parents",
        "label": "family"
      }
    ]
  }
}
