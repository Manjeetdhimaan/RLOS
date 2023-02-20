import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ValidationUtilsService } from 'src/app/core/services/validation-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { JourneyService } from '../../_root/journey.service';
import { DOMHelperService } from '../../../shared';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/directives/format-datepicker';
import { MaskedDate } from 'src/app/shared/services/utils/mask.helper';

@Component({
  selector: 'app-politically-exposed-person',
  templateUrl: './politically-exposed-person.component.html',
  styleUrls: ['./politically-exposed-person.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PoliticallyExposedPersonComponent implements OnInit {
  @Input() isComponentReadOnly;
  @Input() hideFields;
  @Input() isJointApplicant;
  @Input() jointApplicantIndex;
  @Input() tabData;
  @Input() listItems;
  @Input() isJuniorAccSelected;
  dateMask = MaskedDate;
  PEP: FormGroup;
  submitted: boolean;
  prefixList;
  public relationList: FormArray;
  formControls;
  estimatedAmountList;
  suffixList;
  optionList;
  prevPEPOptionList;
  showCoApplicantRequiredMsg;
  maxDateAllowed;
  minDateAllowed;
  maxDateDob;
  minDateDob;
  pepDetailValues;
  invalidDateMessage;
  encryptedSSN;
  showssn;
  showEvent;
  encryptedNIB;
  showNibEvent;
  showNib;
  haveId;
  isReadOnly;
  isMiddleNameReadOnly;
  countryList;
  applicationType;
  pepRelationList;
  tooltipValue;
  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToInvalidTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();


  constructor(private formBuilder: FormBuilder, private validationUtilService: ValidationUtilsService, private translate: TranslateService, private JourneyService: JourneyService, private _elementRef: ElementRef, private _dom: DOMHelperService) {
    this.maxDateAllowed = new Date();
    this.maxDateAllowed.setFullYear(this.maxDateAllowed.getFullYear());
    this.minDateAllowed = new Date();
    this.minDateAllowed.setFullYear(this.minDateAllowed.getFullYear() - 100);

    this.maxDateDob = new Date();
    this.maxDateDob.setFullYear(this.maxDateDob.getFullYear() - 18);
    this.minDateDob = new Date();
    this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);
    this.applicationType = this.JourneyService.getFromStorage().applicationType;
  }

  ngOnInit() {
    try {
      this.maxDateAllowed = new Date();
      this.maxDateAllowed.setFullYear(this.maxDateAllowed.getFullYear());
      this.minDateAllowed = new Date();
      this.minDateAllowed.setFullYear(this.minDateAllowed.getFullYear() - 100);

      this.maxDateDob = new Date();
      this.maxDateDob.setFullYear(this.maxDateDob.getFullYear() - 18);
      this.minDateDob = new Date();
      this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);

      window.scroll(0, 0);
      this.createForm();
      this.initModel(this.tabData);
      this.initStaticData();
      this.pepStatus();
    } catch (exception) {
      console.log(exception.message)
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    try {
      if (changes.tabData && changes.tabData.currentValue) {
        this.initModel(changes.tabData.currentValue);
      }
      this.pepStatus();
    } catch (exception) {
      console.log(exception.message)
    }

  }

  initModel(tabData) {
    try {
      if (tabData) {
        this.createForm(tabData);
        if (tabData.relationshipDetails) {
          this.initFormData(tabData.relationshipDetails);
        }
      }
      // this.pepStatus();
    } catch (exception) {
      console.log(exception.message)
    }

  };

  initFormData(tabData) {
    try {
      let control = <FormArray>this.PEP.controls['relationshipDetails'];
      tabData.forEach(data => {
        control.push(this.createrelationship(data));
      });
      this.relationList.removeAt(0);
    } catch (exception) {
      console.log(exception.message)
    }
  }

  createForm(data?) {
    try {
      this.pepDetailValues = this.listItems.validationValues.pepDetails;
      data = data || {};
      this.haveId = (data.id && this.applicationType === 'INDIVIDUAL') ? true : false;
      this.isMiddleNameReadOnly = (data.middleName && this.applicationType === 'INDIVIDUAL') ? true : false;
      if (this.haveId) {
        this.isReadOnly = true;
      }
      else {
        this.isReadOnly = false;
      }

      if (data.nibNumber) {
        this.showNibEvent = true;
        this.showNib = false;
        this.encryptedNIB = data.nibNumber.replace(/[0-9]/g, "X");
      } else {
        this.showNibEvent = false;
        this.showNib = true;
      }

      this.PEP = this.formBuilder.group({
        'id': data.id || null,
        'pepFlag': [data.pepFlag || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.pep))],
        'previousPep': [data.previousPep || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.previousPEP))],
        'pepRelation': [data.pepRelation || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.pepRelation))],
        'pepFirstName': [data.pepFirstName || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.firstName))],
        'pepMiddleName': [data.pepMiddleName || null],
        'pepLastName': [data.pepLastName || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.lastName))],
        'pepSuffix': [data.pepSuffix || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.suffix))],
        'pepCountry': [data.pepCountry || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.pepCountry))],
        'positionTitle': [data.positionTitle || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.PositionTitle))],
        // 'detailsOfPositonHeld': [data.detailsOfPositonHeld || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.detailsOfPositonHeld))],
        'dateAddedToPepList': [data.dateAddedToPepList || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.dateAddedToPepList))],
        'yearsInPosition': [{ value: data.yearsInPosition || null, disabled: true }],
        // 'yearsInPosition': [data.yearsInPosition || null],
        'dateRemovedFromPep': [data.dateRemovedFromPep || null, Validators.compose(this.validationUtilService.composeValidators(this.pepDetailValues.dateRemovedFromPep))],
        relationshipDetails: this.formBuilder.array([this.createrelationship()])
      })
      this.formControls = this.PEP.controls;
      this.relationList = this.PEP.get('relationshipDetails') as FormArray;
      this.validationUtilService.blockInvalidInput(this.PEP, this.pepDetailValues);


    } catch (exception) {
      console.log(exception.message)
    }

  }


  pepStatus() {
    try {
      if (this.PEP) {
        const currentPEP = this.PEP.get('pepFlag');
        const PreviousPEP = this.PEP.get('previousPep');
        const pepRelation = this.PEP.get('pepRelation');
        const firstName = this.PEP.get('pepFirstName');
        const middleName = this.PEP.get('pepMiddleName');
        const lastName = this.PEP.get('pepLastName');
        const suffix = this.PEP.get('pepSuffix');
        const pepCountry = this.PEP.get('pepCountry');
        const positionTitle = this.PEP.get('positionTitle');
        // const detailsOfPositonHeld = this.PEP.get('detailsOfPositonHeld');
        const dateAddedToPepList = this.PEP.get('dateAddedToPepList');
        const dateRemovedFromPep = this.PEP.get('dateRemovedFromPep');

        const mockrelationship = this.PEP.controls.relationshipDetails;
        let tempArray = mockrelationship['controls'];
        const lastNameRelation = tempArray[0]['controls'].lastName;
        const middleNameNameRelation = tempArray[0]['controls'].middleName;
        const dobRelation = tempArray[0]['controls'].dob;
        const relationship = tempArray[0]['controls'].relationship;
        const firstNameRelation = tempArray[0]['controls'].firstName;



        if (currentPEP.value === 'No') {
          PreviousPEP.setValidators([Validators.required]);
          if (PreviousPEP.value === 'No') {
            pepRelation.reset();
            pepRelation.setValidators(null);
            firstName.reset();
            firstName.setValidators(null);
            middleName.reset();
            middleName.setValidators(null);
            lastName.reset();
            lastName.setValidators(null);
            suffix.reset();
            suffix.setValidators(null);
            pepCountry.reset();
            pepCountry.setValidators(null);
            positionTitle.reset();
            positionTitle.setValidators(null);
            // detailsOfPositonHeld.reset();
            // detailsOfPositonHeld.setValidators(null);
            dateAddedToPepList.reset();
            dateAddedToPepList.setValidators(null);
            dateRemovedFromPep.reset();
            dateRemovedFromPep.setValidators(null);
            relationship.reset();
            relationship.setValidators(null);
            dobRelation.reset();
            dobRelation.setValidators(null);
            firstNameRelation.reset();
            firstNameRelation.setValidators(null);
            lastNameRelation.reset();
            lastNameRelation.setValidators(null);
          }
          else {
            pepRelation.setValidators([Validators.required]);
            pepCountry.setValidators([Validators.required]);
            positionTitle.setValidators([Validators.required, Validators.maxLength(20)]);
            // detailsOfPositonHeld.setValidators([Validators.required, Validators.maxLength(50)]);
            dateRemovedFromPep.setValidators([Validators.required]);
            dateAddedToPepList.setValidators([Validators.required]);
            if (pepRelation.value == '6') {
              firstName.reset();
              firstName.setValidators(null);
              middleName.reset();
              middleName.setValidators(null);
              suffix.reset();
              suffix.setValidators(null);
              lastName.reset();
              lastName.setValidators(null);

            }
            else {
              firstName.setValidators([Validators.required, Validators.maxLength(20)]);
              middleName.setValidators([Validators.maxLength(20)]);
              lastName.setValidators([Validators.required, Validators.maxLength(20)]);
            }
          }
          if ((PreviousPEP && PreviousPEP.value === null) && (pepRelation && pepRelation.value !== null)) {
            pepRelation.reset();
            pepRelation.setValidators(null);
          }
        } else {
          PreviousPEP.reset();
          PreviousPEP.setValidators(null);
          dateRemovedFromPep.reset();
          dateRemovedFromPep.setValidators(null);

          pepRelation.setValidators([Validators.required]);
          pepCountry.setValidators([Validators.required]);
          positionTitle.setValidators([Validators.required, Validators.maxLength(20)]);
          dateAddedToPepList.setValidators([Validators.required]);

          //relationship details changes on self
          firstNameRelation.setValidators([Validators.maxLength(20)]);
          lastNameRelation.setValidators([Validators.maxLength(20)]);
          // dobRelation.setValidators([Validators.required]);
          relationship.setValidators([Validators.maxLength(20)]);

          if (pepRelation.value == '6') {
            firstName.reset();
            firstName.setValidators(null);
            middleName.reset();
            middleName.setValidators(null);
            suffix.reset();
            suffix.setValidators(null);
            lastName.reset();
            lastName.setValidators(null);
          }
          else {
            firstName.setValidators([Validators.required, Validators.maxLength(20)]);
            middleName.setValidators([Validators.maxLength(20)]);
            lastName.setValidators([Validators.required, Validators.maxLength(20)]);
          }
        }
        PreviousPEP.updateValueAndValidity({ emitEvent: false });
        pepRelation.updateValueAndValidity({ emitEvent: false });
        firstName.updateValueAndValidity({ emitEvent: false });
        lastName.updateValueAndValidity({ emitEvent: false });
        pepCountry.updateValueAndValidity({ emitEvent: false });
        positionTitle.updateValueAndValidity({ emitEvent: false });
        // detailsOfPositonHeld.updateValueAndValidity({ emitEvent: false });
        dateRemovedFromPep.updateValueAndValidity({ emitEvent: false });
        dateAddedToPepList.updateValueAndValidity({ emitEvent: false });
        firstNameRelation.updateValueAndValidity({ emitEvent: false });
        lastNameRelation.updateValueAndValidity({ emitEvent: false });
        dobRelation.updateValueAndValidity({ emitEvent: false });
        relationship.updateValueAndValidity({ emitEvent: false });

        if (pepRelation.value == '6') {
          //relationship details changes on self
          firstNameRelation.setValidators([Validators.maxLength(20)]);
          middleNameNameRelation.setValidators([Validators.maxLength(20)]);
          lastNameRelation.setValidators([Validators.maxLength(20)]);
          // dobRelation.setValidators([Validators.required]);
          relationship.setValidators([Validators.maxLength(20)]);
        }
        else {

          dobRelation.reset();
          dobRelation.setValidators(null);
          firstNameRelation.reset();
          firstNameRelation.setValidators(null);
          middleNameNameRelation.reset();
          middleNameNameRelation.setValidators(null);
          lastNameRelation.reset();
          lastNameRelation.setValidators(null);
          relationship.reset();
          relationship.setValidators(null);
        }
        firstNameRelation.updateValueAndValidity({ emitEvent: false });
        lastNameRelation.updateValueAndValidity({ emitEvent: false });
        dobRelation.updateValueAndValidity({ emitEvent: false });
        relationship.updateValueAndValidity({ emitEvent: false });

      }
    } catch (exception) {
      console.log(exception.message)
    }

  }


  get relationFormGroup() {
    try {
      return this.PEP.get('relationshipDetails') as FormArray;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  createrelationship(data?): FormGroup {
    try {
      data = data || {};
      return this.formBuilder.group({
        'id': [data.id || null],
        'firstName': [data.firstName || null],
        'middleName': [data.middleName || null],
        'lastName': [data.lastName || null],
        'dob': [data.dob || null],
        'relationship': [data.relationship || null]

      });
    } catch (exception) {
      console.log(exception.message)
    }

  }

  addRelationshipDetails() {
    try {
      this.relationList.push(this.createrelationship());
    } catch (exception) {
      console.log(exception.message)
    }
  }
  //   if (data.ssnNumber) {
  //     this.showEvent = true;
  //     this.showssn = false;
  //     // data.ssnNumber = data.ssnNumber.slice(0, 3) + "-" + data.ssnNumber.slice(3, 5) + "-" + data.ssnNumber.slice(5, 9)
  //     this.encryptedSSN = data.ssnNumber.replace(/[0-9]/g, "X");
  //     this.personalDetailsForm.get('ssnNumber').setValidators([Validators.required, Validators.minLength(9)]);
  //   } else {
  //     this.showEvent = false;
  //     this.showssn = true;
  //     this.personalDetailsForm.get('ssnNumber').setValidators(null);
  //   }


  back() {
    try {
      window.scroll(0, 0);
      this.PEP.reset();
      this.initModel(this.tabData);
      this.goBack.emit({
        prevTabIndex: 3
      })
    } catch (exception) {
      console.log(exception.message)
    }
  }

  initStaticData() {
    try {
      this.tooltipValue = `JMMB' "Guidelines for Licensees on the Prevention of Money
      Laundering and Countering the Financing of Terrorism" require that Licensees
      classify customers who hold or have held, in the preceding year, any of the noted
      positions of influence as Politically Exposed Persons (PEPs), the relatives of PEPS (i.e.
      their spouse, sibling, parent or child) must also be classified as PEPS. The positions
      noted below are classified as PEPS.
      Head of States, Heads of Government including:
      The Governor General, The Prime Minister and Deputy Prime Minister or the equivalent ranking rulers from a
      foreign country.
      Senior Officials in the executive, legislative, administrative, military or judicial branches of any
      government including: All Cabinet Ministers, Members of Parliament, Senators, All Permanent Secretaries,
      Commissioners and Deputy Commissioners of Police and Commodore and Deputy Commodore of the Defence
      Force, Chief Justice, Judges or the equivalent rank from a foreign country.
      Also, Senior Embassy Officials, Ambassadors of all Countries and those in possession of a diplomatic passport are
      considered PEP's.
      Senior Officials of Major political Parties including: Leader, Deputy Leader and Chairman of all major
      political parties or the equivalent rank from a foreign country.
      Senior Executives of Government Owned Corporations:
      The Executive Team and Chairman of the Board of Directors of all local or foreign Government-owned
      Corporations.`;
      this.prefixList = ["Mr.", "Ms.", "Mrs"];
      // this.suffixList = ["Jr."];
      this.suffixList = this.listItems.suffixList;
      this.estimatedAmountList = ["Under $1000", "$1001-$5000", "$5001-$25000", "$25001-$50000", "Above $50000"]
      // this.genderList = this.listItems.genderList;
      this.countryList = this.listItems.countryList;
      this.pepRelationList = this.listItems.pepRelationList;
      // this.maritalStatusList = this.listItems.maritalStatusList;

      //  RICHA : PEP DROPDOWN VALUES CHANGED AFTER RISK ASSESSMENT CHANGES
      //this.optionList = ["Yes", "No"];
      this.optionList = ["Yes - Domestic", "Yes - International", "No"];
      this.prevPEPOptionList = ["Yes", "No"];
    } catch (exception) {
      console.log(exception.message)
    }

  }

  continue(nextTabIndex?, isContinueClicked?) {
    try {
      if (this.PEP.valid) {
        this.saveTabData.emit({
          data: {
            politicallyExposedPersonDetails: this.PEP.getRawValue()
          },
          nextTabIndex: !this._dom.isEmpty(nextTabIndex) ? nextTabIndex : 5,
          tabName: 'PEP',
          actionType: 'CONTINUE',
          context: "PEP",
          isContinueClicked: (isContinueClicked) ? isContinueClicked : false
        });
      } else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.PEP);
        this._dom.moveToInvalidField(this._elementRef);
        if (isContinueClicked) {
          this.moveToInvalidTab.emit({ selectedTab: nextTabIndex });
        }
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }

  deleteDetails(group: FormGroup, index): void {
    try {
      if (group.get('id').value) {
        this.formControls.relationshipDetails.controls[index].controls.id.value = group.get('id').value * -1;
        this.deleteTabData.emit({
          data: {
            politicallyExposedPersonDetails: this.PEP.getRawValue()
          },
          tabName: 'PEP',
          actionType: 'CONTINUE',
          context: "PEP"
        });
      } else {
        this.relationList.removeAt(index);
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }

  saveAndExit() {
    try {
      this.saveTabData.emit({
        data: {
          politicallyExposedPersonDetails: this.PEP.getRawValue()
        },
        tabName: 'PEP',
        actionType: 'SAVE',
        context: "PEP"
      });
    } catch (exception) {
      console.log(exception.message)
    }
  }

  // calculcateTime(event, group: FormGroup, key) {
  //   try {

  //     if ((new Date()) > new Date(event.value)) {
  //       var today = new Date();
  //       var nowyear = today.getFullYear();
  //       var nowmonth = today.getMonth();
  //       var nowday = today.getDate();

  //       var moveInYear = event.value.getFullYear();
  //       var moveInMonth = event.value.getMonth();
  //       var moveInDay = event.value.getDate();

  //       var timeYear = nowyear - moveInYear;
  //       var timeMonths = nowmonth - moveInMonth;
  //       if (nowmonth < moveInMonth && nowyear > moveInYear) {
  //         timeYear = timeYear - 1;
  //         timeMonths = 12 - moveInMonth + nowmonth;
  //       }
  //       if (nowmonth == moveInMonth && nowyear > moveInYear) {
  //         if (moveInDay > nowday)
  //           timeYear = timeYear - 1;
  //       }
  //       this.PEP.get('yearsInPosition').setValue(timeYear);
  //       this.PEP.get('yearsInPosition').disable();
  //     }

  //     //to check if date is valid on entering it manually
  //     if (group && key) {
  //       this.isDateValid(group, key);
  //     }
  //   }
  //   catch (exception) {
  //     console.log(exception.message)
  //   }
  // }

  isDateValid(group: FormGroup, key) {
    try {
      var hundredYearPastFromNow = new Date();
      hundredYearPastFromNow.setFullYear(hundredYearPastFromNow.getFullYear() - 100);
      if ((group.controls[key].value) && ((new Date(group.controls[key].value)) > (new Date()))) {
        group.controls[key].setErrors({ matDatepickerMax: true });
      } else if ((group.controls[key].value) && ((new Date(group.controls[key].value)) < (new Date(hundredYearPastFromNow)))) {
        group.controls[key].setErrors({ matDatepickerMin: true });
      }
      return null;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  calculateYearsInPosition(group: FormGroup) {
    try {
      let dateAddedtoPep = group.get('dateAddedToPepList').value ? group.get('dateAddedToPepList').value : null;
      let dateRemovedfromPep = group.get('dateRemovedFromPep').value ? group.get('dateRemovedFromPep').value : null;

      //when both dates are valid and selected
      if ((dateAddedtoPep && dateRemovedfromPep) && (dateAddedtoPep < dateRemovedfromPep)) {

        var removedYear = dateRemovedfromPep.getFullYear();
        var removedMonth = dateRemovedfromPep.getMonth();
        var removedDay = dateRemovedfromPep.getDate();

        var addedYear = dateAddedtoPep.getFullYear();
        var addedMonth = dateAddedtoPep.getMonth();
        var addedDay = dateAddedtoPep.getDate();

        var timeYear = removedYear - addedYear;
        var timeMonths = removedMonth - addedMonth;
        if (removedMonth < addedMonth && removedYear > addedYear) {
          timeYear = timeYear - 1;
          timeMonths = 12 - addedMonth + removedMonth;
        }
        if (removedMonth == addedMonth && removedYear > addedYear) {
          if (addedDay > removedDay)
            timeYear = timeYear - 1;
        }
        this.PEP.get('yearsInPosition').setValue(timeYear);
        this.PEP.get('yearsInPosition').disable();
      }
      //when both dates are selected but date added is greater than removed date
      else if ((dateAddedtoPep && dateRemovedfromPep) && (dateAddedtoPep > dateRemovedfromPep)) {
        group.controls.dateRemovedFromPep.setErrors({ removedDateLessThanAddedData: true });
        this.PEP.get('yearsInPosition').setValue(null);
      }
      //when only date added to pep is added
      else if (dateAddedtoPep) {
        this.calculcateTime(dateAddedtoPep);
      }
    } catch (exception) {
      console.log(exception.message);
    }
  }

  calculcateTime(event) {
    try {

      if ((new Date()) > new Date(event)) {
        var today = new Date();
        var nowyear = today.getFullYear();
        var nowmonth = today.getMonth();
        var nowday = today.getDate();

        var moveInYear = event.getFullYear();
        var moveInMonth = event.getMonth();
        var moveInDay = event.getDate();

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
        this.PEP.get('yearsInPosition').setValue(timeYear);
        this.PEP.get('yearsInPosition').disable();
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }
}
