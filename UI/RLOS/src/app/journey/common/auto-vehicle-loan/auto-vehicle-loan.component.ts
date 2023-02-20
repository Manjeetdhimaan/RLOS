import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormArrayName } from '@angular/forms';
// import { nullSafeIsEquivalent } from '@angular/compiler/src/output/output_ast';

import { LoanDetailsService } from '../../loan-details';
// import { LocalizationPipe } from '../../../../../assets/pipes/journey/localization-pipe';
import { ValidationUtilsService } from '../../../core/services';
import { DOMHelperService } from '../../../shared';

declare var require: any;
var jsonpatch = require('fast-json-patch');

@Component({
  selector: 'auto-vehicle-loan',
  templateUrl: './auto-vehicle-loan.component.html',
  styleUrls: ['./auto-vehicle-loan.component.scss']
})

export class AutoVehicleLoanComponent implements OnInit {
  submitted: boolean;
  private formControls;
  autoVehicleLoanForm: FormGroup;
  vehicleLoanValues;


  @Input() formData;
  @Input() isReadOnly;
  @Input() collateralType;
  @Input() financeType;
  @Output() saveData = new EventEmitter();
  @Output() valueChange = new EventEmitter();

  model = {};
  collateralTypeReadOnly = "";
  vehicleYearList;
  conditionTypeList = [];
  financeTypeList = [];
  loanPurposeList = [];
  securityTypeList = [];
  collateralTypeList = [];
  purchaseTypeList = [];
  yesNoList = [];
  payoffTypeList = [];
  dropdownPlaceholder = "Please Select";
  checkObj = {};
  setSourceOfValue = false;
  dummyObj = {
    vehicleModel: "",
    vehicleMake: "",
    collateralValue: "",
    autoMileage: ""
  }

  @Input() showVINNumber;

  constructor(private formBuilder: FormBuilder, private loanDetailsService: LoanDetailsService,
    private validationUtilService: ValidationUtilsService, private _dom: DOMHelperService) {

  }

  ngOnInit() {
    this.showVINNumber = this.showVINNumber ? this.showVINNumber : false;
    this.createForm();
    this.initModel(this.formData);
    this.initStaticData();
    this.collateralTypeReadOnly = this.collateralType;
  };

  initStaticData() {
    this.financeTypeList = this.loanDetailsService.getFinanceTypeList();
    this.loanPurposeList = this.loanDetailsService.getLoanPurposeList();
    this.securityTypeList = this.loanDetailsService.getSecurityTypeList();
    this.collateralTypeList = this.loanDetailsService.getCollateralTypeList();
    this.yesNoList = this.loanDetailsService.getYesNoList();
    this.payoffTypeList = this.loanDetailsService.getPayOffTypeList();
    this.conditionTypeList = this.loanDetailsService.getConditionTypeList();
    this.purchaseTypeList = this.loanDetailsService.getPurchaseTypeList();
    this.vehicleYearList = this.loanDetailsService.getVehicleYearList();
  }

  initModel(formData) {
    if (formData) {
      this.model = formData;

      this.autoVehicleLoanForm.patchValue(formData.collateralTypeDetails);
      this.dummyObj = {
        vehicleModel: formData.collateralTypeDetails.vehicleModel,
        vehicleMake: formData.collateralTypeDetails.vehicleMake,
        collateralValue: formData.collateralTypeDetails.collateralValue,
        autoMileage: formData.collateralTypeDetails.autoMileage

      }
    }
    this.checkLoanFinancyType(this.financeType);
  };

  checkLoanFinancyType(financeType) {
    if (financeType) {
      let vinNumberCtrl = this.autoVehicleLoanForm.get('vehicleVinNumber');
      let autoTrimPackageCtrl = this.autoVehicleLoanForm.get('autoTrimPackage');
      let autoColorCtrl = this.autoVehicleLoanForm.get('autoColor');
      let isTitleRequiredCtrl = this.autoVehicleLoanForm.get('isTitleRequired');
      let isInsuranceRequiredCtrl = this.autoVehicleLoanForm.get('isInsuranceRequired');
      let vehicleYearCtrl = this.autoVehicleLoanForm.get('vehicleYear');
      let vehicleMakeCtrl = this.autoVehicleLoanForm.get('vehicleMake');
      let vehicleModelCtrl = this.autoVehicleLoanForm.get('vehicleModel');
      let autoMileageCtrl = this.autoVehicleLoanForm.get('autoMileage');
      if (financeType !== "99") {
        this.showVINNumber = true;
        vinNumberCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.vehicleVinNumber)));
        autoTrimPackageCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.autoTrimPackage)));
        autoColorCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.autoColor)));
        isTitleRequiredCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.isTitleRequired)));
        isInsuranceRequiredCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.isInsuranceRequired)));
        vehicleYearCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.vehicleYear)));
        vehicleMakeCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.vehicleMake)));
        vehicleModelCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.vehicleModel)));
        autoMileageCtrl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.vehicleLoanValues.autoMileage)));
      }
      else {
        this.showVINNumber = false;
        vinNumberCtrl.setValidators(null);
        autoTrimPackageCtrl.setValidators(null);
        autoColorCtrl.setValidators(null);
        isTitleRequiredCtrl.setValidators(null);
        isInsuranceRequiredCtrl.setValidators(null);
        vehicleYearCtrl.setValidators(null);
        vehicleMakeCtrl.setValidators(null);
        vehicleModelCtrl.setValidators(null);
        autoMileageCtrl.setValidators(null);
      }
      vinNumberCtrl.updateValueAndValidity({ emitEvent: false });
      autoTrimPackageCtrl.updateValueAndValidity({ emitEvent: false });
      autoColorCtrl.updateValueAndValidity({ emitEvent: false });
      isTitleRequiredCtrl.updateValueAndValidity({ emitEvent: false });
      isInsuranceRequiredCtrl.updateValueAndValidity({ emitEvent: false });
      vehicleYearCtrl.updateValueAndValidity({ emitEvent: false });
      vehicleMakeCtrl.updateValueAndValidity({ emitEvent: false });
      vehicleModelCtrl.updateValueAndValidity({ emitEvent: false });
      autoMileageCtrl.updateValueAndValidity({ emitEvent: false });
    }
  }

  createForm() {
    var validationValues = require('../../../../assets/validators/journey/validation-values.json');
    this.vehicleLoanValues = validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan;

    this.autoVehicleLoanForm = this.formBuilder.group({
      // 'vehicleOwner': [null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.vehicleOwner))],
      'typeOfVehicle': [null],
      //  Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.typeOfVehicle))],
      // 'vehicleCoOwner': [null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.vehicleCoOwner))],
      'autoStyle': [null],
      'autoTrimPackage': [null],
      'autoColor': [null],
      'tagNumber': [null],
      'cashDown': [null],
      'purchaseType': [null],
      // 'loanPurchaseType': [null],
      'isTitleRequired': [null],
      //'isTitleRequired': [null],
      'isInsuranceRequired': [null],
      //'isInsuranceRequired': [null],
      // 'isVehicleDetailsAvailable': [null],
      'collateralValue': [null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.collateralValue))],
      'collateralDescription': [null],

      'vehicleVinNumber': [null],
      'vehicleYear': [null],
      'vehicleMake': [null],
      'vehicleModel': [null],
      'autoMileage': [null],
      'vehicleSourceOfValue': [null]
    })
    this.formControls = this.autoVehicleLoanForm.controls;
    this.autoVehicleLoanForm.get('vehicleSourceOfValue').setValue('Manual');
    if (this.collateralType === "047" || this.collateralType === "048") {
      this.autoVehicleLoanForm.get('typeOfVehicle').setValidators(null);
    }
    // this.setValidations(this.autoVehicleLoanForm);
    this.blockInvalidInput(this.autoVehicleLoanForm, this.vehicleLoanValues);
  };

  public blockInvalidInput(group: FormGroup | FormArray, validationValues): void {
    let that = this;
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        that.blockInvalidInput(abstractControl, validationValues);
      } else {
        abstractControl.valueChanges.subscribe(function (value) {
          that.validationUtilService.resetInvalidValue(abstractControl, value, key, that.vehicleLoanValues[key]);
        });
      }
    });
  }

  setAmountDecimalValue(formControl) {
    if (this.autoVehicleLoanForm.controls[formControl].value) {
      let amount = this.autoVehicleLoanForm.controls[formControl].value;
      let amtArr = amount.split(".");
      if (amtArr.length > 1 && !amtArr[1]) {
        amtArr[1] = "00";
        amount = amtArr.join(".");
        this.autoVehicleLoanForm.get(formControl).setValue(amount);
      }
    }
  }

  /***************************************************************************************************/
  setValidations(_formGroup) {
    _formGroup.valueChanges.subscribe((value) => {
      value = value.isVehicleDetailsAvailable;
      let vehicleVinNumber = _formGroup.controls['vehicleVinNumber'],
        vehicleYear = _formGroup.controls['vehicleYear'],
        vehicleMake = _formGroup.controls['vehicleMake'],
        vehicleModel = _formGroup.controls['vehicleModel'],
        autoMileage = _formGroup.controls['autoMileage'],
        isTitleRequired = _formGroup.controls['isTitleRequired'],
        isInsuranceRequired = _formGroup.controls['isInsuranceRequired']




      vehicleVinNumber.clearValidators();
      vehicleYear.clearValidators();
      vehicleMake.clearValidators();
      vehicleModel.clearValidators();
      autoMileage.clearValidators();
      isTitleRequired.clearValidators();
      isInsuranceRequired.clearValidators();



      var validationValues = require('../../../../assets/validators/journey/validation-values.json');

      switch (value) {
        case 'Yes':
          vehicleVinNumber.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.vehicleVinNumber)));
          vehicleYear.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.vehicleYear)));
          vehicleMake.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.vehicleMake)));
          vehicleModel.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.vehicleModel)));
          autoMileage.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.autoMileage)));
          isTitleRequired.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.isTitleRequired))),
            isInsuranceRequired.setValidators(Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralTypeDetails.autoVehicleLoan.isInsuranceRequired)))

          break;
      }


      vehicleVinNumber.updateValueAndValidity({ emitEvent: false });
      vehicleYear.updateValueAndValidity({ emitEvent: false });
      vehicleMake.updateValueAndValidity({ emitEvent: false });
      vehicleModel.updateValueAndValidity({ emitEvent: false });
      autoMileage.updateValueAndValidity({ emitEvent: false });
      isTitleRequired.updateValueAndValidity({ emitEvent: false });
      isInsuranceRequired.updateValueAndValidity({ emitEvent: false });



    })

  };
  /****************************************************************************************************/

  save(action) {
    if (action === 'CONTINUE') {
      if (this.autoVehicleLoanForm.valid) {
        this.checkObj = {
          vehicleModel: this.autoVehicleLoanForm.get('vehicleModel').value,
          vehicleMake: this.autoVehicleLoanForm.get('vehicleMake').value,
          collateralValue: this.autoVehicleLoanForm.get('collateralValue').value,
          autoMileage: this.autoVehicleLoanForm.get('autoMileage').value
        }

        if (this.dummyObj.collateralValue && this.dummyObj.vehicleMake && this.dummyObj.vehicleModel) {
          var diff = jsonpatch.compare(this.dummyObj, this.checkObj);
          if (diff.length > 0) {
            this.autoVehicleLoanForm.controls['vehicleSourceOfValue'].setValue('Manual');
          }
          else {
            if (this.setSourceOfValue) {
              this.autoVehicleLoanForm.controls['vehicleSourceOfValue'].setValue('NADA');
            }
          }
        }

        this.saveData.emit(this.autoVehicleLoanForm.value);
      } else {
        this.submitted = true;
      }
    }
    else {
      this.saveData.emit(this.autoVehicleLoanForm.value);
    }

  }

  getUsedVinDetails(event) {
    this.getVinDetails(event, this.autoVehicleLoanForm.controls['vehicleVinNumber'].value, this.autoVehicleLoanForm.controls['typeOfVehicle'].value);
  }

  getVinDetails(event, vin, equipment_type) {

    if (event.target.value.length === 17) {
      this.loanDetailsService.getDetailsFromVin(this.autoVehicleLoanForm.controls['vehicleVinNumber'], this.autoVehicleLoanForm.controls['typeOfVehicle']).subscribe((data: any) => {

        this.autoVehicleLoanForm.controls['vehicleModel'].setValue(data.bodydescr);
        this.autoVehicleLoanForm.controls['vehicleMake'].setValue(data.makedescr);
        this.autoVehicleLoanForm.controls['collateralValue'].setValue(data.msrp);
        this.autoVehicleLoanForm.controls['autoMileage'].setValue(data.avemileage);
        this.autoVehicleLoanForm.controls['vehicleSourceOfValue'].setValue(data.avemileage);
        this.setSourceOfValue = true;
        this.dummyObj = {
          vehicleModel: this.autoVehicleLoanForm.get('vehicleModel').value,
          vehicleMake: this.autoVehicleLoanForm.get('vehicleMake').value,
          collateralValue: this.autoVehicleLoanForm.get('collateralValue').value,
          autoMileage: this.autoVehicleLoanForm.get('autoMileage').value
        }

      });
    }
  }
}