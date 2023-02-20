/*--Core Dependencies--*/
import { Component, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { PersistanceService } from '../../../core/services/persistence.service';
/*--Application Dependencies--*/
//import {AuthInfoActions} from '../state/actions';
import { ValidationUtilsService } from '../../../core/services/validation-utils.service';
import { NullAstVisitor } from '@angular/compiler';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { environment } from 'environments/environment';

import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/directives/format-datepicker';
import { SecurityOverlay } from 'src/app/auth/status/overlay/security-dialog.component'; import { DOMHelperService } from 'src/app/shared';
;


declare var require: any;
@Component({
  selector: 'app-otpAuth',
  templateUrl: './otp-auth.component.html',
  styleUrls: ['./otp-auth.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class OtpAuthComponent implements OnInit {

  resumeForm: FormGroup;
  private _formControls: any;
  public submitted: boolean;
  minDateDob;
  maxDateDob;
  validation;
  dropdownPlaceHolder;
  isReadOnly;
  resumeValues;
  appStatus: any;
  arnNumber: any;
  ssn;
  encryptedSSN;
  showssn;
  showEvent;
  dob;
  loanTypeList: any;
  alert: {};
  showAlert;
  mockData;

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder, public dialog: MatDialog, private authService: AuthService, private activatedRoute: ActivatedRoute,
    private persistanceService: PersistanceService,
    private validationUtilService: ValidationUtilsService, private _route: Router, private _dom: DOMHelperService, private _elementRef: ElementRef) {

    this.maxDateDob = new Date();
    this.minDateDob = new Date();
    this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);
    this.showAlert = true;

    let lookup = require('src/resources/mocks/mdm.json');
    this.persistanceService.setLookupStorage(lookup);
  }

  ngOnInit() {

    // if (environment.isMockingEnabled) {
    //   let lookup = require('src/resources/mocks/mdm.json');
    //   this.authService.setLookupInStorage(lookup);
    //   // console.log(lookup);
    //   // return lookup;
    // } else {
    //   this.authService.getLookupData()
    //     .subscribe(resp => {
    //       this.authService.setLookupInStorage(resp);
    //     })
    // }
    this.initForm();
    var validationMessages = require('../../../../assets/i18n/auth/en.json');
    this.validation = validationMessages.application.resume;

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
  }

  ngOnDestroy() {
  }

  onSearchChange(limit) {

    if (!limit) {
      return;
    }
    this.onSearchChange(--limit);
  }

  initForm() {

    var validationValues = require('../../../../assets/configs/journey/validation-values.json');
    this.resumeValues = validationValues.application.applicant;
    this.isReadOnly = false;

    this.resumeForm = this.formBuilder.group({
      // 'dob': [null, Validators.required],
      'firstName': [null, Validators.compose(this.validationUtilService.composeValidators(this.resumeValues.firstName))],
      'lastName': [null, Validators.required],
      'email': [null, Validators.compose(this.validationUtilService.composeValidators(this.resumeValues.email))],
      'appNo': [null, Validators.required],
    })
    this._formControls = this.resumeForm.controls;
    this.blockInvalidInput(this.resumeForm, this.resumeValues);
  };

  public blockInvalidInput(group: FormGroup | FormArray, validationValues): void {
    let that = this;
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        that.blockInvalidInput(abstractControl, validationValues);
      } else {
        abstractControl.valueChanges.subscribe(function (value) {
          that.validationUtilService.resetInvalidValue(abstractControl, value, key, that.resumeValues[key]);
        });
      }
    });
  }


  birthDate;
  continue() {

    try {

      if (this.resumeForm.valid) {
        if (environment.isMockingEnabled) {
          this.mockData = require('src/resources/mocks/mock-applicantdata.json');
          let data = { userDetails: this.resumeForm.value };
          // this.birthDate = this.resumeForm.value.dob.getFullYear() + '-' + this.formatDate(this.resumeForm.value.dob.getMonth() + 1) + '-' + this.formatDate(this.resumeForm.value.dob.getDate());

          var searchAttribute = {
            firstName: this.resumeForm.value.firstName,
            lastName: this.resumeForm.value.lastName,
            emailId: this.resumeForm.value.email,
            // dob: this.resumeForm.value.dob,
            appNo: this.resumeForm.value.appNo,
          }

          for (var i = 0; i < this.mockData.length; i++) {
            let mockDob = new Date(this.mockData[i].dob);
            if ((this.mockData[i].firstName === this.resumeForm.value.firstName)
              && (this.mockData[i].lastName === this.resumeForm.value.lastName)
              && (this.mockData[i].emaild === this.resumeForm.value.email)
              && (this.mockData[i].appNo === this.resumeForm.value.appNo)
              && (mockDob.getDate() === this.resumeForm.value.dob.getDate())
              && (mockDob.getMonth() === this.resumeForm.value.dob.getMonth())
              && (mockDob.getFullYear() === this.resumeForm.value.dob.getFullYear())) {
              this.getApplication(searchAttribute);
              break;
            }
            else {
              const alertObj = {
                type: 'error',
                message: "No application found with submitted data",
                showAlert: true,
                stackTrace: {}
              }
              this.showAlert = true;
              window.scroll(0, 0);
              this.alert = alertObj;
            }
          }
          if (this.resumeForm.value.dob != null) {
            // searchAttribute.dob = this.resumeForm.value.dob.getFullYear() + '-' + this.formatDate(this.resumeForm.value.dob.getMonth() + 1) + '-' + this.formatDate(this.resumeForm.value.dob.getDate())
          }
        } else {
          let searchAttribute = {
            firstName: this.resumeForm.value.firstName,
            lastName: this.resumeForm.value.lastName,
            email: this.resumeForm.value.email,
            // dob: this.resumeForm.value.dob.getFullYear() + '-' + this.formatDate(this.resumeForm.value.dob.getMonth() + 1) + '-' + this.formatDate(this.resumeForm.value.dob.getDate()),
            arn: this.resumeForm.value.appNo,
            otp: null
          }

          this.authService.getApplicationDetails(searchAttribute).subscribe((response) => {
            if (response && response.success) {
              this.arnNumber = this.resumeForm.value.appNo;
              if (response['data'] === true && this.arnNumber) {
                this.alert = {};
                this.openDialog(this.arnNumber, searchAttribute);
              } else {
                var alertObj = {
                  type: 'error',
                  message: "Data not found for Application Number: " + this.arnNumber,
                  showAlert: true,
                  stackTrace: {}
                }
                this.alert = alertObj;
                window.scroll(0, 0);
              }
            }
            else
            {
              var alertObj = {
                type: 'error',
                message: "Service is temporarily not available. Please try after some time.",
                showAlert: true,
                stackTrace: {}
              }
              this.alert = alertObj;
              window.scroll(0, 0);
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
            window.scroll(0, 0);
          })
        }

      } else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.resumeForm);
        this._dom.moveToInvalidField(this._elementRef);
      }

    } catch (exception) {
      console.log(exception.message);
    }
  }


  openDialog(arnNumber, searchAttribute) {
    let that = this;
    const dialogRef = that.dialog.open(SecurityOverlay, {
      width: '60vw',
      disableClose: true,
      data: { arnNumber: arnNumber, resumeData: searchAttribute },
      autoFocus: false
    });
  }

  getApplication(searchAttribute) {
    if (environment.isMockingEnabled) {
      this.openDialog(this.arnNumber, this.appStatus);
    }
    else {
      this.authService.validateResume(searchAttribute).subscribe(
        response => {
          if (response && response.success && response.data && response.data.status === 200) {
            let updatedData = this.modifyDashboardData(response.data.body);
            this.persistanceService.setInStorage('APP', updatedData);
            this.openDialog(this.arnNumber, this.appStatus);
          }
          if (response && response.success && response.data && response.data.status === 204) {
            var alertObj = {
              type: 'error',
              message: "Data not found for Application Number: " + this.resumeForm.value.arn,
              showAlert: true,
              stackTrace: {}
            }
            this.alert = alertObj;
          }
        },
        error => {
          var alertObj = {
            type: "error",
            message: error.error.description || error.message,
            showAlert: true,
            stackTrace: {}
          }
          this.alert = alertObj;
        });
    }
  }

  modifiedData;
  modifyDashboardData(data) {
    this.modifiedData = [];
    if (data !== null || data !== undefined) {
      data.forEach(element => {
        if (element.initiationDate !== null) {
          var initiationDate = new Date(element.initiationDate);
          element.initiationDate = initiationDate.getFullYear() + '-' + this.formatDate(initiationDate.getMonth() + 1) + '-' + this.formatDate(initiationDate.getDate() + ' ' + this.formatDate(initiationDate.getHours()) + ':' + this.formatDate(initiationDate.getMinutes()))
        }
        if (element.modifyDate !== null) {
          var modifyDate = new Date(element.modifyDate);
          element.modifyDate = modifyDate.getFullYear() + '-' + this.formatDate(modifyDate.getMonth() + 1) + '-' + this.formatDate(modifyDate.getDate() + ' ' + this.formatDate(modifyDate.getHours()) + ':' + this.formatDate(modifyDate.getMinutes()))
        }
        if (element.appStatus && element.appStatus === 'IN_PROGRESS') {
          element.appStatus = 'IN PROGRESS';
        }
        this.modifiedData.push(element);
      });
      return this.modifiedData;
    }
  }


  closeError() {
    this.alert = {};
  }

  formatDate(value) {
    return (value < 10 ? '0' + value : value);
  };



  checkDateChange(event) {
    let regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/gm;
    if (event.target.value && regex.test(event.target.value)) {
      let timeDiff = (new Date()).getMilliseconds() - (new Date(event.target.value)).getMilliseconds();
      if (timeDiff >= 0 && ((new Date(event.target.value)) > this.minDateDob && (new Date(event.target.value)) < this.maxDateDob)) {
        let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
        if (age > 100) {
          this.resumeForm.get('dob').setErrors({ matDatepickerMax: true });
        }
        else
          this.resumeForm.get('dob').setErrors(null);
      }
      else {
        this.resumeForm.get('dob').setErrors({ matDatepickerMax: true });
      }
    }
    else if (!regex.test(event.target.value) && event.target.value !== "") {
      this.resumeForm.get('dob').setErrors({ matDatepickerMax: true });
    }
    else if (this.resumeForm && this.resumeForm.get('dob').invalid) {
      this.resumeForm.get('dob').setErrors({ matDatepickerMax: true });
    }

  }


}
