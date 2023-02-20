import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup, MatTabHeader, MatTab  } from '@angular/material/tabs';

import { JourneyService } from '../_root/journey.service';
import { PersonalInfoService } from './personal-details.service';
import { AddCoApplicantDialog, SaveExitConfirmComponent } from '../common/overlays';
import { PersistanceService } from '../../../app/core/services/persistence.service';
import { environment } from 'environments/environment';
// import { ApplicationExistDialog } from '../common/overlays/application-exist/application-exist.component';
import { DOMHelperService, MessageService } from '../../shared';

@Component({
  selector: 'app-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalInfoComponent implements OnInit {
  @ViewChild('tab1') tab1;
  @ViewChild('tab2') tab2;
  @ViewChild('tab3') tab3;
  @ViewChild('tab4') tab4;
  @ViewChild('tab5') tab5;
  // @ViewChild('tab6') tab6;
  @ViewChild('tab7') tab7;
  @ViewChild('tabs') tabs: MatTabGroup;
  @Input() tabData;
  @Output() selectedTabChange: EventEmitter<MatTabChangeEvent>

  personalForm: FormGroup;
  private formControls;
  selectedTab;
  tabDataList;
  loanType: string;
  listItems;
  alert: {};
  invalidTab;
  public uspsAddress;
  isValidForm;
  isArnAvalible;
  applicantDTO;
  isContinueClicked;
  isTabChanged;
  nextIndex;
  nextTabIndex;
  showAlert;
  genderList;
  pepRelationList;
  employerNumber: any;
  constructor(private journeyService: JourneyService, private personalInfoService: PersonalInfoService, private _route: Router, private formBuilder: FormBuilder, private messageService: MessageService,
    private activatedRoute: ActivatedRoute, public dialog: MatDialog, private translate: TranslateService, private _dom: DOMHelperService, private persistanceService: PersistanceService) {
    this.journeyService.setStepper(1);
    this.showAlert = false;
    let currentStep = 1;
    this.messageService.sendStepper(currentStep);
  }

  ngOnInit() {
    console.log('personal component', this.tabs)
    window.scroll(0, 0);
    this.isValidForm = false;
    try {
      this.listItems = {
        relationshipList: this.personalInfoService.getrelationship(),
        yesNoList: this.personalInfoService.optionList(),
        monthsList: this.personalInfoService.getDropdownMonths(),
        countryList: this.personalInfoService.getIssueingCountry(),
        yearsList: this.personalInfoService.getDropdownYears(),
        stateList: this.personalInfoService.getState(),
        cityList: this.personalInfoService.getCity(),
        idIssueStateList: this.personalInfoService.getIssueingState(),
        countyList: this.personalInfoService.getCounty(),
        phoneType: this.personalInfoService.getPhoneType(),
        ownOrRentList: this.personalInfoService.getownOrRent(),
        empTypeList: this.personalInfoService.getEmpType(),
        empStatusList: this.personalInfoService.getEmpStatus(),
        incomeTypeList: this.personalInfoService.getIncomeType(),
        familyRelationshipList: this.personalInfoService.getFamilyRelationship(),
        incomeFrequencyList: this.personalInfoService.getIncomeFrequency(),
        assetType: this.personalInfoService.getAssetType(),
        idTypeList: this.personalInfoService.getIDType(),
        maritalStatusList: this.personalInfoService.getMaritalStatus(),
        genderList: this.personalInfoService.getGender(),
        suffixList: this.personalInfoService.getSuffix(),
        prefixList: this.personalInfoService.getPrefix(),
        pepRelationList: this.personalInfoService.getPEPRelationList(),
        occupationList: this.personalInfoService.getOccupationList(),
        businessTypeList: this.personalInfoService.getBusinessType(),
        empSectorList: this.personalInfoService.getEmpSectorList(),
        jobTitleList: this.personalInfoService.getJobTitleList(),
        incomeSourceList: this.personalInfoService.getIncomeSourceList(),
        highestEducationList: this.personalInfoService.getHighestEducationList(),
        validationValues: this.personalInfoService.getApplicantValidationValues(),
        allowedAgeList: this.personalInfoService.getAllowedAgeList(),
        accountTypeList: this.personalInfoService.getAccountTypeList(),
        
      }
      this.setCurrentTab();
      this.journeyService.setStepper(1);
      this.tabDataList = this.personalInfoService.dtoToModel();
      this.checkArnAvailable();
      // this.tabs._handleClick = this.interceptTabChange.bind(this);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setCurrentTab() {
    try {
      if (this.activatedRoute.snapshot.params['lastTab']) {
        this.selectedTab = this.getTabIndexFromTabName(this.activatedRoute.snapshot.params['lastTab']);
      } else {
        this.selectedTab = 0;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, nextTabId: number) {
    try {
      this.isContinueClicked = false;
      if (nextTabId < this.selectedTab) {
        this.resetTab(this.selectedTab);
        this.selectedTab = nextTabId;
        return true && MatTabGroup.prototype._handleClick.apply(this.tabs, arguments)
      }
      else {
        let isValid = this.validateTabs(nextTabId);
        this.isTabChanged = true;
        this.nextTabIndex = nextTabId;
        if (isValid) {
          this.selectedTab = nextTabId;
        }
        return isValid && MatTabGroup.prototype._handleClick.apply(this.tabs, arguments);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  getTabIndexFromTabName(tabName) {
    try {
      let currentTabIndex;
      switch (tabName) {
        case "BASIC":
          currentTabIndex = 0;
          break;
        case "ADDRESS":
          currentTabIndex = 1;
          break;
        case "EMPLOYMENT":
          currentTabIndex = 2;
          break;
        case "INCOME":
          currentTabIndex = 3;
          break;
        case "PEP":
          currentTabIndex = 4;
          break;
        // case "FAMILY":
        //   currentTabIndex = 5;
        //   break;
        case "REFERENCE":
          currentTabIndex = 5;
          break;
      }
      return currentTabIndex;
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  checkTabName(tabIndex) {
    try {
      let currentTabName = "";
      switch (tabIndex) {
        case 0:
          currentTabName = "BASIC";
          break;
        case 1:
          currentTabName = "ADDRESS";
          break;
        case 2:
          currentTabName = "EMPLOYMENT";
          break;
        case 3:
          currentTabName = "INCOME";
          break;
        case 4:
          currentTabName = "PEP";
          break;
        // case 5:
        //   currentTabName = "FAMILY";
        //   break;
        case 5:
          currentTabName = "REFERENCE";
          break;
      }
      return currentTabName;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  checkArnAvailable() {
    try {
      let appData = this.journeyService.getFromStorage();
      if (appData && appData.arn) {
        this.isArnAvalible = true;
      } else {
        this.isArnAvalible = false;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  saveData(tabData) {
    try {
      //this.journeyService.setInStorage(tabData.data);
      //this.selectedTab++;
      this.alert = {};
      this.isContinueClicked = tabData.isContinueClicked;
      // let nextTabIndex = tabData.nextTabIndex;
      let appData = this.journeyService.getFromStorage();
      let newApp = false;
      if (!appData.arn) {
        appData.applicants = [{ type: 'PRIMARY' }];
        newApp = true;
      }
      appData.applicants[0].isCWBEmployee = tabData.isCWBEmployee ? tabData.isCWBEmployee : appData.applicants[0].isCWBEmployee;
      this.applicantDTO = this.personalInfoService.modelToDTO(tabData.data, appData.applicants[0]);

      let currentTabName = this.checkTabName(this.selectedTab);
      let preferenceData = "PRIMARY," + currentTabName;


      this.nextIndex = tabData.nextTabIndex;
      let applicationDTO = Object.assign({}, appData);

      if (this.checkUniqueData(tabData)) {
        if (tabData.actionType === 'CONTINUE') {
          let documents = this.journeyService.getFromStorage().applicants[0].documents;
          if (documents) {
            this.applicantDTO.documents = documents;
          }
          if ((environment.isMockingEnabled)) {
            this.alert = {};
            window.scroll(0, 0);
            appData = applicationDTO,
              this.journeyService.setInStorage(appData);
            this.tabDataList = this.personalInfoService.dtoToModel();
            // if (this.selectedTab === 6) {
            //   if (!this.isTabChanged) {
            //     this.checkForCoapplicant();
            //   }
            // }
            if (this.isValidForm) {
              if (!this.isTabChanged) {
                this.checkForCoapplicant();
              }
            }
            else if (this.isContinueClicked) {
              this.selectedTab = this.invalidTab;
              this.invalidTab = null;
            }
            else {
              this.selectedTab = this.nextIndex;
            }
          }
          else {
            this.journeyService.saveAndExitApplication({
              arn: appData.arn,
              applicant: this.applicantDTO,
              actionType: tabData.actionType,
              tabName: tabData.tabName,
              context: preferenceData,
              saveFlag: false
            }).subscribe(
              response => {
                if (response && response.success && response.data) {
                  this.alert = {};
                  window.scroll(0, 0);
                  appData.applicants[0] = response.data;
                  this.journeyService.setInStorage(appData);
                  this.tabDataList = this.personalInfoService.dtoToModel();
                  // if (this.selectedTab === 6) {
                  //   if (!this.isTabChanged) {
                  //     this.checkForCoapplicant();
                  //   }
                  // }
                  if (this.isValidForm) {
                    if (!this.isTabChanged) {
                      this.checkForCoapplicant();
                    }
                  }
                  else if (this.isContinueClicked) {
                    this.selectedTab = this.invalidTab;
                    this.invalidTab = null;
                  }
                  else {
                    this.selectedTab = this.nextIndex;
                  }
                }
              }, errorObject => {
                var alertObj = {};
                if (errorObject.error.exceptionCode === 1001) {
                  alertObj = {
                    type: "error",
                    fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                    message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                    showAlert: true,
                    stackTrace: {}
                  }
                }
                else {
                  alertObj = {
                    type: "error",
                    fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                    message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                    showAlert: true,
                    stackTrace: {}
                  }
                }
                window.scroll(0, 0);
                this.showAlert = true;
                this.alert = alertObj;
              });

          }
        }
        else {
          this.journeyService.saveAndExitApplication({
            arn: appData.arn,
            applicant: this.applicantDTO,
            actionType: tabData.actionType,
            tabName: tabData.tabName,
            context: preferenceData,
            saveFlag: true
          }).subscribe(
            response => {
              this.alert = {};
              this._route.navigate(['journey/save']);
            }, errorObject => {
              var alertObj = {
                type: "error",
                fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                showAlert: true,
                stackTrace: {}
              }
              window.scroll(0, 0);
              this.showAlert = true;
              this.alert = alertObj;
            });
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  getValidationErrors(errors) {
    try {
      let errorsList = [];
      errors.forEach(element => {
        let field = element.field.replace(/[`~!@#$%^&*()_|+\-=?0-9;:'",<>\{\}\[\]\\\/]/gi, '').replace('applicants', 'applicant');
        let validationName = element.message.replace(/[ ]/gi, '');
        validationName = validationName.split('|');
        let path = "application." + field + ".validation." + validationName[0];
        this.translate.get(path, { value: validationName[1] }).subscribe((text: string) => {
          errorsList.push(text);
        });
      });
      return errorsList;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  getValidationErrorsForApplicant(errors, applicantDTO) {
    try {
      let errorsList = [];
      errors.forEach(element => {
        let index = element.field.match(/\d+/g).map(Number)[0];
        let field = element.field.replace(/[`~!@#$%^&*()_|+\-=?0-9;:'",<>\{\}\[\]\\\/]/gi, '');
        if (field.indexOf("emp") > -1) {
          let fieldArr = field.split('.');
          field = "empDetails." + applicantDTO.employmentDetails[index].employmentType + "." + fieldArr[1];
        }
        if (field.indexOf("addressDetails") > -1) {
          let fieldArr = field.split('.');
          field = "addressDetails.address." + fieldArr[1];
        }
        if (field.indexOf("incomeDetails") > -1) {
          let fieldArr = field.split('.');
          field = "incomeDetails." + fieldArr[1];
        }
        if (field.indexOf("assetDetails") > -1) {
          let fieldArr = field.split('.');
          field = "assetDetails." + fieldArr[1];
        }
        let validationName = element.message.replace(/[ ]/gi, '');
        validationName = validationName.split('|');
        let path = "application.applicant." + field + ".validation." + validationName[0];
        this.translate.get(path, { value: validationName[1] }).subscribe((text: string) => {
          errorsList.push(text);
        });
      });
      return errorsList;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  extractIdScanData(payload) {
    try {
      let arn = this.journeyService.getArn();
      this.alert = {};
      this.personalInfoService.extractIdScanData(payload.documents).subscribe(extractedData => {
        if (extractedData.ParseImageResult.ValidationCode.IsValid) {
          let resp = this.updateIdScanData(extractedData);
          this.tab1.fillExtactedData(resp);
          this.tab2.fillExtactedData(resp);
          if (arn && payload.id) {
            this.journeyService.saveDocuments(payload).subscribe((res) => {
            });
          }
        }
      }, errorObject => {
        var alertObj = {
          type: "error",
          fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
          message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
          showAlert: true,
          stackTrace: {}
        }
        this.alert = alertObj;
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  };


  updateIdScanData(data) {
    try {
      data = data.ParseImageResult.DriverLicense;
      var dobTemp = data.Birthdate ? data.Birthdate.split('-') : '';
      data.Birthdate = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);
      var expDateTemp = data.ExpirationDate ? data.ExpirationDate.split('-') : '';
      data.ExpirationDate = new Date(expDateTemp[0], expDateTemp[1] - 1, expDateTemp[2]);
      var issueDateTemp = data.IssueDate ? data.IssueDate.split('-') : '';
      data.IssueDate = new Date(issueDateTemp[0], issueDateTemp[1] - 1, issueDateTemp[2]);

      return {
        // firstName: data.FirstName,
        // lastName: data.LastName,
        // middleName: data.MiddleName,
        prefix: !this._dom.isEmpty(data.NamePrefix) ? data.NamePrefix : null,
        // dob: data.Birthdate,
        // ssn: data.ssn,
        idNumber: data.LicenseNumber,
        idExpDate: data.ExpirationDate,
        idType: "DL",
        idIssueDate: data.IssueDate,
        addressLine1: data.Address1,
        addressLine2: data.Address2,
        city: data.City,
        zipCode: data.IIN,
        state: data.JurisdictionCode
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  toString(object) {
    if (object) {
      return object.toString() + ';';
    } else {
      return "";
    }
  }

  setSelectedTab(tabData) {
    this.selectedTab = tabData.nextTabIndex;
  };

  goBack(tabData) {
    this.selectedTab = tabData.prevTabIndex;
    this.tabs.selectedIndex = tabData.prevTabIndex;
  };

  resetTab(selectedTab) {
    try {
      switch (selectedTab) {
        case 1:
          this.tab2.back();
          break;

        case 2:
          this.tab3.back();
          break;

        case 3:
          this.tab4.back();
          break;

        case 4:
          this.tab5.back();
          break;

        // case 5:
        //   this.tab6.back();
        //   break;

        case 5:
          this.tab7.back();
          break;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  back() {
    try {
      // this._route.navigate(['/journey/get_started'])
      // this.initModel(this.tabData);
      // this.goBack(this.tabData);

      if (this.tab2) {
        this.tab2.back();
      }
      if (this.tab3) {
        this.tab3.back();
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  saveApplicantData(selectedTab, nextTabId) {
    try {
      // invalidTab = invalidTab ? invalidTab : selectedTab;
      switch (selectedTab) {
        case 0:
          this.setFieldsValidity(this.tab1.personalForm, true);
          this.tab1.continue(nextTabId, this.isContinueClicked);
          break;

        case 1:
          this.setFieldsValidity(this.tab2.addressForm, true);
          this.tab2.continue(nextTabId, this.isContinueClicked);
          break;

        case 2:
          this.setFieldsValidity(this.tab3.empForm, true);
          this.tab3.continue(nextTabId, this.isContinueClicked);
          break;

        case 3:
          this.setFieldsValidity(this.tab4.incomeForm, true);
          this.tab4.continue(nextTabId, this.isContinueClicked);
          break;

        case 4:
          this.setFieldsValidity(this.tab5.PEP, true);
          this.tab5.continue(nextTabId, this.isContinueClicked);
          break;
        // case 5:
        //   this.setFieldsValidity(this.tab6.family, true);
        //   this.tab6.continue(nextTabId, this.isContinueClicked);
        //   break;
        case 5:
          this.setFieldsValidity(this.tab7.referenceForm, true);
          this.tab7.continue(nextTabId, this.isContinueClicked);
          break;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  validateTabs(nextTabId?) {
    try {
      let isValid = true;
      if (this.tab1 && this.tab1.personalForm.invalid) {
        isValid = false;
        this.invalidTab = 0;
      } else if (this.tab2 && this.tab2.addressForm.invalid) {
        isValid = false;
        this.invalidTab = 1;
      } else if (this.tab3 && this.tab3.empForm.invalid) {
        isValid = false;
        this.invalidTab = 2;
      } else if (this.tab4 && this.tab4.incomeForm.invalid) {
        isValid = false;
        this.invalidTab = 3;
      } else if (this.tab5 && this.tab5.PEP.invalid) {
        isValid = false;
        this.invalidTab = 4;
      } else if (this.tab7 && this.tab7.referenceForm.invalid) {
        isValid = false;
        this.invalidTab = 5;
        this.tab7.submitted = true;
      }


      let nextTab = 0;
      if (nextTabId && this.invalidTab && this.invalidTab < nextTabId) {
        nextTab = this.invalidTab;
        this.invalidTab = null;
      }
      else {
        nextTab = nextTabId;
      }
      this.saveApplicantData(this.selectedTab, nextTab);

      if (nextTabId < this.selectedTab) { // in case of back to a valid tab
        return true;
      } else {
        return isValid;
      }
    }
    catch (exception) {
      console.log("validationError", exception.message)
    }
  };

  setFieldsValidity(formGroup, value) {
    try {
      Object.keys(formGroup.controls).forEach((key: string) => {
        const abstractControl = formGroup.controls[key];
        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
          this.setFieldsValidity(abstractControl, value);
        } else {
          abstractControl.touched = value;
        }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  saveAndExitApp() {
    try {
      const dialogRef = this.dialog.open(SaveExitConfirmComponent, {
        width: '600px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === "Y") {
          switch (this.selectedTab) {
            case 0:
              this.tab1.saveAndExit();
              break;

            case 1:
              this.tab2.saveAndExit();
              break;

            case 2:
              this.tab3.saveAndExit();
              break;

            case 3:
              this.tab4.saveAndExit();
              break;

            case 4:
              this.tab5.saveAndExit();
              break;

            // case 5:
            //   this.tab6.saveAndExit();
            //   break;

            case 5:
              this.tab7.saveAndExit();
              break;
          }
        }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  continue() {
    try {
      this.isContinueClicked = true;
      this.isTabChanged = false;
      if(!this.validateTabs()){
        this.isValidForm = false;
      }
      if (this.validateTabs()) {
        this.isValidForm = true;
      }
    }
    catch (exception) {
      console.log("error", exception.message)
    }
  }

  checkForCoapplicant() {
    try {
      let appData = this.journeyService.getFromStorage();
      var applicant = appData.applicants.find(x => x.type == "PRIMARY");
      var dobTemp = applicant.dob ? applicant.dob.split('-') : '';
      let dob = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);
      let age = this.calculcateAge(dob);
      if (appData.applicants.length > 1) {
        this.selectedTab = 0;
        this._route.navigate(['journey/coapplicant']);
      }
      else if (this.isContinueClicked) {
        // if (age < 18) {
        //   this.selectedTab = 0;
        //   this._route.navigate(['journey/coapplicant']);
        // }
        // else {
        const dialogRef = this.dialog.open(AddCoApplicantDialog, {
          width: '600px',
          data: { addAnother: false }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === "Y") {
            this._route.navigate(['journey/coapplicant']);
          }
          else if (result === "N") {
            this._route.navigate(['journey/loan']);
          }
        });
        // }
      }
      else {
        this.selectedTab = this.selectedTab + 1;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  calculcateAge(event) {
    try {
      let timeDiff = Math.abs(Date.now() - event);
      let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      return age;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  closeError() {
    try {
      this.alert = {};
      this.showAlert = false;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  showError(tabData) {
    try {
      this.alert = tabData.data;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  deleteData(tabData) {
    this.alert = {};
    let appData = this.journeyService.getFromStorage();
    this.applicantDTO = this.personalInfoService.modelToDTO(tabData.data, appData.applicants[0]);
    let currentTabName = this.checkTabName(this.selectedTab);
    let preferenceData = "PRIMARY," + currentTabName;
    this.nextIndex = tabData.nextTabIndex;
    this.journeyService.deleteApplicantDetails({
      arn: appData.arn,
      applicant: this.applicantDTO,
      actionType: tabData.actionType,
      tabName: tabData.tabName,
      context: preferenceData
    }).subscribe(
      response => {
        if (response && response.success && response.data) {
          this.alert = {};
          window.scroll(0, 0);
          appData.applicants[0] = response.data;
          this.journeyService.setInStorage(appData);
          this.tabDataList = this.personalInfoService.dtoToModel();
        }
      }, errorObject => {
        var alertObj = {
          type: "error",
          fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
          message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
          showAlert: true,
          stackTrace: {}
        }
        window.scroll(0, 0);
        this.showAlert = true;
        this.alert = alertObj;
      });

  }

  checkUniqueData(tabData) {
    const currentTabName = this.checkTabName(this.selectedTab);
    if (currentTabName === "BASIC" || currentTabName === "INCOME") {
      const errorsList = [];
      let isIdTypeListNotUnique: boolean;
      let hasMultiplePrimaryIncome: boolean;
      let noPrimarySourceOfIncome: boolean;

      if (tabData && tabData.data && tabData.data.basicDetails && tabData.data.basicDetails.idDetails) {
        let idTypeList = tabData.data.basicDetails.idDetails;
        isIdTypeListNotUnique = this.journeyService.isIdTypeListNotUnique(idTypeList);
      }

      if (tabData && tabData.data && tabData.data.incomeDetails) {
        let incomeDetails = tabData.data.incomeDetails;
        hasMultiplePrimaryIncome = this.journeyService.hasMultiplePrimaryIncome(incomeDetails);
        noPrimarySourceOfIncome = this.journeyService.noPrimarySourceOfIncome(incomeDetails);
      }

      if (isIdTypeListNotUnique) {
        errorsList.push('Same identification type is already present for the applicant.');
      }

      if (hasMultiplePrimaryIncome) {
        errorsList.push('Applicant can select only one Primary Source of Income');
      }

      if (noPrimarySourceOfIncome) {
        errorsList.push('Please select Primary Source of Income.');
      }

      if (errorsList.length > 0) {
        const alertObj = {
          type: "error",
          message: errorsList[0],
          // fieldErrors: errorsList,
          showAlert: true,
          stackTrace: {}
        }
        window.scroll(0, 0);
        this.showAlert = true;
        this.alert = alertObj;
        return false;
      }
    }
    return true;
  }
  workPhoneNumber(event){
    try {
      this.employerNumber = event;
    } catch (exception) {
      console.log(exception.message)
    }
  }

}
