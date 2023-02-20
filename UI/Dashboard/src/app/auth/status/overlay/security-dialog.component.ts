import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, Pipe, PipeTransform } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { AuthService } from '../../auth.service';
import { element } from '@angular/core/src/render3/instructions';
import { PersistanceService } from 'src/app/core/services/persistence.service';
import { ValidationUtilsService } from '../../../core/services/validation-utils.service';
import { environment } from 'environments/environment';
import { timer, Subscription } from "rxjs";


@Component({
  selector: 'app-security-dialog',
  templateUrl: './security-dialog.component.html',
  styleUrls: ['./security-dialog.component.scss']
})
export class SecurityOverlay implements OnInit {
  resumeForm: FormGroup;
  private _formControls: any;
  count = 0;
  public submitted: boolean;
  appType: any;
  arnNumber: any;
  resumeData: any = {};
  questions = [];
  questionList;
  alert: {};
  resumeValues;
  showAlert;
  otpTime;
  resendOtpAfterTime;
  appConfig;
  disableButtonFlag: boolean;
  enableResenButtonTime;
  otpValidForInMin;
  countDown: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private validationUtilService: ValidationUtilsService, private _route: Router, public dialogRef: MatDialogRef<SecurityOverlay, any>, private formBuilder: FormBuilder, private authService: AuthService, private persistanceService: PersistanceService) {
    this.appConfig = this.persistanceService.getApplicationConfig();
    this.resendOtpAfterTime = (parseInt(this.appConfig.resendOtpAfter));
    this.otpValidForInMin = (parseInt(this.appConfig.otpValidFor) / 60);
    this.showAlert = false;
  }

  ngOnInit() {
    this.otpTimer();
    this.createForm();
  }

  runTimer() {
    this.enableResenButtonTime = (parseInt(this.appConfig.otpValidFor) - parseInt(this.appConfig.resendOtpAfter));
    this.otpTime -= 1;
    if (this.otpTime == this.enableResenButtonTime) {
      this.disableButtonFlag = false;
    }
    if (this.otpTime === 0) {
      const alertObj = {
        type: 'error',
        message: 'One Time Password is expired',
        showAlert: true,
        stackTrace: {}
      }
      this.showAlert = true;
      window.scroll(0, 0);
      this.alert = alertObj;
      this.countDown.unsubscribe();
    }
  }

  otpTimer() {
    this.disableButtonFlag = true;
    this.enableResenButtonTime = (parseInt(this.appConfig.otpValidFor) - parseInt(this.appConfig.resendOtpAfter));
    this.otpTime = parseInt(this.appConfig.otpValidFor);
    this.countDown = timer(0, 1000).subscribe(() => this.runTimer());
  }


  createForm() {
    var validationValues = require('../../../../assets/configs/journey/validation-values.json');
    this.resumeValues = validationValues.application.applicant;

    this.resumeForm = this.formBuilder.group({
      'number': [null, Validators.required],
    })
    this.blockInvalidInput(this.resumeForm, this.resumeValues);
    const that = this;
    this._formControls = this.resumeForm.controls;
    this.arnNumber = this.data.arnNumber;
    this.resumeData = this.data.resumeData;
  }



  continue(): void {
    if (this.resumeForm.valid) {
      if (environment.isMockingEnabled) {
        this.dialogRef.close();
        this._route.navigate(['/auth/dashboard']);
      } else {
        let requestObject = {
          "arn": this.arnNumber,
          "otp": this.resumeForm.value.number
        }
        this.authService.validateOtp(requestObject).subscribe((response) => {
          if (response && response.data && response['success'] === true) {
            let dashboardData = [response.data];
            this.persistanceService.setInStorage("APP", dashboardData);
            this.dialogRef.close();
            this._route.navigate(['/auth/dashboard']);
          } else if (response && response['success'] === false && response['statusCode'] === 400) {
            const alertObj = {
              type: 'error',
              fieldErrors: (response.errorMessageList && response.errorMessageList.length > 0) ? response.errorMessageList : null,
              message: (response && !response.errorMessageList) ? 'Some error occured, please contact support' : null,
              // message: response['errorMessage'],
              showAlert: true,
              stackTrace: {}
            }
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          } else if (response && response['success'] === false && response['statusCode'] === 404) {
            const alertObj = {
              type: 'error',
              fieldErrors: (response.errorMessageList && response.errorMessageList.length > 0) ? response.errorMessageList : null,
              message: (response && !response.errorMessageList) ? 'Some error occured, please contact support' : null,
              // message: response['errorMessage'],
              showAlert: true,
              stackTrace: {}
            }
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          }
        }, error => {
          var alertObj = {
            type: "error",
            message: error.error.description || error.message,
            showAlert: true,
            stackTrace: {}
          }
          this.alert = alertObj;
          this.showAlert = true;
          window.scroll(0, 0);
        });
      }
    } else {
      this.submitted = true;
      this.validationUtilService.markFormGroupTouched(this.resumeForm);
    }
  }

  resendOTP() {
    if (this.resumeData) {
      this.closeError();
      this.resumeForm.reset();
      this.resumeForm.clearValidators();
      this.resumeForm.updateValueAndValidity();
      this.authService.resendOtp(this.resumeData)
        .subscribe((response) => {
          if (response) {
            this.countDown.unsubscribe();
            this.otpTimer();
            const alertObj = {
              type: 'success',
              message: response['statusCode'] === 200 && response['success'] ? "One Time Password has been re-sent on your email ID" : response['errorMessage'],
              showAlert: true,
              stackTrace: {}
            }
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          }
        }, errorObject => {
          var alertObj = {
            type: "error",
            fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
            message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
            // message: error.error.description || error.message,
            showAlert: true,
            stackTrace: {}
          }
          this.alert = alertObj;
          window.scroll(0, 0);
        });
    }
  }




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

  closeError() {
    this.alert = {};
  }
}

@Pipe({
  name: "formatTime"
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    return (
      ("00" + minutes).slice(-2) + " Minute : " + ("00" + Math.floor(value - minutes * 60)).slice(-2) + " Second"
    );
  }
}