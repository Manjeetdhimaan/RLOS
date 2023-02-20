import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CustomerAcceptanceService } from './../_root/customer-acceptance.service';
import { getLocaleDayPeriods } from '@angular/common';
// import { NULL_INJECTOR } from '@angular/core/src/render3/component';
// import { NullTemplateVisitor } from '@angular/compiler';

@Component({
  selector: 'accepted',
  templateUrl: './accepted.component.html',
  styleUrls: ['./accepted.component.scss']
})
export class AcceptedComponent implements OnInit {
  customerAcceptanceForm: FormGroup;
  formControls;
  notSpecified;
  currentPaymentDate;
  maxPaymentDate;
  minPaymentDate;
  amOrPmList;
  model;
  showAutoDebit;
  showInsuranceDetail;
  isESignAllowed;
  hoursList;
  minutesList;
  constructor(private _router: Router, private formBuilder: FormBuilder, private customerAcceptanceService: CustomerAcceptanceService,
    private translate: TranslateService) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.notSpecified = "Not Specified";
    this.minPaymentDate = new Date();
    this.currentPaymentDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    this.maxPaymentDate = new Date(new Date().getTime() + 45 * 24 * 60 * 60 * 1000);
    this.initModel();
    this.amOrPmList = ["AM", "PM"];
    this.showAutoDebit = true;
    this.showInsuranceDetail = true;
    this.isESignAllowed = true;
    this.customerAcceptanceService.getLoanData().subscribe((response) => {
      this.model = response;
      this.showAutoDebit = this.model.isAutoDebit ? this.model.isAutoDebit : false;
      this.isESignAllowed = this.model.isESignAllowed ? this.model.isESignAllowed : false;
      this.showInsuranceDetail = this.model.isInsuranceRequired ? this.model.isInsuranceRequired : false;
      if(!this.isESignAllowed){
        this.customerAcceptanceForm.get('closingMethod').setValue('branch');
      }
      if (this.showAutoDebit) {
        this.customerAcceptanceForm.get('accountNumber').setValidators(Validators.required);
        this.customerAcceptanceForm.get('confirmAccountNumber').setValidators(Validators.required);
        this.customerAcceptanceForm.get('routingNumber').setValidators(Validators.required);
      }
      if (this.showInsuranceDetail) {
        this.customerAcceptanceForm.get('nameOfInsuranceCompany').setValidators(Validators.required);
        this.customerAcceptanceForm.get('policyNumber').setValidators(Validators.required);
        this.customerAcceptanceForm.get('policyStartDate').setValidators(Validators.required);
        this.customerAcceptanceForm.get('policyEndDate').setValidators(Validators.required);
      }
      this.customerAcceptanceForm.get('accountNumber').updateValueAndValidity({ emitEvent: false });
      this.customerAcceptanceForm.get('confirmAccountNumber').updateValueAndValidity({ emitEvent: false });
      this.customerAcceptanceForm.get('routingNumber').updateValueAndValidity({ emitEvent: false });
      this.customerAcceptanceForm.get('nameOfInsuranceCompany').updateValueAndValidity({ emitEvent: false });
      this.customerAcceptanceForm.get('policyNumber').updateValueAndValidity({ emitEvent: false });
      this.customerAcceptanceForm.get('policyStartDate').updateValueAndValidity({ emitEvent: false });
      this.customerAcceptanceForm.get('policyEndDate').updateValueAndValidity({ emitEvent: false });
    })

    this.initStaticData();
  }

  initStaticData(){    
    this.hoursList = this.customerAcceptanceService.getHoursList();
    this.minutesList = this.customerAcceptanceService.getMinutesList();
  }

  initModel() {
    // var validationValues = require('../../../../../assets/validators/journey/validation-values.json');
    // this.; = validationValues.application.loanDetails.collateralTypeDetails.cwbstock;

    this.customerAcceptanceForm = this.formBuilder.group({
      'accountNumber': [null],
      'confirmAccountNumber': [null],
      'firstPaymentDate': [this.currentPaymentDate, Validators.required],
      'nameOfInsuranceCompany': [null],
      'policyStartDate': [null],
      'policyEndDate': [null],
      'policyNumber': [null],
      'routingNumber': [null],
      "preferredDate": [null],
      "closingLocation": [null],
      "timeHour": [null],
      "timeMinute": [null],
      "closingMethod": [null],
      "amOrPm": [null]
    });

    this.formControls = this.customerAcceptanceForm.controls;
    // this.setValidations(this.customerAcceptanceForm);
  }

  // setValidations(_formGroup) {
  //   _formGroup.valueChanges.subscribe((value) => {
  //     value = value.closingMethod;
  //     let preferredDate = _formGroup.controls['preferredDate'],
  //       amOrPM = _formGroup.controls['amOrPM'],
  //       timeMinute = _formGroup.controls['timeMinute'],
  //       timeHour = _formGroup.controls['timeHour'],
  //       closingLocation = _formGroup.controls['closingLocation']


  //     preferredDate.clearValidators();
  //     amOrPM.clearValidators();
  //     timeMinute.clearValidators();
  //     timeHour.clearValidators();
  //     closingLocation.clearValidators();

  //     var validationValues = require('../../../../../assets/validators/journey/validation-values.json');

  //     switch (value) {
  //       case 'Branch':
  //         preferredDate.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.customerAcceptance.preferredDate)));
  //         amOrPM.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.customerAcceptance.amOrPM)));
  //         timeMinute.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.customerAcceptance.timeMinute)));
  //         timeHour.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.customerAcceptance.timeHour)));
  //         closingLocation.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.customerAcceptance.closingLocation)));
  //         break;
  //     }
  //     preferredDate.updateValueAndValidity({ emitEvent: false });
  //     amOrPM.updateValueAndValidity({ emitEvent: false });
  //     timeMinute.updateValueAndValidity({ emitEvent: false });
  //     timeHour.updateValueAndValidity({ emitEvent: false });
  //     closingLocation.updateValueAndValidity({ emitEvent: false });


  //   })



  // };  

  checkAccountNumber() {
    let accountNumber = this.customerAcceptanceForm.get('accountNumber').value;
    let confirmAccountNumber = this.customerAcceptanceForm.get('confirmAccountNumber').value;
    if (accountNumber && confirmAccountNumber) {
      if ((accountNumber.toLowerCase() !== confirmAccountNumber.toLowerCase())) {
        this.customerAcceptanceForm.get('confirmAccountNumber').setErrors({ notUnique: true });
      } else {
        if (this.customerAcceptanceForm.get('confirmAccountNumber').errors)
          this.customerAcceptanceForm.get('confirmAccountNumber').setErrors(null);
      }
    }
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  continue() {
    if (this.customerAcceptanceForm.valid) {
      var preferredDate, firstPaymentDate, policyStartDate, policyEndDate;

      preferredDate = this.convert(this.customerAcceptanceForm.get('preferredDate').value);
      firstPaymentDate = this.convert(this.customerAcceptanceForm.get('firstPaymentDate').value);
      policyStartDate = this.convert(this.customerAcceptanceForm.get('policyStartDate').value);
      policyEndDate = this.convert(this.customerAcceptanceForm.get('policyEndDate').value);
      this.customerAcceptanceForm.get('preferredDate').setValue = preferredDate;
      this.customerAcceptanceForm.get('firstPaymentDate').setValue = firstPaymentDate;
      this.customerAcceptanceForm.get('policyStartDate').setValue = policyStartDate;
      this.customerAcceptanceForm.get('policyEndDate').setValue = policyEndDate;

      var custumerObj = {
        accountNumber: this.customerAcceptanceForm.get('accountNumber').value ? this.customerAcceptanceForm.get('accountNumber').value : null,
        amOrPm: this.customerAcceptanceForm.get('amOrPm').value ? this.customerAcceptanceForm.get('amOrPm').value : null,
        closingLocation: this.customerAcceptanceForm.get('closingLocation').value ? this.customerAcceptanceForm.get('closingLocation').value : null,
        closingMethod: this.customerAcceptanceForm.get('closingMethod').value ? this.customerAcceptanceForm.get('closingMethod').value : null,
        confirmAccountNumber: this.customerAcceptanceForm.get('confirmAccountNumber').value ? this.customerAcceptanceForm.get('confirmAccountNumber').value : null,
        nameOfInsuranceCompany: this.customerAcceptanceForm.get('nameOfInsuranceCompany').value ? this.customerAcceptanceForm.get('nameOfInsuranceCompany').value : null,
        policyNumber: this.customerAcceptanceForm.get('policyNumber').value ? this.customerAcceptanceForm.get('policyNumber').value : null,
        routingNumber: this.customerAcceptanceForm.get('routingNumber').value ? this.customerAcceptanceForm.get('routingNumber').value : null,
        timeHour: this.customerAcceptanceForm.get('timeHour').value ? this.customerAcceptanceForm.get('timeHour').value : null,
        timeMinute: this.customerAcceptanceForm.get('timeMinute').value ? this.customerAcceptanceForm.get('timeMinute').value : null,
        firstPaymentDate: firstPaymentDate ? firstPaymentDate : null,
        policyEndDate: policyEndDate ? policyEndDate : null,
        policyStartDate: policyStartDate ? policyStartDate : null,
        preferredDate: preferredDate ? preferredDate : null
      }

      this.customerAcceptanceService.submitCustomerAcceptance(custumerObj, "ACCEPT").subscribe((response) => {
        let navigationExtras: NavigationExtras = {
          queryParams: { 'status': 'accept' }
        };
        this._router.navigate(['customer-acceptance/complete'], navigationExtras);
      })
    }
  }

}
