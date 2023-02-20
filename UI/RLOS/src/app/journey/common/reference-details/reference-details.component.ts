import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ValidationUtilsService } from '../../../core/services';
import { DOMHelperService } from '../../../shared';

@Component({
  selector: 'reference-details',
  templateUrl: './reference-details.component.html',
  styleUrls: ['./reference-details.component.scss']
})
export class ReferenceDetailsComponent implements OnInit {
  referenceForm: FormGroup;
  formControls;
  public submitted: boolean = false;
  dropdownPlaceHolder: string;
  _referenceDetailsArray;

  // public titleList: any;
  referenceValues;
  showAddReference;
  cityList;
  stateList;
  countryList;

  //for address  
  showStateFlag: boolean = false;
  showMailingStateFlag: boolean = false;
  isCountryBahamas: boolean;
  isMailingCountryBahamas: boolean;


  @Input() listItems;
  @Input() isCoApplicant;
  @Input() isComponentReadOnly;

  @Input() tabData;
  @Input() isDocumentUploaded;
  @Input() referenceInfo;
  @Input() applicantOrder;
  @Input() required;

  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() openUploadDialog: EventEmitter<any> = new EventEmitter<any>();
  @Output() editUploadDialog: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _route: Router, private formBuilder: FormBuilder, private validationUtilService: ValidationUtilsService, private _dom: DOMHelperService) { }

  ngOnInit() {
    try {
      this.createForm();
      this.initModel(this.tabData);
      this.initStaticData();
      this.checkIfAddressDiff();
    }
    catch (exception) {
      console.log(exception.message)
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      if (changes.tabData && changes.tabData.currentValue) {
        this.initModel(changes.tabData.currentValue);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initModel(tabData) {
    this.showAddReference = true;
    this.dropdownPlaceHolder = "Please select"
    try {
      if (tabData) {
        this.initFormData(tabData);
      }
      this.checkIfAddressDiff();
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  initStaticData() {
    try {
      // this.titleList = ["Mr.", "Ms.", "Mrs"];
      this.cityList = this.listItems.cityList;
      if (this.cityList) {
        this.cityList = this.cityList.sort((a, b) => a.label > b.label ? 1 : -1);
      }
      this.stateList = this.listItems.stateList;
      if (this.stateList) {
        this.stateList = this.stateList.sort((a, b) => a.label > b.label ? 1 : -1);
      }
      this.countryList = this.listItems.countryList;
    }
    catch (exception) {
      console.log(exception.message)
    }
  };


  createForm() {
    try {
      this.referenceForm = this.formBuilder.group({
        referenceDetails: this.formBuilder.array([this.createItem(), this.createItem(), this.createItem()])
      })
      this.formControls = this.referenceForm.controls;
      this._referenceDetailsArray = this.referenceForm.get('referenceDetails') as FormArray;
      this.blockInvalidInput(this._referenceDetailsArray, this.listItems.validationValues.referenceDetails);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  public blockInvalidInput(group: FormGroup | FormArray, validationValues): void {
    try {
      let that = this;
      Object.keys(group.controls).forEach((key: string) => {
        const abstractControl = group.controls[key];
        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
          that.blockInvalidInput(abstractControl, validationValues);
        } else {
          abstractControl.valueChanges.subscribe(function (value) {
            that.validationUtilService.resetInvalidValue(abstractControl, value, key, that.listItems.validationValues.referenceDetails[key]);
          });
        }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  createItem(data?): FormGroup {
    try {
      this.referenceValues = this.listItems.validationValues.referenceDetails;
      data = data || {};
      return this.formBuilder.group({
        'id': data.id || null,
        // 'title': [data && data.title ? data.title : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.title))],
        'firstName': [data && data.firstName ? data.firstName : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.firstName))],
        'middleName': [data && data.middleName ? data.middleName : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.middleName))],
        'lastName': [data && data.lastName ? data.lastName : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.lastName))],
        'employer': [data && data.employer ? data.employer : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.employer))],
        'relationship': [data && data.relationship ? data.relationship : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.relationship))],
        'phoneNo': [data && data.phoneNo ? data.phoneNo : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.phoneNo))],
        'isMailingAndResidentialAddDifferent': [data && data.isMailingAndResidentialAddDifferent ? data.isMailingAndResidentialAddDifferent : null],
        'currentAddress': this.formBuilder.group({
          'addressLine1': [data && data.currentAddress && data.currentAddress.addressLine1 ? data.currentAddress.addressLine1 : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.addressLine1))], //street name
          'poBoxNo': [data && data.currentAddress && data.currentAddress.poBoxNo ? data.currentAddress.poBoxNo : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.POBoxNo))], //po box
          'addressLine2': [data && data.currentAddress && data.currentAddress.addressLine2 ? data.currentAddress.addressLine2 : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.addressLine2))], //apartment
          'city': [data && data.currentAddress && data.currentAddress.city ? data.currentAddress.city : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.city))], //city
          'state': [data && data.currentAddress && data.currentAddress.state ? data.currentAddress.state : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.state))],//state
          'country': [data && data.currentAddress && data.currentAddress.country ? data.currentAddress.country : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.country))],//country
        }),
        'mailingAddress': this.formBuilder.group({
          'addressLine1': [data && data.mailingAddress && data.mailingAddress.addressLine1 ? data.mailingAddress.addressLine1 : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.addressLine1))],
          'poBoxNo': [data && data.mailingAddress && data.mailingAddress.poBoxNo ? data.mailingAddress.poBoxNo : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.POBoxNo))],
          'addressLine2': [data && data.mailingAddress && data.mailingAddress.addressLine2 ? data.mailingAddress.addressLine2 : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.addressLine2))],
          'city': [data && data.mailingAddress && data.mailingAddress.city ? data.mailingAddress.city : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.city))],
          'state': [data && data.mailingAddress && data.mailingAddress.state ? data.mailingAddress.state : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.state))],
          'country': [data && data.mailingAddress && data.mailingAddress.country ? data.mailingAddress.country : null, Validators.compose(this.validationUtilService.composeValidators(this.referenceValues.country))],
        })
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  initFormData(tabData) {
    try {
      if (this.referenceForm) {
        let control = <FormArray>this.referenceForm.controls['referenceDetails'];
        while (this._referenceDetailsArray.length !== 0) {
          this._referenceDetailsArray.removeAt(0)
        }
        tabData.forEach(data => {
          control.push(this.createItem(data));
        });

        if (tabData.length === 4) {
          this.showAddReference = false;
        }
        else {
          this.showAddReference = true;
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  addReference(index?): void {
    try {
      if (this._referenceDetailsArray.controls.length <= 4) {
        this._referenceDetailsArray.push(this.createItem());
        this.validationUtilService.blockInvalidInput(this._referenceDetailsArray, this.listItems.validationValues.referenceDetails);
        if (this._referenceDetailsArray.controls.length === 4) {
          this.showAddReference = false;
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  removeReference(group: FormGroup, index): void {
    try {
      if (group.get('id').value) {
        this.formControls.referenceDetails.controls[index].controls.id.value = group.get('id').value * -1;
        this.deleteTabData.emit({
          data: this.referenceForm.getRawValue(),
          tabName: "REFERENCE",
          actionType: 'CONTINUE',
          isContinueClicked: true,
          context: "REFERENCE",
        });
      } else {
        this._referenceDetailsArray.removeAt(index);
      }
      this.showAddReference = true;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  checkIfAddressDiff() {
    try {
      if (this.formControls && this.formControls.referenceDetails) {
        for (var j = 0; j < this.formControls.referenceDetails.controls.length; j++) {
          var refFormControl = this.formControls.referenceDetails.controls[j].get('mailingAddress');
          const isMailingDifferent = this.formControls.referenceDetails.controls[j].get('isMailingAndResidentialAddDifferent');
          const addressLine1 = refFormControl.get('addressLine1')
          const city = refFormControl.get('city')
          const country = refFormControl.get('country')
          const addressLine2 = refFormControl.get('addressLine2')
          const state = refFormControl.get('state')
          const POBoxNo = refFormControl.get('poBoxNo')

          if (this.formControls.referenceDetails.controls[j].get('isMailingAndResidentialAddDifferent').value === 'NO') {

            addressLine1.setValidators([Validators.maxLength(60)]);
            city.setValidators([Validators.maxLength(35)]);
            country.setValidators(null);
            addressLine2.setValidators([Validators.maxLength(30)]);
            state.setValidators([Validators.maxLength(35)]);
            POBoxNo.setValidators([Validators.maxLength(50)]);
          }
          else {
            addressLine1.reset();
            addressLine1.setValidators(null);
            city.reset();
            city.setValidators(null);
            country.reset();
            country.setValidators(null);
            addressLine2.reset();
            addressLine2.setValidators(null);
            state.reset();
            state.setValidators(null);
            POBoxNo.reset();
            POBoxNo.setValidators(null);
          }
          addressLine1.updateValueAndValidity({ emitEvent: false });
          city.updateValueAndValidity({ emitEvent: false });
          country.updateValueAndValidity({ emitEvent: false });
          addressLine2.updateValueAndValidity({ emitEvent: false });
          state.updateValueAndValidity({ emitEvent: false });
          POBoxNo.updateValueAndValidity({ emitEvent: false });
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  back() {
    try {
      if (this.referenceForm) {
        this.referenceForm.removeControl('referenceDetails');
        this.createForm();
        this.initModel(this.tabData);
        window.scroll(0, 0);
        this.submitted = false;
        window.scroll(0, 0);
        this.goBack.emit({
          prevTabIndex: 5
        });
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  continue() {
    try {
      if (this.referenceForm.valid) {
        this.saveTabData.emit({
          data: this.referenceForm.value,
          tabName: "REFERENCE",
          actionType: 'CONTINUE',
          isContinueClicked: true,
          context: "REFERENCE",
        });
      } else {
        this.submitted = true;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  saveAndExit() {

    this.saveTabData.emit({
      data: this.referenceForm.value,
      tabName: "REFERENCE",
      actionType: 'SAVE',
      context: "REFERENCE"
    });
  }

}
