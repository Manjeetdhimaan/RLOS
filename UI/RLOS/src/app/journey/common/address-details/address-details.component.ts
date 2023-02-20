import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { JourneyService } from '../../_root/journey.service';
import { Router } from '@angular/router';
import { ConfirmDialog } from './address-confirmation-modal/address-confirmation.modal.component';
import { SameAddressDialog } from './same-address-modal/same-address.modal.component';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

// import { PersonalInfoService } from '../personal-details.service';
// import { LocalizationPipe } from '../../../../../assets/pipes/journey/localization-pipe';
import { ValidationUtilsService } from '../../../core/services';
import { DOMHelperService } from '../../../shared';
import { MaskedDate } from 'src/app/shared/services/utils/mask.helper';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/directives/format-datepicker';

declare var require: any;
@Component({
  selector: 'address-details',
  templateUrl: './address-details.component.html',
  styleUrls: ['./address-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AddressDetailsComponent implements OnInit, OnChanges {
  addressForm: FormGroup;
  private formControls;
  public displayPrevAddressFields: boolean;
  public submitted: boolean;
  private _previousAddressArray;
  validation;
  @Input() listItems;
  @Input() isCoApplicant;
  monthsList;
  maxDateDob;
  minDateDob;
  yearsList;
  stateList;
  cityList;
  countyList;
  countryList;
  ownOrRentList;
  phoneType;
  dropdownPlaceHolder;
  addressDetailValues;
  butDisabled: boolean = true;
  basicDetailValues;
  showCoApplicantRequiredMsg;
  showInvalidIssueDate;
  @Input() tabData;
  @Input() applicantData;
  @Input() uspsAddress;
  @Input() isComponentReadOnly;
  alert: {};
  public Age: number;
  isMobileNumberReadOnly;
  isMailingCountryBahamas: boolean;
  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToInvalidTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();

  dateMask = MaskedDate;

  constructor(private _route: Router, private formBuilder: FormBuilder, private validationUtilService: ValidationUtilsService,
    private journeyService: JourneyService, public dialog: MatDialog, private _dom: DOMHelperService, private _elementRef: ElementRef) {
    this.maxDateDob = new Date();
    this.minDateDob = new Date();
    this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);
  }

  ngOnInit() {
    try {
      // this.journeyService.setStepper(1);
      this.initStaticData();
      this.createForm();
      this.initModel(this.tabData);
      this.initLocalVars();
      this.radioChangeOwnOrRent();
      this.isMailingAddressSameAsCurrent();
      this.formControlValueChanged();
    }
    catch (exception) {
      console.log(exception.message)
    }

  }

  initStaticData() {
    try {
      var validationMessages = require('../../../../assets/i18n/journey/en.json');
      this.validation = validationMessages.application.applicant.addressDetails;

      this.dropdownPlaceHolder = "Please select";
      this.monthsList = this.listItems.monthsList;
      this.yearsList = this.listItems.yearsList;
      this.stateList = this.listItems.stateList;
      this.ownOrRentList = this.listItems.ownOrRentList;
      if (this.stateList)
        this.stateList = this.stateList.sort((a, b) => a.label > b.label ? 1 : -1);
      this.phoneType = this.listItems.phoneType;
      this.cityList = this.listItems.cityList;
      if (this.cityList) { this.cityList = this.cityList.sort((a, b) => a.label > b.label ? 1 : -1); }
      this.countryList = this.listItems.countryList;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initModel(tabData) {
    try {
      if (this.addressForm) {
        this.countyList = [];
        if (tabData && this.addressForm) {

          if (!this.isCoApplicant) {
            tabData.isAddressSameAsPrimary = "NO";
          }
          if (tabData.currentAddress) {
            tabData.currentAddress = { ...tabData.currentAddress }
          }
          this.addressForm.patchValue(tabData);
          this.isMobileNumberReadOnly = tabData.mobileNo ? true : false;

          if (tabData.currentAddress && tabData.currentAddress.state) {
            this.addressForm.get('currentAddress.state').patchValue(tabData.currentAddress.state);
            this.addressForm.get('currentAddress.years').disable(); //to disable readonly fields
            this.addressForm.get('currentAddress.months').disable(); //to disable readonly fields
          }
          if (tabData.mailingAddress && tabData.mailingAddress.state) {
            this.addressForm.get('mailingAddress.state').patchValue(tabData.mailingAddress.state);
          }
          this.onHomePhoneChange(tabData.homePhoneNo, 15);
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }

  };



  initLocalVars() {
    this.addPrevAddress();
  }

  createForm(data?) {
    try {
      this.isMailingCountryBahamas = false;
      this.basicDetailValues = this.listItems.validationValues;
      this.addressDetailValues = this.listItems.validationValues.addressDetails;

      data = data || {};
      this.addressForm = this.formBuilder.group({
        'id': data.id || null,
        'isMailingAndResidentialAddDifferent': [data.isMailingAndResidentialAddDifferent || null, Validators.compose([Validators.required])],
        'isAddressSameAsPrimary': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.isAddressSameAsPrimary))],
        'amtOfRent': [data.amtOfRent || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.amtOfRent))],
        'relationshipWithMortgageOwner': [data.relationshipWithMortgageOwner || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.relationshipWithMortgageOwner))],
        'mortgageOwnersFullName': [data.mortgageOwnersFullName || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.mortgageOwnersFullName))],
        'mortgageOwnerPhoneNumber': [data.mortgageOwnerPhoneNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.mortgageOwnerPhoneNumber))],
        // 'homePhoneNo': [data.homePhoneNo || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.homePhoneNo))],
        // 'workPhoneNo': [data.workPhoneNo || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.workPhoneNo))],
        // 'mobileNo': [data.mobileNo || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.mobileNo))],
        'currentAddress': this.formBuilder.group({
          'addressLine1': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.addressLine1))], //street address
          'addressLine2': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.addressLine2))], //apartment/suite number
          'city': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.city))],
          'country': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.country))],
          'state': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.state))],
          'zipCode': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.zipCode))],
          'years': [null],
          'months': [null],
          'drivingDetailsToCurrentAddress': [data.drivingDetailsToCurrentAddress || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.drivingDetailsToCurrentAddress))],
          'ownOrRent': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.ownRent))],
          'dateMovedIn': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.dateMovedIn))],
        }),
        'mailingAddress': this.formBuilder.group({
          'addressLine1': [data.addressLine1 || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.addressLine1))],
          'addressLine2': [data.addressLine2 || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.addressLine2))],
          'city': [data.city || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.city))],
          'state': [data.state || null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.state))],
          'country': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.country))],
          'zipCode': [null, Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.zipCode))]
        }),
        'previousAddress': this.formBuilder.group({
          'addressLine1': [null],
          'addressLine2': [null],
          'city': [null],
          'country': [null],
          'state': [null],
          'zipCode': [null]
        })
      })
      if (!this.isCoApplicant && this.addressForm)
        this.addressForm.controls["isAddressSameAsPrimary"].setValue("NO");
      this.formControls = this.addressForm.controls;
      this.validationUtilService.blockInvalidInput(this.addressForm, this.addressDetailValues, this.basicDetailValues);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  createItem(): FormGroup {
    try {
      return this.formBuilder.group({
        'addressLine1': null,
        //'zipCode': null,
        'city': null,
        'state': null,
        'country': null,
        'years': null,
        'months': null
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  isMailingAddressSameAsCurrent() {
    try {
      if (this.addressForm) {
        let streetAddress = this.addressForm.get('mailingAddress.addressLine1');
        let apartmentNumber = this.addressForm.get('mailingAddress.addressLine2');
        let postalcode = this.addressForm.get('mailingAddress.zipCode');
        let city = this.addressForm.get('mailingAddress.city');
        let state = this.addressForm.get('mailingAddress.state');
        let country = this.addressForm.get('mailingAddress.country');

        if (this.addressForm.get('isMailingAndResidentialAddDifferent').value === 'NO') {
          streetAddress.setValidators([Validators.required, Validators.maxLength(60)]);
          apartmentNumber.setValidators([Validators.maxLength(30)]);
          postalcode.setValidators([Validators.required, Validators.maxLength(50)]);
          city.setValidators([Validators.required, Validators.maxLength(35)]);
          state.setValidators([Validators.required, Validators.maxLength(35)]);
          country.setValidators([Validators.required]);
        } else {

          streetAddress.setValidators(null);
          apartmentNumber.setValidators(null);
          postalcode.setValidators(null);
          city.setValidators(null);
          state.setValidators(null);
          country.setValidators(null);
        }
        streetAddress.updateValueAndValidity({ emitEvent: false });
        apartmentNumber.updateValueAndValidity({ emitEvent: false });
        postalcode.updateValueAndValidity({ emitEvent: false });
        city.updateValueAndValidity({ emitEvent: false });
        state.updateValueAndValidity({ emitEvent: false });
        country.updateValueAndValidity({ emitEvent: false });
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initFormData(tabData) {
    try {
      let control = <FormArray>this.addressForm.controls['previousAddresses'];
      this._previousAddressArray.removeAt(this._previousAddressArray.value.findIndex(item => item.id === 0));
      if (this._previousAddressArray.value.length) {
        tabData.previousAddresses.forEach(data => {
          control.push(this.formBuilder.group({
            'addressLine1': data.addressLine1,
            //'zipCode': data.zipCode,
            'city': data.city,
            'state': data.state,
            'county': data.county,
            'country': null,
            'years': data.years,
            'months': data.months
          }))
        });
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  formControlValueChanged() {
    if (this.addressForm) {
      this.addressForm.get('isMailingAndResidentialAddDifferent').valueChanges.subscribe(
        (mode: string) => {
          this.controlMailingAddressValidations(mode);
        });
    }
  }

  checkInvalidIssueDate(event) {
    if (event.value) {
      // this.showCoApplicantRequiredMsg = false;
      this.showInvalidIssueDate = false;
      if ((new Date()) < new Date(event.value)) {
        this.addressForm.get('dateMovedIn').setErrors({ matDatepickerMax: true });
      }
    }
    else if (event.target && event.target.value) {
      this.showInvalidIssueDate = false;
      if ((new Date()) < new Date(event.target.value)) {
        this.addressForm.get('dateMovedIn').setErrors({ matDatepickerMax: true });
      }
    }
    else {
      if (this.addressForm && this.addressForm.get('dateMovedIn').invalid) {
        this.addressForm.get('dateMovedIn').setErrors({ matDatepickerMax: true });
      }
    }
  }

  calculcateIssueDateFromInputChange(event) {
    if (event.target && event.target.value) {
      this.showInvalidIssueDate = false;
      if ((new Date()) < new Date(event.target.value)) {
        this.addressForm.get('dateMovedIn').setErrors({ matDatepickerMax: true });
      }
    }
  }

  calculcateTime(event) {
    try {

      if ((new Date()) > new Date(event.value)) {
        var today = new Date();
        var nowyear = today.getFullYear();
        var nowmonth = today.getMonth();
        var nowday = today.getDate();

        var moveInYear = event.value.getFullYear();
        var moveInMonth = event.value.getMonth();
        var moveInDay = event.value.getDate();

        var timeYear = nowyear - moveInYear;
        var timeMonths = nowmonth - moveInMonth;
        if (nowmonth < moveInMonth && nowyear > moveInYear) {
          timeYear = timeYear - 1;
          timeMonths = 12 - moveInMonth + nowmonth;
        }
        if (nowmonth == moveInMonth && nowyear > moveInYear) {
          if (moveInDay > nowday)
            timeYear = timeYear - 1;
        }
        this.addressForm.get('currentAddress.years').setValue(timeYear);
        this.addressForm.get('currentAddress.months').setValue(timeMonths);
        this.addressForm.get('currentAddress.years').disable();
        this.addressForm.get('currentAddress.months').disable();

        this.addPrevAddress();
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  controlMailingAddressValidations(isMailingAndResidentialAddDifferent) {
    try {
      if (this.addressForm) {
        let mailingAddressLine1 = this.addressForm.get('mailingAddress.addressLine1');
        let mailingAddressLine2 = this.addressForm.get('mailingAddress.addressLine2');
        // let mailingAddressZipCode = this.addressForm.get('mailingAddress.zipCode');
        let mailingAddressCity = this.addressForm.get('mailingAddress.city');
        let mailingAddressState = this.addressForm.get('mailingAddress.state');
        let mailingAddressCountry = this.addressForm.get('mailingAddress.country');
        // let mailingAddressCounty = this.addressForm.get('mailingAddress.county');
        if (isMailingAndResidentialAddDifferent) {
          mailingAddressLine1.clearValidators();
          mailingAddressLine2.clearValidators();
          // mailingAddressZipCode.clearValidators();
          mailingAddressCity.clearValidators();
          mailingAddressState.clearValidators();
          mailingAddressCountry.clearValidators();
          // mailingAddressCounty.clearValidators();
        }
        else {
          mailingAddressLine1.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.addressLine1)));
          mailingAddressLine2.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.addressLine2)));
          // mailingAddressZipCode.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.zipCode)));
          mailingAddressCity.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.city)));
          mailingAddressState.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.state)));
          // mailingAddressCounty.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.county)));
          mailingAddressCountry.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.addressDetailValues.country)));
        }
        mailingAddressLine1.updateValueAndValidity();
        mailingAddressLine2.updateValueAndValidity();
        // mailingAddressZipCode.updateValueAndValidity();
        mailingAddressCity.updateValueAndValidity();
        mailingAddressState.updateValueAndValidity();
        // mailingAddressCounty.updateValueAndValidity();
        mailingAddressCountry.updateValueAndValidity();

      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  controlPreviousAddressValidation(value) {
    try {
      let previousAddressLine1 = this.addressForm.get('previousAddress.addressLine1');
      let previousAddressLine2 = this.addressForm.get('previousAddress.addressLine2');
      let previousAddressCity = this.addressForm.get('previousAddress.city');
      let previousAddressState = this.addressForm.get('previousAddress.state');
      let previousAddressCountry = this.addressForm.get('previousAddress.country');
      let previousAddressPOBoxNo = this.addressForm.get('previousAddress.zipCode');
      if (value) {
        previousAddressLine1.setValidators([Validators.required, Validators.maxLength(60)]);
        previousAddressLine2.setValidators([Validators.maxLength(30)]);
        previousAddressCity.setValidators([Validators.maxLength(35)]);
        previousAddressState.setValidators([Validators.maxLength(35)]);
        // previousAddressCountry.setValidators();
        previousAddressPOBoxNo.setValidators([Validators.maxLength(35)]);
      }
      else {
        previousAddressLine1.clearValidators();
        previousAddressLine2.clearValidators();
        previousAddressCity.clearValidators();
        previousAddressState.clearValidators();
        previousAddressCountry.clearValidators();
        previousAddressPOBoxNo.clearValidators();
      }
      previousAddressLine1.updateValueAndValidity();
      previousAddressLine2.updateValueAndValidity();
      previousAddressCity.updateValueAndValidity();
      previousAddressState.updateValueAndValidity();
      previousAddressCountry.updateValueAndValidity();
      previousAddressPOBoxNo.updateValueAndValidity();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }




  addPrevAddress(): void {
    if (this.formControls.currentAddress.controls.years && this.formControls.currentAddress.controls.years.value !== null && this.formControls.currentAddress.controls.years.value < 3) {
      this.displayPrevAddressFields = true;
      this.controlPreviousAddressValidation(true);
    } else {
      this.displayPrevAddressFields = false;
      this.controlPreviousAddressValidation(false);
    }
  };

  ngOnChanges(changes: SimpleChanges) {
    try {
      if (changes.uspsAddress && changes.uspsAddress.currentValue) {
        this.formControls.currentAddress.controls['addressLine1'].setValue(changes.uspsAddress.currentValue.addressLine1);
        // this.formControls.currentAddress.controls['addressLine2'].setValue(changes.uspsAddress.currentValue.addressLine2);
        //this.formControls.currentAddress.controls['zipCode'].setValue(changes.uspsAddress.currentValue.zipCode);
        this.formControls.currentAddress.controls['state'].setValue(changes.uspsAddress.currentValue.state);
        this.formControls.currentAddress.controls['city'].setValue(changes.uspsAddress.currentValue.city);
        this.formControls.currentAddress.controls['country'].setValue(changes.uspsAddress.currentValue.country);
      }
      if (changes.tabData && changes.tabData.currentValue) {
        this.initModel(changes.tabData.currentValue);

      }
    }
    catch (exception) {
      console.log(exception.message)
    }
    // this.radioChangeOwnOrRent();
    // this.isMailingAddressSameAsCurrent();
  }

  onHomePhoneChange(event, limit) {
    if (limit && event) {
      let count = event.split("-").length - 1;
      if (event.length === 10 && count === 0) {
        event = "(" + event.slice(0, 3) + ")-" + event.slice(3, 6) + "-" + event.slice(6, 10);
      }
      else if (event.length !== 14) {
        event = event.replace(/-/g, "").replace(/[(-)]/g, "");
      }
      limit--;
      this.addressForm.get('homePhoneNo').patchValue(event, { emitEvent: false });
    }
  }

  onWorkPhoneChange(event, limit) {
    if (limit && event) {
      let count = event.split("-").length - 1;
      if (event.length === 10 && count === 0) {
        event = "(" + event.slice(0, 3) + ")-" + event.slice(3, 6) + "-" + event.slice(6, 10);
      }
      else if (event.length !== 14) {
        event = event.replace(/-/g, "").replace(/[(-)]/g, "");
      }
      limit--;
      this.addressForm.get('workPhoneNo').patchValue(event, { emitEvent: false });
    }
  }

  onAltPhoneChange(event, limit) {
    if (limit && event) {
      let count = event.split("-").length - 1;
      if (event.length === 10 && count === 0) {
        event = "(" + event.slice(0, 3) + ")-" + event.slice(3, 6) + "-" + event.slice(6, 10);
      }
      else if (event.length !== 14) {
        event = event.replace(/-/g, "").replace(/[(-)]/g, "");
      }
      limit--;
      this.addressForm.get('mobileNo').patchValue(event, { emitEvent: false });
    }
  }

  notifyValueChange(state, index) {
    this.countyList[index] = this.journeyService.getCountyFromState(this.addressForm.get(state).value).countyList;
  }


  setCounty(addressType, event) {
    this.addressForm.get(addressType).setValue(event);
  }

  back() {
    try {
      window.scroll(0, 0);
      this.addressForm.reset();
      this.initModel(this.tabData);
      this.goBack.emit({
        prevTabIndex: 0
      })
    }
    catch (exception) {
      console.log(exception.message)
    }
  };



  radioChangeOwnOrRent() {
    try {
      if (this.addressForm) {
        let amtOfRent = this.addressForm.get('amtOfRent');
        let relationshipWithMortgageOwner = this.addressForm.get('relationshipWithMortgageOwner');
        let mortgageOwnersFullName = this.addressForm.get('mortgageOwnersFullName');
        let mortgageOwnerPhoneNumber = this.addressForm.get('mortgageOwnerPhoneNumber');
        if ((this.addressForm.get('currentAddress.ownOrRent').value === "NG_M") || (this.addressForm.get('currentAddress.ownOrRent').value === "NG_WM")) {
          amtOfRent.reset();
          amtOfRent.setValidators(null);
          relationshipWithMortgageOwner.reset();
          relationshipWithMortgageOwner.setValidators(null);
          mortgageOwnerPhoneNumber.reset();
          mortgageOwnerPhoneNumber.setValidators(null);
          mortgageOwnersFullName.reset();
          mortgageOwnersFullName.setValidators(null);
        }
        else {
          if (this.addressForm.get('currentAddress.ownOrRent').value === "NG_F") {
            amtOfRent.reset();
            amtOfRent.setValidators(null);
            relationshipWithMortgageOwner.setValidators([Validators.required, Validators.maxLength(15)]);
            mortgageOwnerPhoneNumber.setValidators([Validators.required, Validators.minLength(10)]);
            mortgageOwnersFullName.setValidators([Validators.required, Validators.maxLength(40)]);
          }
          else {
            amtOfRent.setValidators([Validators.required]);
            relationshipWithMortgageOwner.setValidators([Validators.required, Validators.maxLength(15)]);
            mortgageOwnerPhoneNumber.setValidators([Validators.required, Validators.minLength(10)]);
            mortgageOwnersFullName.setValidators([Validators.required, Validators.maxLength(40)]);

          }
        }
        amtOfRent.updateValueAndValidity({ emitEvent: false });
        relationshipWithMortgageOwner.updateValueAndValidity({ emitEvent: false });
        mortgageOwnersFullName.updateValueAndValidity({ emitEvent: false });
        mortgageOwnerPhoneNumber.updateValueAndValidity({ emitEvent: false });
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
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
    //   this.addressForm.get('ssn').patchValue(event, { emitEvent: false });
    // }

    if (!limit) {
      return;
    }
    this.onSearchChange(--limit);
  }

  continue(nextTabIndex, isContinueClicked?) {
    try {
      if (this.addressForm.valid) {
        let formValues = this.addressForm.getRawValue();
        this.saveTabData.emit({
          data: {
            addressDetails: formValues
          },
          nextTabIndex: !this._dom.isEmpty(nextTabIndex) ? nextTabIndex : 2,
          tabName: "CONTACT",
          actionType: 'CONTINUE',
          context: "CONTACT",
          isContinueClicked: (isContinueClicked) ? isContinueClicked : false
        });
      } else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.addressForm);
        this._dom.moveToInvalidField(this._elementRef);
        if (!this.addressForm.value.ownOrRent) {
          var elems = this._elementRef.nativeElement.querySelectorAll('.ng-invalid');
          if (elems[0].tagName === "FORM") {
            for (let i = 0; i < elems.length; i++) {
              if (elems[i].hasAttribute('formControlName') && elems[i].id === "ownOrRent") {
                elems[i].focus();
                window.scroll(0, .5);
                break;
              }
            }
          }
        }
        if (isContinueClicked) {
          this.moveToInvalidTab.emit({ selectedTab: nextTabIndex });
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  resetForm() {
    try {
      let isMailingAndResidentialAddDifferent = this.addressForm.get('isMailingAndResidentialAddDifferent').value;
      let mailingAddressLine1 = this.addressForm.get('mailingAddress.addressLine1');
      let mailingAddressLine2 = this.addressForm.get('mailingAddress.addressLine2');
      // let mailingAddressZipCode = this.addressForm.get('mailingAddress.zipCode');
      let mailingAddressCity = this.addressForm.get('mailingAddress.city');
      let mailingAddressState = this.addressForm.get('mailingAddress.state');
      let mailingAddressCounty = this.addressForm.get('mailingAddress.county');
      let mailingAddressCountry = this.addressForm.get('mailingAddress.country');
      if (!isMailingAndResidentialAddDifferent) {
        mailingAddressLine1.reset();
        mailingAddressLine2.reset();
        // mailingAddressZipCode.reset();
        mailingAddressCity.reset();
        mailingAddressState.reset();
        mailingAddressCounty.reset();
        mailingAddressCountry.reset();
      }

      let isPrevAdd = this.formControls.currentAddress.controls.years.value && this.formControls.currentAddress.controls.years.value < 2;
      if (!isPrevAdd) {
        let previousAddressLine1 = this.addressForm.get('previousAddress.addressLine1');
        let previousAddressLine2 = this.addressForm.get('previousAddress.addressLine2');
        //let previousAddressZipCode = this.addressForm.get('previousAddress.zipCode');
        let previousAddressCity = this.addressForm.get('previousAddress.city');
        let previousAddressState = this.addressForm.get('previousAddress.state');
        let previousAddressCounty = this.addressForm.get('previousAddress.county');
        let previousAddressCountry = this.addressForm.get('previousAddress.country');
        previousAddressLine1.reset();
        previousAddressLine2.reset();
        //previousAddressZipCode.reset();
        previousAddressCity.reset();
        previousAddressState.reset();
        previousAddressCounty.reset();
        previousAddressCountry.reset();
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  // fillExtactedData(payload): void {
  //   if (payload) {
  //     this.addressForm.get('currentAddress').patchValue(payload);
  //   }
  // }

  saveAndExit() {
    let formValues = this.addressForm.getRawValue();
    this.saveTabData.emit({
      data: {
        addressDetails: formValues
      },
      tabName: "CONTACT",
      actionType: 'SAVE',
      context: "CONTACT"
    });
  }

}
