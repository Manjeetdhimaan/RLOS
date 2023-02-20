import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import {  MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatTabChangeEvent, MatTabGroup, MatTabHeader, MatTab } from '@angular/material/tabs';

import { AuthService } from '../auth.service';
import { LandingPageService } from './landing-page.component.service';
import { ApplicationExistDialog, ExperianDialog } from './../common/overlays';
import { PersistanceService } from '../../../app/core/services/persistence.service';
import { ValidationUtilsService } from '../../../app/core/services';
// import {IMyOptions, IMyInputFieldChanged} from '../../src/my-date-picker/interfaces';
// import { ApplicationExistDialog } from '../common/overlays/application-exist/application-exist.component';
import { DOMHelperService } from '../../shared';

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/directives/format-datepicker';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class LandingPageComponent implements OnInit {
  personalForm: FormGroup;
  formControls;
  public submitted: boolean;
  alert: {};
  isSSNReadOnly;
  invalidDateMessage;
  maxDateDob;
  minDateDob;
  minDateSSN;
  maxDateSSN;
  showAlert;
  startDate;
  refNumber;
  validation;
  basicDetailValues;
  maxLengthSSN;
  showCoApplicantRequiredMsg;
  showInvalidExpDate;
  showInvalidIssueDate;
  ssn;
  encryptedSSN;
  showssn;
  showEvent;
  applicantDTO;
  isReadOnly;
  haveId;
  dialogRef;
  stateList;
  allDupedDates;
  myFilter;
  //   private myDatePickerOptions: IMyOptions = {
  //     dateFormat: 'd.m.yyyy',
  //     height: '34px',
  //     width: '210px',
  //     inline: false
  // };
  public mask = {
    guide: true,
    showMask: false,
    mask: [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/]
  };
  constructor(private authService: AuthService, private validationUtilService: ValidationUtilsService, private _elementRef: ElementRef, private landingPageService: LandingPageService, private _route: Router, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, public dialog: MatDialog, private translate: TranslateService, private _dom: DOMHelperService, private persistanceService: PersistanceService) {
    this.maxDateDob = new Date();
    this.maxDateDob.setFullYear(this.maxDateDob.getFullYear() - 18);
    this.minDateDob = new Date();
    this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);
    this.minDateSSN = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.maxDateSSN = new Date();
    this.maxDateSSN.setFullYear(this.maxDateSSN.getFullYear() + 100);
    this.showAlert = false;
    this.allDupedDates = [
      new Date('2019-04-30T00:00:00+02:30'),
      new Date('2019-04-28T00:00:00+05:30'),
      new Date('2019-05-21T00:00:00+05:30'),
      new Date('2019-05-23T00:00:00+05:30')
    ]
    this.myFilter = (d: Date): boolean => {
      const day = d.getDay();
      const blockedDates = this.allDupedDates.map(d => d.valueOf());
      return (!blockedDates.includes(d.valueOf())) && day !== 6;
    }
  }

  ngOnInit() {
    // this._route.navigate(['journey/applicant']);

    window.scroll(0, 0);
    let self = this;
    self.createForm();
    // self.stateList = self.authService.getState();
    if (this._dom.isEmpty(self.authService.getLookupFromStorage()) && !this.checkArnAvailable()) {
      self.authService.getLookupData('RLOS')
        .subscribe(resp => {
          self.stateList = self.authService.getState();
          self.stateList = self.stateList.sort((a, b) => a.label > b.label ? 1 : -1);
          self.authService.setLookupInStorage(resp);
        }, error => {
          var alertObj = {
            type: "error",
            message: error.message,
            showAlert: true,
            stackTrace: {}
          }
          self.showAlert = true;
          window.scroll(0, 0);
          self.alert = alertObj;
        });
    }
    else if (!this._dom.isEmpty(self.authService.getLookupFromStorage()) && !this.checkArnAvailable()) {
      // self.createForm();
      self.stateList = self.authService.getState();
      self.stateList = self.stateList.sort((a, b) => a.label > b.label ? 1 : -1);
    }
    else if (!this._dom.isEmpty(self.authService.getLookupFromStorage()) && this.checkArnAvailable()) {
      this._route.navigate(['journey/applicant']);
    }

  }

  createForm() {
    this.showEvent = false;
    this.showssn = true;
    this.basicDetailValues = this.landingPageService.getApplicantValidationValues()
    this.maxLengthSSN = this.basicDetailValues.ssn.find(bdv => bdv.type === "maxlength").value;
    this.personalForm = this.formBuilder.group({
      'id': null,
      'firstName': [null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.firstName))],
      'middleName': [null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.middleName))],
      'lastName': [null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.lastName))],
      'dob': [null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.dob))],
      'email': [null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.email))],
      'confirmEmail': [null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.confirmEmail))],
      'ssn': ['', [Validators.minLength(8)]],
      // 'state': [null, [Validators.required]],
      'type': [null],
      // 'deliveryDate': null
    })
    this.formControls = this.personalForm.controls;

    this.validationUtilService.blockInvalidInput(this.personalForm, this.basicDetailValues);
  };

  openAppExistDialog() {
    const dialogRefAppExist = this.dialog.open(ApplicationExistDialog, {
      width: '500px'
    })
    dialogRefAppExist.afterClosed().subscribe(result => {
      if (result === "Resume") {
        this.persistanceService.setConfig({ state: { context: "JOURNEY" } })
        this._route.navigate(['auth/resume']);
      }
      else if (result === "Reset") {
        this.setFieldsValidity(this.personalForm, false);
        this.resetForm();
      }
    });

  };

  getValidationErrors(errors) {
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

  toString(object) {
    if (object) {
      return object.toString() + ';';
    } else {
      return "";
    }
  }

  setFieldsValidity(formGroup, value) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const abstractControl = formGroup.controls[key];
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        this.setFieldsValidity(abstractControl, value);
      } else {
        abstractControl.touched = value;
      }
    });
  }

  continue() {
    if (this.ssn) {
      this.personalForm.get('ssn').setValue(this.ssn);
    }
    if (this.personalForm.valid && !this.showCoApplicantRequiredMsg) {
      var searchAttribute = {
        ssn: this.personalForm.value.ssn || this.ssn,
        dateOfBirth: this.personalForm.value.dob.getFullYear() + '-' + this.formatDate(this.personalForm.value.dob.getMonth() + 1) + '-' + this.formatDate(this.personalForm.value.dob.getDate()),
        arn: this.personalForm.value.arn || null,
        context: "JOURNEY"
      }
      if (searchAttribute && searchAttribute.ssn) {
        searchAttribute.ssn = this.landingPageService.updateSSNFormat(searchAttribute.ssn);
      }

      const appAttribute = {
        email: this.personalForm.value.email,
        firstName: this.personalForm.value.firstName,
        lastName: this.personalForm.value.lastName,
        loanType: this.persistanceService.getFromStorage("APP").loanDetails.loanProduct,
        nib: this.personalForm.value.ssn || this.ssn,
      }

      if (appAttribute && appAttribute.nib) {
        appAttribute.nib = this.landingPageService.updateSSNFormat(appAttribute.nib);
      }

      this.persistanceService.ValidateApplication(appAttribute).subscribe(
        response => {
          if (response && response.status === 200) {
            this.authService.validateApplicationWithIBPS(searchAttribute).subscribe(
              response => {
                if (response && response.status === 200) {
                  this.saveData({
                    data: { basicDetails: this.personalForm.value }
                  });
                }
                if (response && response.status === 204) {
                  var alertObj = {
                    type: 'error',
                    message: "Application already exist for this SSN and DOB",
                    showAlert: true,
                    stackTrace: {}
                  }
                  this.showAlert = true;
                  window.scroll(0, 0);
                  this.alert = alertObj;
                }
              }, error => {
                if (error.error.exceptionCode === 1017) {
                  this.saveData({
                    data: { basicDetails: this.personalForm.value }
                  });
                }
                else {
                  var alertObj = {
                    type: "error",
                    message: 'Some error occured, please contact support',
                    ////exceptionCode: error.exceptionCode,
                    showAlert: true,
                    stackTrace: error.stackTrace
                  }
                  this.showAlert = true;
                  window.scroll(0, 0);
                  this.alert = alertObj;
                }
              })
          }
          if (response && response.status === 500) {
            var alertObj = {
              type: 'error',
              message: "Application already exist for this Email Address",
              showAlert: true,
              stackTrace: {}
            }
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          }
        }, error => {
          if (error && error.status === 403) {
            var alertObj = {
              type: "error",
              message: "You have an existing application under process, to complete the application, please visit the dashboard using the link sent to you via email",
              showAlert: true,
              stackTrace: error.stackTrace
            }
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          }
        });
    } else {
      this.submitted = true;
      this.validationUtilService.markFormGroupTouched(this.personalForm);
      this._dom.moveToInvalidField(this._elementRef);
    }
  }

  saveData(tabData) {
    let appData = this.persistanceService.getFromStorage("APP");
    if (!appData) {
      appData = {
        applicants: [{ type: 'PRIMARY' }],
        preferences: null
      }
    }

    this.applicantDTO = this.landingPageService.modelToDTO(tabData.data, appData.applicants[0]);

    let preferenceData = {
      lastVisitedPage: "LANDING_PAGE"
    }

    let applicationDTO = Object.assign({}, appData);
    // applicationDTO.preferences = {
    //   lastVisitedPage: "LANDING_PAGE"
    // }
    this.persistanceService.saveData(applicationDTO).subscribe(
      response => {
        this.persistanceService.setInStorage("APP", response);
        this.persistanceService.setARNInStorage(response.arn);
        this.alert = {};
        this.persistanceService.savePreference({
          contextObj: preferenceData
        }).subscribe(
          response => {
            window.scroll(0, 0);
            this.alert = {};
            this._route.navigate(['journey/applicant']);
          }, error => {
            var alertObj = {
              type: "error",
              message: error.message,
              showAlert: true,
              stackTrace: {}
            }
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          });

      }, error => {
        var alertObj = {};
        if (error.error.exceptionCode === 1001) {
          alertObj = {
            type: 'error',
            message: 'Some error occured, please contact support',
            //exceptionCode: error.error.exceptionCode,
            showAlert: true,
            fieldErrors: this.getValidationErrors(error.error.fieldErrors)
          }
        }
        else if (error.error.exceptionCode === 1007) {
          setTimeout(() => {
            this.openAppExistDialog();
          }, 500);
        }
        else {
          alertObj = {
            type: 'error',
            message: 'Some error occured, please contact support',
            //exceptionCode: error.error.exceptionCode,
            showAlert: true,
            stackTrace: error.error.stackTrace
          }
        }
        this.alert = {};
        this.showAlert = true;
        window.scroll(0, 0);
        this.alert = alertObj;
      });
  };



  closeError() {
    this.alert = {};
    this.showAlert = false;
  }

  enableInputBox() {
    this.showEvent = false;
    this.showssn = true;
    setTimeout(() => {
      let element: HTMLElement = document.getElementById('ssn') as HTMLElement;
      element.click();
    });
  }

  ngAfterViewInit() {
    window.scroll(0, 0);
  }

  onSearchChange(limit) {
    // if (limit) {
    //   let count = event.split("-").length - 1;
    //   if (event.length === 9 && count === 0) {
    //     event = event.slice(0, 3) + "-" + event.slice(3, 5) + "-" + event.slice(5, 9);
    //   }
    //   else if (event.length !== 11) {
    //     event = event.replace(/-/g, "")
    //   }
    //   limit--;
    //   this.personalForm.get('ssn').patchValue(event, { emitEvent: false });
    // }

    if (!limit) {
      return;
    }
    this.onSearchChange(--limit);
  }

  formatDate(value) {
    return (value < 10 ? '0' + value : value);
  };

  checkEmail() {
    let email = this.personalForm.get('email').value;
    let confirmEmail = this.personalForm.get('confirmEmail').value;
    if (email && confirmEmail) {
      if ((email.toLowerCase() !== confirmEmail.toLowerCase())) {
        this.personalForm.get('confirmEmail').setErrors({ notUnique: true });
      } else {
        if (this.personalForm.get('confirmEmail').errors)
          this.personalForm.get('confirmEmail').setErrors(null);
      }
    }
  }

  calculcateAge(event) {
    if (event.value) {
      this.showCoApplicantRequiredMsg = false;
      if ((new Date()) > new Date(event.value)) {
        var diff_ms = Date.now() - (new Date(event.value)).getTime();
        var age_dt = new Date(diff_ms);
        let age = Math.abs(age_dt.getUTCFullYear() - 1970);
        if (age < 18) {
          this.showCoApplicantRequiredMsg = true;
          this.translate.get('application.applicant.dob.validation.numberRange',
            { value: '18' }).subscribe((text: string) => {
              // this.invalidDateMessage = text;
              // this.personalForm.controls['dob'].setErrors({ 'INVALID': true });
            });
        }
        else
          this.showCoApplicantRequiredMsg = false;
        // this.invalidDateMessage = null;
        // this.personalForm.controls['dob'].setErrors(null);}
      }
      else {
        if (this.personalForm) {
          this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
          this.showCoApplicantRequiredMsg = false;
        }
      }
    }
    else if (event.target && event.target.value) {
      this.showCoApplicantRequiredMsg = false;
      if ((new Date()) > new Date(event.target.value)) {

        var diff_ms = Date.now() - (new Date(event.target.value)).getTime();
        var age_dt = new Date(diff_ms);
        let age = Math.abs(age_dt.getUTCFullYear() - 1970);
        if (age < 18) {
          this.showCoApplicantRequiredMsg = true;
        }
        else
          this.showCoApplicantRequiredMsg = false;
      }
      else {
        if (this.personalForm) {
          this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
          this.showCoApplicantRequiredMsg = false;
        }
      }
    }
    else {
      if (this.personalForm) {
        this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
        this.showCoApplicantRequiredMsg = false;
      }
    }
  }

  calculcateAgeFromInputChange(event) {
    if (event.target && event.target.value) {
      this.showCoApplicantRequiredMsg = false;
      if ((new Date()) > new Date(event.target.value)) {

        var diff_ms = Date.now() - (new Date(event.target.value)).getTime();
        var age_dt = new Date(diff_ms);
        let age = Math.abs(age_dt.getUTCFullYear() - 1970);
        if (age < 18) {
          this.showCoApplicantRequiredMsg = true;
        }
        else
          this.showCoApplicantRequiredMsg = false;
      }
      else {
        if (this.personalForm) {
          this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
          this.showCoApplicantRequiredMsg = false;
        }
      }
    }
    else {
      if (this.personalForm) {
        this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
        this.showCoApplicantRequiredMsg = false;
      }
    }
  }

  maskSSN(value) {
    if (value.length === 10) {
      this.ssn = value;
      this.encryptedSSN = value.replace(/[0-9]/g, "X");
      this.showEvent = true;
      this.showssn = false;
    } else {
      this.ssn = null;
    }
  }

  checkArnAvailable() {
    let appData = this.persistanceService.getFromStorage("APP");
    if (appData && appData.arn) {
      return true;
    } else {
      return false;
    }
  }

  isAlreadyExist(appData) {
    if (appData && !appData.applicants[0].isAlreadyExist) {
      if (appData.applicants[0].addressDetails && appData.applicants[0].addressDetails.addresses[0].state !== "TX")
        return false;
    }
    return true;
  }

  resetForm() {
    this.personalForm.reset();
    this.encryptedSSN = null;
    this.showEvent = false;
    this.showssn = true;
    this.ssn = null;
    this.showCoApplicantRequiredMsg = false;
    this.showInvalidExpDate = false;
    this.showInvalidIssueDate = false;
    this.submitted = true;
    this.showAlert = false;
  }
}
