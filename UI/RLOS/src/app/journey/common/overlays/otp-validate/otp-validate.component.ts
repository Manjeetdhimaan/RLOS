import { Component, Inject, OnInit, Pipe, PipeTransform } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PersistanceService } from 'src/app/core/services/persistence.service';
import { ValidationUtilsService } from 'src/app/core/services/validation-utils.service';
import { timer, Subscription } from "rxjs";
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-otp-validate',
  templateUrl: './otp-validate.component.html',
  styleUrls: ['./otp-validate.component.scss']
})


export class OtpValidateComponent implements OnInit {

  alert: {};
  showAlert;
  time;
  otpTime;
  resendOtpAfterTime;
  otpValidForInMin;
  otpForm: FormGroup;
  verificationData: any = {};
  public submitted: boolean;
  appConfig;
  disableButtonFlag: boolean;
  enableResenButtonTime;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<OtpValidateComponent, any>,
    private validationUtilService: ValidationUtilsService, private formBuilder: FormBuilder, private persistanceService: PersistanceService) {
    this.appConfig = this.persistanceService.getApplicationConfig();
    this.resendOtpAfterTime = (parseInt(this.appConfig.resendOtpAfter));
    this.otpValidForInMin = (parseInt(this.appConfig.otpValidFor) / 60);
    this.showAlert = false;
  }


  ngOnInit() {
    this.otpTimer();
    this.createForm();
  }

  countDown: Subscription;

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
    this.otpForm = this.formBuilder.group({
      'otp': [null, Validators.required],
    });
    this.verificationData = this.data.verificationData;
  }


  continue(): void {
    if (this.otpForm.valid) {
      let requestObject = Object.assign(this.verificationData, { otp: this.otpForm.value.otp });
      if (environment.isMockingEnabled) {
        this.dialogRef.close({ value: 'valid', otp: this.otpForm.value.otp });
      } else {
        this.persistanceService.validateOtp(requestObject).subscribe((response) => {
          if (response && response.data && response['success'] === true) {
            this.dialogRef.close({ value: 'valid', otp: this.otpForm.value.otp });
          } else if (response && response['success'] === false && response['statusCode'] === 400) {
            const alertObj = {
              type: 'error',
              message: response['errorMessage'] ? response['errorMessage'] : 'One Time Password you have entered has expired',
              showAlert: true,
              stackTrace: {}
            }
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          } else if (response && response['success'] === false && response['statusCode'] === 404) {
            const alertObj = {
              type: 'error',
              message: response['errorMessage'] ? response['errorMessage'] : 'One Time Password is incorrect',
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
            message: 'Some error occured, please contact support',
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
      this.validationUtilService.markFormGroupTouched(this.otpForm);
    }
  }

  resendOTP() {
    if (this.verificationData) {
      this.closeError();
      this.otpForm.reset();
      this.otpForm.clearValidators();
      this.otpForm.updateValueAndValidity();
      if (environment.isMockingEnabled) {
        this.countDown.unsubscribe();
        this.otpTimer();
        const alertObj = {
          type: 'success',
          message: "One Time Password has been re-sent on your email ID",
          showAlert: true,
          stackTrace: {}
        }
        this.showAlert = true;
        window.scroll(0, 0);
        this.alert = alertObj;
      } else {
        this.persistanceService.resendOtp(this.verificationData)
          .subscribe((response) => {
            if (response) {
              this.countDown.unsubscribe();
              this.otpTimer();
              // this.resendOtpAfter();
              const alertObj = {
                type: 'success',
                message: "One Time Password has been re-sent on your email ID",
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
              message: 'Some error occured, please contact support',
              showAlert: true,
              stackTrace: {}
            }
            this.alert = alertObj;
            window.scroll(0, 0);
          });
      }

    }
  }



  closeError() {
    this.showAlert = false;
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
