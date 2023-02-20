/*--Core Dependencies--*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { PersistanceService } from '../../../core/services/persistence.service';
/*--Application Dependencies--*/
//import {AuthInfoActions} from '../state/actions';
import { ValidationUtilsService } from '../../../core/services/validation-utils.service';
import { AstVisitor } from '@angular/compiler';

declare var require: any;
@Component({
  selector: 'app-otpAuth',
  templateUrl: './otp-auth.component.html',
  styleUrls: ['./otp-auth.component.scss']
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
  ssn;
  encryptedSSN;
  showssn;
  showEvent;
  dob;

  loanTypeList: any;
  alert: {}

  constructor(
    private _router: Router,
    private formBuilder: FormBuilder, private authService: AuthService, private activatedRoute: ActivatedRoute,
    private persistanceService: PersistanceService,
    private validationUtilService: ValidationUtilsService, private _route: Router) {

    this.maxDateDob = new Date();
    this.minDateDob = new Date();
    this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);
  }

  ngOnInit() {
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
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.ssn && params.dob) {
        setTimeout(() => {
          if (params.ssn) {
            this.showEvent = true;
            this.showssn = false;
            this.ssn = params.ssn;
            this.encryptedSSN = params.ssn.replace(/[0-9]/g, "X");
          } else {
            this.showEvent = false;
            this.showssn = true;
          }

          var dobTemp = params.dob ? params.dob.split('-') : '';
          let dob = new Date(dobTemp[0], dobTemp[1] - 1, dobTemp[2]);

          this.resumeForm.get('dob').setValue(dob);
          this.resumeForm.get('ssn').setValue(params.ssn);
        }, 500);
      } else {
        this.showEvent = false;
        this.showssn = true;
      }
    });
  }

  ngOnDestroy() {
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

  initForm() {
    var validationValues = require('../../../../assets/validators/journey/validation-values.json');
    this.resumeValues = validationValues.application.applicant;
    this.isReadOnly = false;
    let appData = this.persistanceService.getFromJourneyStorage();
    let arn = null;
    if (appData && appData.arn) {
      this.isReadOnly = true;
      arn = appData.arn;
    }

    this.resumeForm = this.formBuilder.group({
      'dob': [null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.applicant.dob))],
      'ssn': [null, [Validators.required, Validators.minLength(9)]],
      'arn': [this.updateARNReformat(arn), [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
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

  maskSSN(value) {
    if (value.length === 11) {
      this.ssn = value;
      this.encryptedSSN = value.replace(/[0-9]/g, "X");
      this.showEvent = true;
      this.showssn = false;
    }
  }

  onARNChange(event, limit) {
    if (limit) {
      let count = event.split("-").length - 1;
      if (event.length === 12 && count === 0) {
        event = event.slice(0, 8) + "-" + event.slice(8, 12);
      }
      else if (event.length !== 13) {
        event = event.replace(/-/g, "")
      }
      limit--;
      this.resumeForm.get('arn').patchValue(event, { emitEvent: false });
    }
  }

  continue() {
    if (this.resumeForm.valid) {
      var searchAttribute = {
        ssn: this.resumeForm.value.ssn || this.ssn,
        dateOfBirth: this.resumeForm.value.dob.getFullYear() + '-' + this.formatDate(this.resumeForm.value.dob.getMonth() + 1) + '-' + this.formatDate(this.resumeForm.value.dob.getDate()),
        arn: this.updateARNFormat(this.resumeForm.value.arn),
        context: null
      }
      searchAttribute.ssn = this.updateSSNFormat(searchAttribute.ssn);
      if (this.persistanceService.getConfig()) {
        let context = this.persistanceService.getConfig().state.context;
        if (context === 'CUSTOMER_ACCEPTANCE' || context === 'DOCUMENTS') {
          searchAttribute.context = context;
          this.authService.validateApplicationWithIBPS(searchAttribute).subscribe(
            response => {
              if (response && response.status === 200) {
                this.persistanceService.setInJourneyStorage(response.body);
                this.persistanceService.setARNInStorage(response.body.arn);
                if (context === "CUSTOMER_ACCEPTANCE") {
                  this._route.navigate(['customer-acceptance']);
                }
                else {
                  this._route.navigate(['documents']);
                }
              }
              if (response && response.status === 204) {
                var alertObj = {
                  type: 'error',
                  message: "Data not found for Loan Application Number: " + this.resumeForm.value.arn,
                  showAlert: true,
                  stackTrace: {}
                }
                this.alert = alertObj;
              }
            }, error => {
              var alertObj = {
                type: "error",
                message: 'Some error occured, please contact support',
                ////exceptionCode: error.exceptionCode,
                showAlert: true,
                stackTrace: error.stackTrace
              }
              this.alert = alertObj;
            });
        }
        else {
          this.getApplication(searchAttribute);
        }
        // this._route.navigate(['customer-acceptance']);
      }
      else {
        this.getApplication(searchAttribute);
      }


    } else {
      this.submitted = true;
    }
  }

  getApplication(searchAttribute) {
    let context = this.persistanceService.getConfig() && this.persistanceService.getConfig().state && this.persistanceService.getConfig().state.context ? this.persistanceService.getConfig().state.context : "JOURNEY";
    searchAttribute.context = context;
    this.authService.validateApplication(searchAttribute).subscribe(
      response => {
        if (response && response.status === 200) {
          this.authService.getApplication(response.body.arn).subscribe(
            resp => {
              this.persistanceService.setInJourneyStorage(resp.body);
              this.persistanceService.setARNInStorage(resp.body.arn);

              this.persistanceService.getLookupData('RLOS')
                .subscribe(lookup => {
                  this.persistanceService.setLookupStorage(lookup);
                  if (resp.body.preferences)
                    this.persistanceService.navigateRoute(resp.body.preferences);
                  else
                    this._router.navigate(['/journey/applicant']);
                }, error => {
                  var alertObj = {
                    type: "error",
                    message: 'Some error occured, please contact support',
                    //exceptionCode: error.exceptionCode,
                    showAlert: true,
                    stackTrace: error.stackTrace
                  }
                  this.alert = alertObj;
                });
              // this._router.navigate(['/journey/applicant']);
            },
            error => {
              var alertObj = {
                type: "error",
                message: error.error.description,
                //exceptionCode: error.error.exceptionCode,
                showAlert: true,
                stackTrace: {}
              }
              this.alert = alertObj;
            });
        }
        if (response && response.status === 204) {
          var alertObj = {
            type: 'error',
            message: "Data not found for Loan Application Number: " + this.resumeForm.value.arn,
            showAlert: true,
            stackTrace: {}
          }
          this.alert = alertObj;
        }
      },
      error => {
        var alertObj = {
          type: "error",
          message: 'Some error occured, please contact support',
          showAlert: true,
          stackTrace: {}
        }
        this.alert = alertObj;
      });

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
    else if (event.target.value === "") {
      this.resumeForm.get('dob').setErrors({ required: true });
    }
  }

  updateSSNFormat(ssn) {
    let updatedSSN = "";
    if (ssn.length === 9) {
      updatedSSN = ssn.slice(0, 3) + "-" + ssn.slice(3, 5) + "-" + ssn.slice(5, 9);
    }
    else if (ssn.length === 11) {
      return ssn;
    }
    return updatedSSN;
  }

  updateARNFormat(arn) {
    let updatedARN = "";
    if (arn.length === 12) {
      updatedARN = arn.slice(0, 8) + "-" + arn.slice(8, 12);
    }
    else if (arn.length === 13) {
      return arn;
    }
    return updatedARN;
  }

  updateARNReformat(arn) {
    let updatedARN = null;
    if (arn) {
      if (arn.length === 13) {
        updatedARN = arn.replace('-', '');
      }
      else if (arn.length === 12) {
        return arn;
      }
    }
    return updatedARN;
  }

  // saveData(loginData) {
  //   if (this.resumeForm.valid) {
  //     this.loginService.saveData(loginData);
  //     this._router.navigate(['/journey/get_started']);
  //   } else {
  //     this.submitted = true;
  //   }
  // };

}
