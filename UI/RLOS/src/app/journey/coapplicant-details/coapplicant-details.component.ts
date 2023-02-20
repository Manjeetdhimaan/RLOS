import { Component, OnInit, ViewChild, Output, EventEmitter, NgZone, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {  MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';

import { JourneyService } from '../_root/journey.service';
import { CoapplicantDetailsService } from './coapplicant-details.service';
import { AddCoApplicantDialog } from '../common/overlays/add-coapplicant/add-coapplicant.component';
import { PersistanceService } from '../../core/services';
import { MessageService } from '../../shared';
import { DOMHelperService } from '../../shared';
import { environment } from 'environments/environment';
import { SaveExitConfirmComponent } from '../common/overlays';

@Component({
  selector: 'app-coapplicant-details',
  templateUrl: './coapplicant-details.component.html',
  styleUrls: ['./coapplicant-details.component.scss']
})
export class CoapplicantDetailsComponent implements OnInit {
  @ViewChild('tab1') tab1;
  @ViewChild('tab2') tab2;
  @ViewChild('tab3') tab3;
  @ViewChild('tab4') tab4;
  @ViewChild('tab5') tab5;
  @ViewChild('tabs') tabs: MatTabGroup;
  @Output() selectedTabChange: EventEmitter<MatTabChangeEvent>
  @Output() setCurrentStep: EventEmitter<any> = new EventEmitter<any>();
  personalForm: FormGroup;
  formControls;
  selectedTab;
  tabDataList;
  listItems;
  invalidTab;
  index: number;
  alert: {};
  isValidForm;
  uspsAddress: any;
  applicantDTO;
  isContinueClicked;
  nextIndex;
  nextTabIndex;
  isTabChanged;
  showAlert;
  maxCoApplicants: number = 4;
  constructor(private change: ChangeDetectorRef, private zone: NgZone, private journeyService: JourneyService, private coApplicantDetailService: CoapplicantDetailsService, private _route: Router, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, public dialog: MatDialog, private translate: TranslateService, private persistenceService: PersistanceService, private messageService: MessageService, private _dom: DOMHelperService) {
    this.showAlert = false;
    this.journeyService.setStepper(2);
    // this.setCurrentStep.emit({ currentStep: 2 });
    let currentStep = 2;
    this.messageService.sendStepper(currentStep);
  }

  ngOnInit() {
    console.log('hey')
    this.selectedTab = 0;
    this.index = 0;
    this.isValidForm = false;
    this.tabDataList = this.coApplicantDetailService.dtoToModel();
    if (this.tabDataList.length === 0) {
      this.tabDataList.push({ order: 0 });
    }


    this.listItems = {
      relationshipList: this.coApplicantDetailService.getrelationship(),
      yesNoList: ["Yes", "No"],
      suffixList: this.coApplicantDetailService.getSuffix(),
      prefixList: this.coApplicantDetailService.getPrefix(),
      monthsList: this.coApplicantDetailService.getDropdownMonths(),
      countryList: this.coApplicantDetailService.getIssueingCountry(),
      yearsList: this.coApplicantDetailService.getDropdownYears(),
      stateList: this.coApplicantDetailService.getState(),
      ownOrRentList: this.coApplicantDetailService.getownOrRent(),
      idIssueStateList: this.coApplicantDetailService.getIssueingState(),
      countyList: this.coApplicantDetailService.getCounty(),
      phoneType: this.coApplicantDetailService.getPhoneType(),
      empTypeList: this.coApplicantDetailService.getEmpType(),
      empStatusList: this.coApplicantDetailService.getEmpStatus(),
      incomeTypeList: this.coApplicantDetailService.getIncomeType(),
      incomeFrequencyList: this.coApplicantDetailService.getIncomeFrequency(),
      assetType: this.coApplicantDetailService.getAssetType(),
      idTypeList: this.coApplicantDetailService.getIDType(),
      maritalStatusList: this.coApplicantDetailService.getMaritalStatus(),
      genderList: this.coApplicantDetailService.getGender(),
      occupationList: this.coApplicantDetailService.getOccupationList(),
      empSectorList: this.coApplicantDetailService.getEmpSectorList(),
      incomeSourceList: this.coApplicantDetailService.getIncomeSourceList(),
      validationValues: this.coApplicantDetailService.getApplicantValidationValues(),
      cityList: this.coApplicantDetailService.getCity(),
      pepRelationList: this.coApplicantDetailService.getPEPRelationList(),
      estimatedAmountList: this.coApplicantDetailService.getestimatedAmountList(),
      businessTypeList: this.coApplicantDetailService.getBusinessType(),
      jobTitleList: this.coApplicantDetailService.getJobTitleList(),
      highestEducationList: this.coApplicantDetailService.getHighestEducationList(),
      allowedAgeList: this.coApplicantDetailService.getAllowedAgeList(),
      loanRelationshipList: this.coApplicantDetailService.getLoanRelationshipList(),
      accountTypeList: this.coApplicantDetailService.getAccountTypeList(),
    }

    this.setCurrentCoapplicantIndex();
    this.setCurrentTab();

    setTimeout(() => {
      if (this.tabs) {
        this.tabs._handleClick = this.interceptTabChange.bind(this);
      }
    }, 500);
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

  setCurrentCoapplicantIndex() {
    try {
      if (this.activatedRoute.snapshot.params['index']) {
        let coAppIndex = this.activatedRoute.snapshot.params['index'];
        this.index = coAppIndex - 1;
      } else {
        this.index = 0;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

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
        case "FAMILY":
          currentTabIndex = 5;
          break;
        case "REFERENCE":
          currentTabIndex = 6;
          break;
      }
      return currentTabIndex;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  ngAfterViewInit() {
    // console.log('afterViewInit => ', this.tabs.selectedIndex);
  }

  interceptTabChange(tab: MatTab, tabHeader: MatTabHeader, nextTabId: number) {
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
  };

  resetTab(selectedTab) {
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


    }
  }

  // tabClick(event: MouseEvent) {
  //   let el = event.srcElement;
  //   const attr = el.attributes.getNamedItem('class');
  //   if (attr.value.indexOf('mat-tab-label-content') >= 0) {
  //     el = el.parentElement;
  //   }
  //   const tabIndex = el.id.substring(el.id.length - 1);
  //   let isValid = this.validateTabs(parseInt(tabIndex));
  //   if (isValid) {
  //     this.selectedTab = parseInt(tabIndex);
  //   }
  //   else {
  //     this.selectedTab = this.invalidTab;
  //     this.invalidTab = null;
  //   }
  //   return isValid && MatTabGroup.prototype._handleClick.apply(this.tabs, arguments);
  // }

  checkTabName(tabIndex) {
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
    }
    return currentTabName;
  }

  checkUniqueDataWithPrimary(applicants, tabData) {
    let currentTabName = this.checkTabName(this.selectedTab);
    if (currentTabName === "BASIC" || currentTabName === "ADDRESS") {
      var alertObj = {};
      let errorsList = [];
      let isSamePhone = [];
      let isSameEmail = [];
      let isSameSSN = [];
      let coApplicant = [];
      let applicant = [];
      let applicantSSN;
      let applicantEmail;
      if (tabData.data.basicDetails) {

        if (applicants.length > 1) {
          applicants.forEach(element => {
            if (element.type === "CO_APPLICANT") {
              coApplicant.push(element);
            }
            if (element.type === "PRIMARY") {
              applicantSSN = element.ssn;
              applicantEmail = element.email;
              applicant.push(element);
            }
          });
          isSameSSN = coApplicant.filter(element => {
            if (element.ssn) {
              return applicantSSN === this.coApplicantDetailService.updateSSNFormat(element.ssn);
            }
          });

          isSameSSN = applicant.filter(element => {
            if (element.ssn && tabData.data.basicDetails.ssn) {
              return element.ssn === this.coApplicantDetailService.updateSSNFormat(tabData.data.basicDetails.ssn);
            }
          });

          isSameEmail = coApplicant.filter(element => {
            if (element.email) {
              return applicantEmail === element.email;
            }
          });

          isSameEmail = applicant.filter(element => {
            if (element.email && tabData.data.basicDetails.email) {
              return element.email === tabData.data.basicDetails.email;
            }
          });
        }
        else {
          isSameSSN = applicants.filter(element => {
            if (tabData.data.basicDetails.ssn) {
              return element.ssn === this.coApplicantDetailService.updateSSNFormat(tabData.data.basicDetails.ssn);
            }
          });

          isSameEmail = applicants.filter(element => {
            if (element.email) {
              return element.email === tabData.data.basicDetails.email;
            }
          });
        }
      }
      if (tabData.data.addressDetails) {
        isSamePhone = applicants.filter(element => {
          if (element.homePhoneNo) {
            return element.homePhoneNo === this.coApplicantDetailService.updatePhoneFormat(tabData.data.addressDetails.homePhoneNo);
          }
        });
      }
      //subhasree
      // if (isSameEmail.length > 0) {
      //   errorsList.push("Each applicant should have a unique Email; one Email cannot be used for multiple applicants");
      // }
      if (isSameSSN.length > 0) {
        errorsList.push("Each applicant should have a unique SSN; one SSN cannot be used for multiple applicants");
      }
      if (isSamePhone.length > 0) {
        errorsList.push("Each applicant should have a unique Primary Phone Number; one Primary Phone Number cannot be used for multiple applicants");
      }

      alertObj = {
        type: 'error',
        message: "Uniqueness Error",
        showAlert: true,
        fieldErrors: errorsList
      }
      // this.alert = {};
      this.alert = alertObj;
      if (errorsList.length > 0) {
        this.showAlert = true;
        window.scroll(0, 0);
        return false;
      }
    }
    return true;
  }

  saveData(tabData) {
    let isSameSSN = [];
    this.isContinueClicked = tabData.isContinueClicked;
    let appData = this.journeyService.getFromStorage();

    let currentTabName = this.checkTabName(this.selectedTab);
    this.nextIndex = tabData.nextTabIndex;

    let applicants = appData.applicants.filter(applicant => applicant.order !== this.index + 2);
    if (this.checkUniqueData(tabData)) {
      this.alert = {};
      if (!appData.applicants[this.index + 1]) {
        appData.applicants.push({ type: 'CO_APPLICANT' });
      }
      appData.applicants[this.index + 1].isCWBEmployee = tabData.isCWBEmployee ? tabData.isCWBEmployee : appData.applicants[this.index + 1].isCWBEmployee;
      this.applicantDTO = this.coApplicantDetailService.modelToDTO(tabData.data, appData.applicants[this.index + 1], this.index + 2);

      let currentComponentIndex = this.index + 1;
      let preferenceData = "COAPPLICANT_" + currentComponentIndex + "," + currentTabName;

      if (tabData.actionType === 'CONTINUE') {

        // if (tabData.data.documents) {
        //   this.applicantDTO.documents = this.journeyService.updateDocumentsPayload(tabData.data.documents);
        // }
        if (environment.isMockingEnabled) {
          this.alert = {};
          window.scroll(0, 0);
          appData.applicants[this.index + 1] = this.applicantDTO;
          this.journeyService.setInStorage(appData);
          this.tabDataList = this.coApplicantDetailService.dtoToModel();
          if (this.isValidForm && !this.isTabChanged) {
            this.checkForCoapplicant();
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
                appData.applicants[this.index + 1] = response.data;
                this.journeyService.setInStorage(appData);
                this.tabDataList = this.coApplicantDetailService.dtoToModel();
                setTimeout(() => {
                  if (this.tabs) {
                    this.tabs._handleClick = this.interceptTabChange.bind(this);
                  }
                }, 500);
                if (this.isValidForm && !this.isTabChanged) {
                  this.checkForCoapplicant();
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
              this.showAlert = true;
              this.alert = alertObj;
              window.scroll(0,0);
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
            this.showAlert = true;
            this.alert = alertObj;
            window.scroll(0,0);
          });
      }
    }
  }

  getValidationErrorsForApplicant(errors, applicantDTO) {
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


  extractIdScanData(payload) {
    let arn = this.journeyService.getArn();
    this.coApplicantDetailService.extractIdScanData(payload.documents).subscribe(extractedData => {
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
        message: errorObject.message,
        showAlert: true,
        stackTrace: {}
      }
      this.showAlert = true;
      this.alert = alertObj;
      window.scroll(0,0);
    });
  };

  updateIdScanData(data) {
    data = data.ParseImageResult.DriverLicense;

    var dobTemp = data.Birthdate ? data.Birthdate.split('-') : '';
    data.Birthdate = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);
    var expDateTemp = data.ExpirationDate ? data.ExpirationDate.split('-') : '';
    data.ExpirationDate = new Date(expDateTemp[0], expDateTemp[1] - 1, expDateTemp[2]);
    var issueDateTemp = data.IssueDate ? data.IssueDate.split('-') : '';
    data.IssueDate = new Date(issueDateTemp[0], issueDateTemp[1] - 1, issueDateTemp[2]);

    return {
      firstName: data.FirstName,
      lastName: data.LastName,
      middleName: data.MiddleName,
      prefix: !this._dom.isEmpty(data.NamePrefix) ? data.NamePrefix : null,
      dob: data.Birthdate,
      ssn: data.ssn,
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

  toString(object) {
    if (object) {
      return object.toString() + ';';
    } else {
      return "";
    }
  }

  setSelectedTab(tabData) {
    this.selectedTab = tabData.tabIndex;
  };

  goBack(tabData) {
    this.selectedTab = tabData.prevTabIndex;
    this.tabs.selectedIndex = tabData.prevTabIndex;
  };

  back() {
    if (this.index >= 1) {
      this.index -= 1;
      this.selectedTab = 0;
    }
    else {
      this.journeyService.setStepper(1);
      this.showAlert = false;
      const currentStep = 1;
      this.messageService.sendStepper(currentStep);
      this._route.navigate(['/journey/applicant'])
    }
  }

  validateTabs(nextTabId?) {

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
      // this.tab4.submitted = true;
    } else if (this.tab5 && this.tab5.PEP.invalid) {
      isValid = false;
      this.invalidTab = 4;
    }
    // else if (this.tab5 && this.tab5.assetForm.invalid) {
    //   isValid = false;
    //   this.invalidTab = 4;
    //   this.tab5.submitted = true;
    // }
    this.isValidForm = isValid;
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
  };

  validateTabsToMove(nextTabId?) {

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
      // this.tab4.submitted = true;
    } else if (this.tab5 && this.tab5.PEP.invalid) {
      isValid = false;
      this.invalidTab = 4;
      // this.tab4.submitted = true;
    }
    // else if (this.tab5 && this.tab5.assetForm.invalid) {
    //   isValid = false;
    //   this.invalidTab = 4;
    //   this.tab5.submitted = true;
    // }
    return isValid;
  };

  saveApplicantData(selectedTab, nextTabId) {
    // invalidTab = invalidTab ? invalidTab : selectedTab;
    switch (selectedTab) {
      case 0:
        this.tab1.continue(nextTabId, this.isContinueClicked);
        break;

      case 1:
        this.tab2.continue(nextTabId, this.isContinueClicked);
        break;

      case 2:
        this.tab3.continue(nextTabId, this.isContinueClicked);
        break;

      case 3:
        this.tab4.continue(nextTabId, this.isContinueClicked);
        break;

      case 4:
        this.tab5.continue(nextTabId, this.isContinueClicked);
        break;

      // case 4:
      //   this.tab5.continue(nextTabId, this.isContinueClicked);
      //   break;

      // default:
      //   this.tab5.continue(nextTabId, this.isContinueClicked);
      //   break;
    }
  };

  saveAndExitApp() {
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
        }
      }
    });

  }

  continue(value) {
    this.isContinueClicked = true;
    this.isTabChanged = false;
    if (this.validateTabs()) {
      this.isValidForm = true;
    }
  }

  checkForCoapplicant() {
    let appData = this.journeyService.getFromStorage();
    let appConfig = this.persistenceService.getApplicationConfig();
    if (this.tabDataList.length === (parseInt(appConfig.maxCoApplicants) - 1) && this.index === (parseInt(appConfig.maxCoApplicants) - 2) && this.validateTabsToMove() && this.isContinueClicked) {
      this._route.navigate(['journey/loan']);
    }
    else {
      if (this.index < this.tabDataList.length - 1 && this.isContinueClicked) {
        this.selectedTab = 0;
        this.index += 1;
      }
      else if (this.isContinueClicked) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = "600px";
        dialogConfig.data = {
          addAnother: true
        };
        const dialogRef = this.dialog.open(AddCoApplicantDialog, dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
          if (result === "Y") {
            this.index += 1;
            this.tabDataList.push({ order: this.index });
            this.selectedTab = 0;
            setTimeout(() => {
              if (this.tabs) {
                this.tabs._handleClick = this.interceptTabChange.bind(this);
              }
            });
          }
          else if (result === "N") {
            this._route.navigate(['journey/loan']);
          }
        });
      }
      else {
        this.selectedTab = this.selectedTab + 1;
      }
    }
  }

  moveToInvalidTab(event) {
    // this.selectedTab = event.selectedTab;
    // this.tabs.selectedIndex = event.selectedTab;
    // this.zone.run(() => {
    //   this.selectedTab = event.selectedTab;
    //   this.change.detectChanges();
    // });
  }

  // tabChanged(event: MatTabChangeEvent) {
  //   console.log('Tab Changed: ', event);
  //   let textLabel = event.tab.textLabel.toString();
  //   if (textLabel.includes('+')) {
  //   }
  //   return false;
  // }

  closeError() {
    this.alert = {};
    this.showAlert = false;
  }

  showError(tabData) {
    this.alert = tabData.data;
  }


  deleteData(tabData) {
    this.isContinueClicked = tabData.isContinueClicked;
    let appData = this.journeyService.getFromStorage();
    let currentTabName = this.checkTabName(this.selectedTab);
    this.nextIndex = tabData.nextTabIndex;
    this.alert = {};
    if (!appData.applicants[this.index + 1]) {
      appData.applicants.push({ type: 'CO_APPLICANT' });
    }
    appData.applicants[this.index + 1].isCWBEmployee = tabData.isCWBEmployee ? tabData.isCWBEmployee : appData.applicants[this.index + 1].isCWBEmployee;
    this.applicantDTO = this.coApplicantDetailService.modelToDTO(tabData.data, appData.applicants[this.index + 1], this.index + 2);
    let currentComponentIndex = this.index + 1;
    let preferenceData = "COAPPLICANT_" + currentComponentIndex + "," + currentTabName;

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
          appData.applicants[this.index + 1] = response.data;
          this.journeyService.setInStorage(appData);
          this.tabDataList = this.coApplicantDetailService.dtoToModel();
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





}