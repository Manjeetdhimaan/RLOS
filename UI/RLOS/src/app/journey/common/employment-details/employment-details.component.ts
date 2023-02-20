import { Component, OnInit, Input, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ValidationUtilsService } from '../../../core/services';
import { DOMHelperService } from '../../../shared';
import { JourneyService } from '../../_root/journey.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/directives/format-datepicker';
import { MaskedDate } from 'src/app/shared/services/utils/mask.helper';


@Component({
  selector: 'emp-details',
  templateUrl: './employment-details.component.html',
  styleUrls: ['./employment-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})

export class EmpDetailsComponent implements OnInit {

  @Input() isComponentReadOnly;
  @Input() hideFields;
  @Input() tabData;
  @Input() empInfo;
  @Input() listItems;
  @Input() isCoApplicant;
  @Input() applicantCitizenship;
  empForm: FormGroup;
  public submitted: boolean;
  formControls;
  employmentList;
  sourceOfInformationList;
  employmentSectorList;
  incomeTypeList;
  frequencyList;
  businessTypeList;
  yearsList = [];
  monthsList = [];
  incomeDetailValues;
  employmentDetailValues;
  currentAddressValues;
  employedDetailValues;
  countryList;
  highestEducationList;
  optionList;
  yesNoList;
  cityList;
  stateList;
  jobTitleList;
  currentcountryFlag;
  mailingcountryFlag;
  showCurrentAddressFlag: boolean = false;
  showMailingAddressFlag: boolean = false;
  maxDateIssue;
  minDateIssue;

  dateMask = MaskedDate;
  @Input() employerNumber;
  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToInvalidTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();
  empDetails: any;

  constructor(private formBuilder: FormBuilder, private _elementRef: ElementRef, private _dom: DOMHelperService, private journeyService: JourneyService, private validationUtilService: ValidationUtilsService) {
    this.maxDateIssue = new Date();
    this.minDateIssue = new Date();
    this.minDateIssue.setFullYear(this.minDateIssue.getFullYear() - 100);
  }

  ngOnInit() {
    try {
      window.scroll(0, 0);
      this.createForm();
      this.initModel(this.tabData);
      this.initStaticData();
      let employeeCode = this.empForm.get('empType')
      if (employeeCode) {
        this.onResetFields(this.empForm.get('empType'));
      }
      this.isWorkPermitPresent();
    }
    catch (exception) {
      console.log(exception.message)
    }
    // this.checkState()
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
    try {
      if (tabData !== undefined && this.empForm) {
        var formControlKeys = Object.keys(this.empForm.controls);
        formControlKeys.forEach(element => {
          for (element in tabData[0]) {
            if ((tabData[0][element] !== null || tabData[0][element] !== undefined) && formControlKeys.includes(element)) {
              this.empForm.get(element).patchValue(tabData[0][element]);
            }
          }
        });
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  createForm(data?) {
    try {
      data = data || {};
      // this.incomeDetailValues = this.listItems.validationValues.incomeDetails;
      this.employmentDetailValues = this.listItems.validationValues.empDetails;
      this.currentAddressValues = this.listItems.validationValues.addressDetails;
      this.empForm = this.formBuilder.group({
        'id': data.id || null,
        'empType': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.empType))],
        'empEmployed': this.formBuilder.group({
          'companyName': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.companyName))],
          'jobTitle': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.jobTitle))],
          'jobTitleDescription': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.jobTitleDescription))],
          'yearsEmployed': [{ value: data.yearsEmployed || null, disabled: true }],
          'monthsEmployed': [{ value: data.monthsEmployed || null, disabled: true }],
          // 'yearsEmployed': [data.yearsEmployed || null],
          // 'monthsEmployed': [data.monthsEmployed || null],
          // 'sector': [data.sector || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.sector))],
          'workPermitExpiry': [data.workPermitExpiry || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.workPermitExpiry))],
          'workPermitNumber': [data.workPermitNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.workPermitNumber))],

          'empDate': [data.empDate || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.empDate))],
          'workPermitPresent': [data.workPermitPresent || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.workPermitPresent))],
          // 'workPermitExpiryDate' :[data.workPermitExpiryDate || null , Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.workPermitExpiryDate)) ],
          'currentAddress': this.formBuilder.group({
            'addressLine1': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.streetAddress))], //streetAddress
            'addressLine2': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.appartmentNumber))],//appartmentNumber
            'poBoxNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.POBoxNo))], //POBoxNo            
            'state': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.state))], //state
            'city': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.EMP001.city))], //city
            'phoneNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.currentAddressValues.phoneNo))],
            'id': null
          }),
        }),
        'empSelf': this.formBuilder.group({
          'businessName': [data.businessName || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.businessName))],
          'jobTitleDescription': [data.jobTitleDescription || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.jobTitleDescription))],
          'businessDate': [data.businessDate || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.businessDate))],
          // 'businessType': [data.businessType || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.businessType))],
          'yearsBusiness': [{ value: data.yearsBusiness || null, disabled: true }],
          'monthsBusiness': [{ value: data.monthsBusiness || null, disabled: true }],
          // 'yearsBusiness': [data.yearsBusiness || null],
          // 'monthsBusiness': [data.monthsBusiness || null],
          'businessAddress': this.formBuilder.group({
            'addressLine1': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.streetAddress))],
            'addressLine2': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.appartmentNumber))],
            'poBoxNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.postalcode))],
            'city': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.city))],
            'state': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.state))],
            // 'country': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.SEMP001.country))],
            'phoneNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.currentAddressValues.phoneNo))],
            'id': null
          }),
        }),
        'empRetired': this.formBuilder.group({
          'lastCompanyName': [data.lastCompanyName || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.lastCompanyName))],
          // 'sector': [data.sector || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.sector))],
          'jobTitle': [data.jobTitle || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.jobTitle))],
          'jobTitleDescription': [data.jobTitleDescription || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.jobTitleDescription))],
          'yearOfRetirement': [data.yearOfRetirement || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.yearOfRetirement))],
          'currentAddress': this.formBuilder.group({
            'addressLine1': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.streetAddress))], //streetAddress
            'addressLine2': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.appartmentNumber))],//appartmentNumber
            'poBoxNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.POBoxNo))], //POBoxNo            
            'state': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.state))], //state
            'city': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.RT001.city))], //city
            'phoneNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.currentAddressValues.phoneNo))],
            'id': null
          })
        }),
        'empStudent': this.formBuilder.group({
          'organizationName': [data.organizationName || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.organizationName))],
          'highestEducation': [data.highestEducation || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.highestEducation))],
          'fundingPerson': [data.fundingPerson || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.fundingPerson))],
          'relationshipWithApplicant': [data.relationshipWithApplicant || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.relationshipWithApplicant))],
          'isFundingPersonAnExistingCustomer': [data.isFundingPersonAnExistingCustomer || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.isFundingPersonAnExistingCustomer))],
          'currentAddress': this.formBuilder.group({
            'addressLine1': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.streetAddress))], //streetAddress
            'addressLine2': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.appartmentNumber))],//appartmentNumber
            'poBoxNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.POBoxNo))], //POBoxNo            
            'state': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.state))], //state
            'city': [null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.STU001.city))], //city
            'phoneNo': [null, Validators.compose(this.validationUtilService.composeValidators(this.currentAddressValues.phoneNo))],
            'id': null
          }),
        }),
        'nonEmp': this.formBuilder.group({
          'fundingPerson': [data.fundingPerson || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.NEMP001.fundingPerson))],
          'relationshipWithApplicant': [data.relationshipWithApplicant || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.NEMP001.relationshipWithApplicant))],
          'isFundingPersonAnExistingCustomer': [data.isFundingPersonAnExistingCustomer || null, Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues.NEMP001.isFundingPersonAnExistingCustomer))]
        })
      });

      this.formControls = this.empForm.controls;
      // this.validationUtilService.blockInvalidInput(this.empForm, this.incomeDetailValues);
      this.validationUtilService.blockInvalidInput(this.empForm, this.employmentDetailValues);
      // this.validationUtilService.blockInvalidInput(this.empForm, this.currentAddressValues);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  continue(nextTabIndex?, isContinueClicked?) {
    // this.formControls.empDetails.controls.forEach((control, index) => {
    //   if (control.get('empType').value === null) {
    //     control.get('empType').setValidators(Validators.required);
    //     control.get('empType').updateValueAndValidity({ emitEvent: false });
    //   }
    // });
    // this.checkForAdditionalEmlpoyment();
    try {
      //Added by Hemlata on 2 Sep 2022 for removing mandatory check form Work Permit NUmber
      if (this.empForm.valid) {

        // this.empDetails = {...this.empDetails, ...this.empForm.value};
        this.saveTabData.emit({
          data: {
            empDetails: this.empForm.getRawValue()
          },
          nextTabIndex: !this._dom.isEmpty(nextTabIndex) ? nextTabIndex : 3,
          tabName: 'EMPLOYMENT',
          actionType: 'CONTINUE',
          context: "EMPLOYMENT",
          isContinueClicked: (isContinueClicked) ? isContinueClicked : false
        });
      } else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.empForm);
        this._dom.moveToInvalidField(this._elementRef);
        if (isContinueClicked) {
          this.moveToInvalidTab.emit({ selectedTab: nextTabIndex });
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  saveAndExit() {
    try {
      this.saveTabData.emit({
        data: {
          empDetails: this.empForm.getRawValue()
        },
        tabName: 'EMPLOYMENT',
        actionType: 'SAVE',
        context: "EMPLOYMENT"
      });
    } catch (exception) {
      console.log(exception.message)
    }
  }


  setControlValidity(group: FormGroup | FormArray, isValidator) {
    try {
      Object.keys(group.controls).forEach((key: string) => {
        const abstractControl = group.controls[key];
        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
          this.setControlValidity(abstractControl, isValidator);
        } else {
          if (isValidator) {
            abstractControl.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.employmentDetailValues[key])));
          }
          else {
            abstractControl.setValidators(null);
            abstractControl.reset();
          }
          abstractControl.updateValueAndValidity({ emitEvent: false });
        }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  onResetFields(data) {
    try {

      switch (data.value) {
        case 'EMP001':
        case 'EMP002':
          this.setResetEmpSelfValidator();
          this.setResetEmpRetiredValidator();
          // this.setResetNonEmpValidator();
          this.setResetEmpEmployedValidator("Yes");
          this.setResetCurrentAddressValidator("Yes");
          this.setResetBusinessAddressValidator("No");
          this.setResetRetiredCurrentAddressValidator("No");
          this.setResetStudentCurrentAddressValidator("No");
          this.setResetEmpStudentValidator();
          this.setResetNonEmployedValidator();
          //Hemlata Commented on 2 September 2022 for blank phone Number Issue
          // this.empForm.controls.empEmployed['controls'].currentAddress.controls.phoneNo.setValue(this.employerNumber);         
          break;
        case 'SEMP001':
        case 'SEMP002':
        case 'SEMP003':
          this.setResetEmpSelfValidator("Yes");
          this.setResetEmpRetiredValidator();
          // this.setResetNonEmpValidator();
          this.setResetEmpEmployedValidator();
          this.setResetCurrentAddressValidator("No");
          this.setResetBusinessAddressValidator("Yes");
          this.setResetRetiredCurrentAddressValidator("No");
          this.setResetStudentCurrentAddressValidator("No");
          this.setResetEmpStudentValidator();
          this.setResetNonEmployedValidator();
          //Hemlata Commented on 2 September 2022 for blank phone Number Issue
          // this.empForm.controls.empSelf['controls'].businessAddress.controls.phoneNo.setValue(this.employerNumber);         
          break;
        case 'RT001':
          this.setResetEmpSelfValidator();
          this.setResetEmpRetiredValidator("Yes");
          this.setResetCurrentAddressValidator("No");
          // this.setResetNonEmpValidator();
          this.setResetEmpEmployedValidator();
          this.setResetBusinessAddressValidator("No");
          this.setResetRetiredCurrentAddressValidator("Yes");
          this.setResetStudentCurrentAddressValidator("No");
          this.setResetEmpStudentValidator();
          // other.setValidators(null);
          this.setResetNonEmployedValidator();
          //Hemlata Commented on 2 September 2022 for blank phone Number Issue
          // this.empForm.controls.empRetired['controls'].currentAddress.controls.phoneNo.setValue(this.employerNumber);         
          break;
        case 'NEMP001':
          this.setResetEmpSelfValidator();
          this.setResetEmpRetiredValidator();
          // this.setResetNonEmpValidator("Yes");
          this.setResetEmpEmployedValidator();
          this.setResetCurrentAddressValidator("No");
          this.setResetBusinessAddressValidator("No");
          this.setResetRetiredCurrentAddressValidator("No");
          this.setResetStudentCurrentAddressValidator("No");
          this.setResetEmpStudentValidator();
          this.setResetNonEmployedValidator("Yes");
          break;
        case 'STU001':
          this.setResetEmpSelfValidator();
          this.setResetEmpRetiredValidator();
          // this.setResetNonEmpValidator("Yes");
          this.setResetEmpEmployedValidator();
          this.setResetCurrentAddressValidator("No");
          this.setResetBusinessAddressValidator("No");
          this.setResetRetiredCurrentAddressValidator("No");
          this.setResetStudentCurrentAddressValidator("Yes");
          this.setResetEmpStudentValidator("Yes");
          this.setResetNonEmployedValidator();
          //Hemlata Commented on 2 September 2022 for blank phone Number Issue
          //this.empForm.controls.empStudent['controls'].currentAddress.controls.phoneNo.setValue(this.employerNumber);         Hemlata Commented on 2 September 2022
          break;
        default:
          this.setResetEmpEmployedValidator();
          this.setResetEmpSelfValidator();
          this.setResetEmpRetiredValidator();
          // this.setResetNonEmpValidator();
          this.setResetCurrentAddressValidator("No");
          this.setResetBusinessAddressValidator("No");
          this.setResetRetiredCurrentAddressValidator("No");
          this.setResetStudentCurrentAddressValidator("No");
          this.setResetEmpStudentValidator();
          this.setResetNonEmployedValidator();
          break;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  validateFormat(event) {
    try {
      var empType = (this.empForm.get('empType').value);
      if (empType == 'EMP001' || empType == 'EMP002') {
        if (!event.value) {
          if (this.empForm) {
            this.empForm.get('empEmployed.empDate').setErrors({ matDatepickerMax: true })
          }
        }
        else {
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
            this.empForm.get('empEmployed.yearsEmployed').setValue(timeYear);
            this.empForm.get('empEmployed.monthsEmployed').setValue(timeMonths);

            this.empForm.get('empEmployed.yearsEmployed').disable();
            this.empForm.get('empEmployed.monthsEmployed').disable();
          }
          else {
            if (this.empForm) {
              this.empForm.get('empEmployed.empDate').setErrors({ matDatepickerMax: true });
            }
          }

        }
      }
      if (empType == 'SEMP001' || empType == 'SEMP002') {
        if (!event.value) {
          if (this.empForm) {
            this.empForm.get('empSelf.businessDate').setErrors({ matDatepickerMax: true })
          }
        }
        else {
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
            this.empForm.get('empSelf.yearsBusiness').setValue(timeYear);
            this.empForm.get('empSelf.monthsBusiness').setValue(timeMonths);

            this.empForm.get('empSelf.yearsBusiness').disable();
            this.empForm.get('empSelf.monthsBusiness').disable();
          }
          else {
            if (this.empForm) {
              this.empForm.get('empSelf.businessDate').setErrors({ matDatepickerMax: true });
            }
          }
        }

      }
    }
    catch (exception) {
      console.log(exception.message)
    }

  }


  initStaticData() {
    try {
      this.employmentList = this.listItems.empTypeList;
      this.employmentSectorList = this.listItems.empSectorList;
      this.incomeTypeList = this.listItems.incomeTypeList;
      this.frequencyList = this.listItems.incomeFrequencyList;
      this.jobTitleList = this.listItems.jobTitleList;
      this.businessTypeList = this.listItems.businessTypeList;
      // this.businessTypeList = [{ code: "FS", label: "Fishing" }, { code: "BNK", label: "Banking" }];
      this.countryList = this.listItems.countryList;
      this.highestEducationList = this.listItems.highestEducationList;
      this.cityList = this.listItems.cityList;
      this.stateList = ["State 1", "State 2", "State 3", "State 4", "State 5", "State 6"];
      this.optionList = ["Yes", "No", "Not Required"];
      this.yesNoList = ["Yes", "No"];
      this.monthsList = this.journeyService.getMonths();
      this.yearsList = this.journeyService.getYears();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setIncome() {
    let amount = this.formControls.incomeDetail.controls.amount.value;
    let frequency = this.formControls.incomeDetail.controls.frequency.value;
    if (amount === 0) {
      this.formControls.incomeDetail.controls.income.setValue(0);
    }
    else {
      if (amount && frequency) {
        let times = 1;
        switch (frequency) {
          case "MON":
            times = 12;
            break;
          case "QUA":
            times = 4;
            break;
          case "HAF":
            times = 2;
            break;
          case "ANN":
            times = 1;
            break;
          case "BIW":
            times = 26;
            break;
          case "W":
            times = 52;
            break;
        }
        let income = (amount * times);
        let arr = income.toString().split(".");
        if (arr.length > 1) {
          arr[1] = arr[1].substring(0, 2);
          income = +(arr.join("."));
        }
        this.formControls.incomeDetail.controls.income.setValue(income);
      }
      else {
        this.formControls.incomeDetail.controls.income.setValue(null);
      }
    }
  }

  isWorkPermitPresent() {
    try {
      const workPermitExpiry = this.empForm.get('empEmployed.workPermitExpiry');
      const workPermitNumber = this.empForm.get('empEmployed.workPermitNumber');

      if (this.empForm.get('empEmployed.workPermitPresent').value === 'Yes') {
        workPermitExpiry.setValidators([Validators.required]);
        workPermitNumber.setValidators([Validators.required, Validators.maxLength(20)]);

      } else {
        workPermitExpiry.reset();
        workPermitExpiry.setValidators(null);

        workPermitNumber.reset();
        workPermitNumber.setValidators(null);

      }
      workPermitExpiry.updateValueAndValidity({ emitEvent: false });
      workPermitNumber.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }

  }

  setResetEmpSelfValidator(val?) {
    try {
      let empself = this.empForm.get('empSelf');
      let businessName = this.empForm.get('empSelf.businessName');
      let jobTitleDescription = this.empForm.get('empSelf.jobTitleDescription');
      let businessDate = this.empForm.get('empSelf.businessDate');
      let sector = this.empForm.get('empSelf.sector');
      // let businessType = this.empForm.get('empSelf.businessType');


      if (val === "Yes") {
        empself.setValidators([Validators.required]);
        businessName.setValidators([Validators.required, Validators.maxLength(40)]);
        businessDate.setValidators([Validators.required]);
        jobTitleDescription.setValidators([Validators.required, Validators.maxLength(30)]);
        // businessType.setValidators([Validators.required, Validators.maxLength(20)]);
      } else {
        empself.reset();
        businessDate.reset();
        businessName.reset();
        jobTitleDescription.reset();
        // businessType.reset();
        empself.setValidators(null);
        businessName.setValidators(null);
        businessDate.setValidators(null);
        jobTitleDescription.setValidators(null);
        // businessType.setValidators(null);
      }
      empself.setErrors(null);
      businessName.setErrors(null);
      jobTitleDescription.setErrors(null);
      businessDate.setErrors(null);
      // businessType.setErrors(null);

      empself.updateValueAndValidity({ emitEvent: false });
      businessName.updateValueAndValidity({ emitEvent: false });
      jobTitleDescription.updateValueAndValidity({ emitEvent: false });
      businessDate.updateValueAndValidity({ emitEvent: false });
      // businessType.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setResetEmpRetiredValidator(val?) {
    try {
      let empRetired = this.empForm.get('empRetired');
      // let sector = this.empForm.get('empRetired.sector');
      let jobTitle = this.empForm.get('empRetired.jobTitle');
      let jobTitleDescription = this.empForm.get('empRetired.jobTitleDescription');
      let yearOfRetirement = this.empForm.get('empRetired.yearOfRetirement');
      let lastCompanyName = this.empForm.get('empRetired.lastCompanyName');

      if (val === "Yes") {
        empRetired.setValidators([Validators.required]);
        // sector.setValidators([Validators.required]);
        jobTitle.setValidators([Validators.required, Validators.maxLength(30)]);
        jobTitleDescription.setValidators([Validators.required, Validators.maxLength(30)]);
        yearOfRetirement.setValidators([Validators.required]);
        lastCompanyName.setValidators([Validators.required, Validators.maxLength(40)]);
      } else {
        empRetired.reset();
        // sector.reset();
        jobTitle.reset();
        jobTitleDescription.reset();
        yearOfRetirement.reset();
        lastCompanyName.reset();
        empRetired.setValidators(null);
        // sector.setValidators(null);
        yearOfRetirement.setValidators(null);
        jobTitle.setValidators(null);
        jobTitleDescription.setValidators(null);
        lastCompanyName.setValidators(null);
      }
      empRetired.setErrors(null);
      // sector.setErrors(null);
      jobTitle.setErrors(null);
      jobTitleDescription.setErrors(null);
      yearOfRetirement.setErrors(null);
      lastCompanyName.setErrors(null);
      empRetired.updateValueAndValidity({ emitEvent: false });
      // sector.updateValueAndValidity({ emitEvent: false });
      jobTitle.updateValueAndValidity({ emitEvent: false });
      jobTitleDescription.updateValueAndValidity({ emitEvent: false });
      yearOfRetirement.updateValueAndValidity({ emitEvent: false });
      lastCompanyName.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setResetEmpStudentValidator(val?) {
    try {
      let empStudent = this.empForm.get('empStudent');
      let highestEducation = this.empForm.get('empStudent.highestEducation');
      let organizationName = this.empForm.get('empStudent.organizationName');
      let fundingPerson = this.empForm.get('empStudent.fundingPerson');
      let relationshipWithApplicant = this.empForm.get('empStudent.relationshipWithApplicant');
      let isFundingPersonAnExistingCustomer = this.empForm.get('empStudent.isFundingPersonAnExistingCustomer');

      if (val === "Yes") {
        empStudent.setValidators([Validators.required]);
        highestEducation.setValidators([Validators.required]);
        organizationName.setValidators([Validators.required, Validators.maxLength(40)]);
        fundingPerson.setValidators([Validators.maxLength(30)]);
        relationshipWithApplicant.setValidators([Validators.maxLength(30)]);
      } else {
        empStudent.reset();
        empStudent.setValidators(null);
        highestEducation.reset();
        highestEducation.setValidators(null);
        organizationName.reset();
        organizationName.setValidators(null);
        fundingPerson.reset();
        fundingPerson.setValidators(null);
        relationshipWithApplicant.reset();
        relationshipWithApplicant.setValidators(null);
        isFundingPersonAnExistingCustomer.reset();
        isFundingPersonAnExistingCustomer.setValidators(null);
      }
      empStudent.setErrors(null);
      empStudent.updateValueAndValidity({ emitEvent: false });
      highestEducation.setErrors(null);
      highestEducation.updateValueAndValidity({ emitEvent: false });
      organizationName.setErrors(null);
      organizationName.updateValueAndValidity({ emitEvent: false });
      fundingPerson.setErrors(null);
      fundingPerson.updateValueAndValidity({ emitEvent: false });
      relationshipWithApplicant.setErrors(null);
      relationshipWithApplicant.updateValueAndValidity({ emitEvent: false });
      isFundingPersonAnExistingCustomer.setErrors(null);
      isFundingPersonAnExistingCustomer.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setResetNonEmployedValidator(val?) {
    try {
      let fundingPerson = this.empForm.get('nonEmp.fundingPerson');
      let relationshipWithApplicant = this.empForm.get('nonEmp.relationshipWithApplicant');
      let isFundingPersonAnExistingCustomer = this.empForm.get('nonEmp.isFundingPersonAnExistingCustomer');
      if (val === "Yes") {
        fundingPerson.setValidators([Validators.maxLength(30)]);
        relationshipWithApplicant.setValidators([Validators.maxLength(30)]);
      } else {
        fundingPerson.reset();
        fundingPerson.setValidators(null);
        relationshipWithApplicant.reset();
        relationshipWithApplicant.setValidators(null);
        isFundingPersonAnExistingCustomer.reset();
        isFundingPersonAnExistingCustomer.setValidators(null);
      }
      fundingPerson.setErrors(null);
      fundingPerson.updateValueAndValidity({ emitEvent: false });
      relationshipWithApplicant.setErrors(null);
      relationshipWithApplicant.updateValueAndValidity({ emitEvent: false });
      isFundingPersonAnExistingCustomer.setErrors(null);
      isFundingPersonAnExistingCustomer.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  setResetEmpEmployedValidator(val?) {
    try {
      let empEmployed = this.empForm.get('empEmployed');
      let companyName = this.empForm.get('empEmployed.companyName');
      // let sector = this.empForm.get('empEmployed.sector');
      let empDate = this.empForm.get('empEmployed.empDate');
      let workPermitExpiry = this.empForm.get('empEmployed.workPermitExpiry');
      let workPermitNumber = this.empForm.get('empEmployed.workPermitNumber');
      let workPermitPresent = this.empForm.get('empEmployed.workPermitPresent');
      let jobTitle = this.empForm.get('empEmployed.jobTitle');
      let jobTitleDescription = this.empForm.get('empEmployed.jobTitleDescription');

      if (val === "Yes") {

        empEmployed.setValidators([Validators.required]);
        companyName.setValidators([Validators.required, Validators.maxLength(40)]);
        // sector.setValidators([Validators.required]);
        empDate.setValidators([Validators.required]);
        if (this.applicantCitizenship !== 'NG_14') {
          workPermitPresent.setValidators([Validators.required]);
          workPermitExpiry.setValidators([Validators.required]);
          workPermitNumber.setValidators([Validators.required, Validators.maxLength(20)]);
        }

        jobTitle.setValidators([Validators.required, Validators.maxLength(30)]);
        jobTitleDescription.setValidators([Validators.required, Validators.maxLength(30)]);

      } else {
        empEmployed.setValidators(null);
        companyName.setValidators(null);
        // sector.setValidators(null);
        empDate.setValidators(null);
        workPermitExpiry.setValidators(null);
        workPermitNumber.setValidators(null);
        workPermitPresent.setValidators(null);
        jobTitle.setValidators(null);
        jobTitleDescription.setValidators(null);

        empEmployed.reset();
        companyName.reset();
        // sector.reset();
        empDate.reset();
        workPermitExpiry.reset();
        workPermitNumber.reset();
        workPermitPresent.reset();
        jobTitle.reset();
        jobTitleDescription.reset();
      }
      empEmployed.setErrors(null);
      companyName.setErrors(null);
      // sector.setErrors(null);
      empDate.setErrors(null);
      workPermitExpiry.setErrors(null);
      workPermitNumber.setErrors(null);
      workPermitPresent.setErrors(null);
      jobTitle.setErrors(null);
      jobTitleDescription.setErrors(null);

      empEmployed.updateValueAndValidity({ emitEvent: false });
      companyName.updateValueAndValidity({ emitEvent: false });
      // sector.updateValueAndValidity({ emitEvent: false });
      empDate.updateValueAndValidity({ emitEvent: false });
      workPermitExpiry.updateValueAndValidity({ emitEvent: false });
      workPermitNumber.updateValueAndValidity({ emitEvent: false });
      workPermitPresent.updateValueAndValidity({ emitEvent: false });
      jobTitle.updateValueAndValidity({ emitEvent: false });
      jobTitleDescription.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setResetCurrentAddressValidator(val) {
    try {
      let addressLine1 = this.empForm.controls.empEmployed.get('currentAddress.addressLine1');
      let addressLine2 = this.empForm.controls.empEmployed.get('currentAddress.addressLine2');
      let poBoxNo = this.empForm.controls.empEmployed.get('currentAddress.poBoxNo');
      let state = this.empForm.controls.empEmployed.get('currentAddress.state');
      let city = this.empForm.controls.empEmployed.get('currentAddress.city');

      // let country = this.empForm.controls.empEmployed.get('currentAddress.country');
      let phoneNo = this.empForm.controls.empEmployed.get('currentAddress.phoneNo');

      if (val === "Yes") {
        addressLine1.setValidators([Validators.required, Validators.maxLength(40)]);
        addressLine2.setValidators([Validators.maxLength(40)]);
        poBoxNo.setValidators([Validators.maxLength(40)]);
        state.setValidators([Validators.maxLength(40)]);
        city.setValidators([Validators.maxLength(40)]);

        // country.setValidators([Validators.required]);
        phoneNo.setValidators([Validators.required, Validators.minLength(10)])
      } else {
        addressLine1.reset()
        addressLine1.setValidators(null);
        addressLine2.reset()
        addressLine2.setValidators(null);
        poBoxNo.reset()
        poBoxNo.setValidators(null);
        city.reset()
        city.setValidators(null);
        state.reset()
        state.setValidators(null);
        // country.reset();
        // country.setValidators(null);
        phoneNo.reset()
        phoneNo.setValidators(null);
      }
      addressLine1.setErrors(null);
      addressLine2.setErrors(null);
      poBoxNo.setErrors(null);
      city.setErrors(null);
      state.setErrors(null);
      // country.setErrors(null);
      phoneNo.setErrors(null);
      addressLine1.updateValueAndValidity({ emitEvent: false });
      addressLine2.updateValueAndValidity({ emitEvent: false });
      poBoxNo.updateValueAndValidity({ emitEvent: false });
      city.updateValueAndValidity({ emitEvent: false });
      state.updateValueAndValidity({ emitEvent: false });
      // country.updateValueAndValidity({ emitEvent: false });
      phoneNo.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  setResetRetiredCurrentAddressValidator(val) {
    try {
      let addressLine1 = this.empForm.controls.empRetired.get('currentAddress.addressLine1');
      let addressLine2 = this.empForm.controls.empRetired.get('currentAddress.addressLine2');
      let poBoxNo = this.empForm.controls.empRetired.get('currentAddress.poBoxNo');
      let state = this.empForm.controls.empRetired.get('currentAddress.state');
      let city = this.empForm.controls.empRetired.get('currentAddress.city');
      let phoneNo = this.empForm.controls.empRetired.get('currentAddress.phoneNo');

      if (val === "Yes") {
        addressLine1.setValidators([Validators.required, Validators.maxLength(40)]);
        addressLine2.setValidators([Validators.maxLength(40)]);
        poBoxNo.setValidators([Validators.maxLength(40)]);
        state.setValidators([Validators.maxLength(40)]);
        city.setValidators([Validators.maxLength(40)]);
        phoneNo.setValidators([Validators.required, Validators.minLength(10)])
      } else {
        addressLine1.reset()
        addressLine1.setValidators(null);
        addressLine2.reset()
        addressLine2.setValidators(null);
        poBoxNo.reset()
        poBoxNo.setValidators(null);
        city.reset()
        city.setValidators(null);
        state.reset()
        state.setValidators(null);
        phoneNo.reset()
        phoneNo.setValidators(null);
      }
      addressLine1.setErrors(null);
      addressLine2.setErrors(null);
      poBoxNo.setErrors(null);
      city.setErrors(null);
      state.setErrors(null);
      phoneNo.setErrors(null);
      addressLine1.updateValueAndValidity({ emitEvent: false });
      addressLine2.updateValueAndValidity({ emitEvent: false });
      poBoxNo.updateValueAndValidity({ emitEvent: false });
      city.updateValueAndValidity({ emitEvent: false });
      state.updateValueAndValidity({ emitEvent: false });
      phoneNo.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  setResetStudentCurrentAddressValidator(val) {
    try {
      let addressLine1 = this.empForm.controls.empStudent.get('currentAddress.addressLine1');
      let addressLine2 = this.empForm.controls.empStudent.get('currentAddress.addressLine2');
      let poBoxNo = this.empForm.controls.empStudent.get('currentAddress.poBoxNo');
      let state = this.empForm.controls.empStudent.get('currentAddress.state');
      let city = this.empForm.controls.empStudent.get('currentAddress.city');
      let phoneNo = this.empForm.controls.empStudent.get('currentAddress.phoneNo');

      if (val === "Yes") {
        addressLine1.setValidators([Validators.required, Validators.maxLength(40)]);
        addressLine2.setValidators([Validators.maxLength(40)]);
        poBoxNo.setValidators([Validators.maxLength(40)]);
        state.setValidators([Validators.maxLength(40)]);
        city.setValidators([Validators.maxLength(40)]);
        phoneNo.setValidators([Validators.required, Validators.minLength(10)])
      } else {
        addressLine1.reset()
        addressLine1.setValidators(null);
        addressLine2.reset()
        addressLine2.setValidators(null);
        poBoxNo.reset()
        poBoxNo.setValidators(null);
        city.reset()
        city.setValidators(null);
        state.reset()
        state.setValidators(null);
        phoneNo.reset()
        phoneNo.setValidators(null);
      }
      addressLine1.setErrors(null);
      addressLine2.setErrors(null);
      poBoxNo.setErrors(null);
      city.setErrors(null);
      state.setErrors(null);
      phoneNo.setErrors(null);
      addressLine1.updateValueAndValidity({ emitEvent: false });
      addressLine2.updateValueAndValidity({ emitEvent: false });
      poBoxNo.updateValueAndValidity({ emitEvent: false });
      city.updateValueAndValidity({ emitEvent: false });
      state.updateValueAndValidity({ emitEvent: false });
      phoneNo.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  setResetBusinessAddressValidator(val) {
    try {
      let addressLine1 = this.empForm.controls.empSelf.get('businessAddress.addressLine1');
      let addressLine2 = this.empForm.controls.empSelf.get('businessAddress.addressLine2');
      let poBoxNo = this.empForm.controls.empSelf.get('businessAddress.poBoxNo');
      let city = this.empForm.controls.empSelf.get('businessAddress.city');
      let state = this.empForm.controls.empSelf.get('businessAddress.state');
      // let country = this.empForm.controls.empSelf.get('businessAddress.country');
      let phoneNo = this.empForm.controls.empSelf.get('businessAddress.phoneNo');

      if (val === "Yes") {
        addressLine1.setValidators([Validators.required, Validators.maxLength(40)]);
        addressLine2.setValidators([Validators.maxLength(40)]);
        poBoxNo.setValidators([Validators.maxLength(40)]);
        state.setValidators([Validators.maxLength(40)]);
        city.setValidators([Validators.maxLength(40)]);
        // country.setValidators([Validators.required]);
        phoneNo.setValidators([Validators.required, Validators.minLength(10)]);
      } else {
        addressLine1.reset()
        addressLine1.setValidators(null);
        addressLine2.reset()
        addressLine2.setValidators(null);
        poBoxNo.reset()
        poBoxNo.setValidators(null);
        city.reset()
        city.setValidators(null);
        state.reset()
        state.setValidators(null);
        // country.reset()
        // country.setValidators(null);
        phoneNo.reset()
        phoneNo.setValidators(null);
      }
      addressLine1.setErrors(null);
      addressLine2.setErrors(null);
      poBoxNo.setErrors(null);
      city.setErrors(null);
      state.setErrors(null);
      // country.setErrors(null);
      phoneNo.setErrors(null);
      addressLine1.updateValueAndValidity({ emitEvent: false });
      addressLine2.updateValueAndValidity({ emitEvent: false });
      poBoxNo.updateValueAndValidity({ emitEvent: false });
      city.updateValueAndValidity({ emitEvent: false });
      state.updateValueAndValidity({ emitEvent: false });
      // country.updateValueAndValidity({ emitEvent: false });
      phoneNo.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }



  back() {
    try {
      window.scroll(0, 0);
      this.empForm.reset();
      this.initModel(this.tabData);
      this.goBack.emit({
        prevTabIndex: 1
      })
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

}











