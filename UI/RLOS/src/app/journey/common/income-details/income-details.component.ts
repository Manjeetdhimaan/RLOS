import { Component, OnInit, Input, Output, EventEmitter, ElementRef, SimpleChanges } from '@angular/core';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

// import { PersonalInfoService } from '../personal-details.service';
// import { LocalizationPipe } from '../../../../../assets/pipes/journey/localization-pipe';
import { ValidationUtilsService } from '../../../core/services';
import { DOMHelperService } from '../../../shared';

@Component({
  selector: 'income-details',
  templateUrl: './income-details.component.html',
  styleUrls: ['./income-details.component.scss']
})
export class IncomeDetailsComponent implements OnInit {
  incomeForm: FormGroup;
  formControls;
  submitted: boolean;
  dropdownPlaceHolder: string;
  _incomeDetailsArray;
  incomeTypeList: any;
  incomeFrequencyList: any;
  empTypeList: any;
  incomeDetailValues;
  showAddIncomeBtn;
  noIncome=[false];
  @Input() tabData;
  @Input() listItems;
  @Input() isCoApplicant;
  @Input() incomeInfo;
  @Input() isComponentReadOnly;

  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToInvalidTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _route: Router, private formBuilder: FormBuilder, private validationUtilService: ValidationUtilsService, private _elementRef: ElementRef, private _dom: DOMHelperService) {
  }

  ngOnInit() {
    try {
      window.scroll(0, 0);
      this.createForm();
      this.initModel(this.tabData);
      this.initStaticData();
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
    try {
      if (this.incomeForm) {
        this.showAddIncomeBtn = true;
        this.dropdownPlaceHolder = "Please select";
        if (tabData) {
          this.initFormData(tabData);
        }
        if (tabData && tabData.id) {
          this.incomeForm.get('id').patchValue(tabData.id);
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initStaticData() {
    try {
      this.incomeTypeList = this.listItems.incomeTypeList;
      this.incomeFrequencyList = this.listItems.incomeFrequencyList;
      this.empTypeList = this.listItems.empTypeList;
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  createForm() {
    try {
      this.incomeForm = this.formBuilder.group({
        id: null,
        incomeDetails: this.formBuilder.array([this.createItem()])
      })
      this.formControls = this.incomeForm.controls;

      this._incomeDetailsArray = this.incomeForm.get('incomeDetails') as FormArray;

      this.blockInvalidInput(this._incomeDetailsArray, this.listItems.validationValues.incomeDetails);

      this._incomeDetailsArray.valueChanges.subscribe((a) => {
        // this.statusChanged(a);      
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  public blockInvalidInput(group: FormGroup | FormArray, validationValues): void {
    try {
      let that = this;
      Object.keys(group.controls).forEach((key: string) => {
        const abstractControl = group.controls[key];
        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
          that.blockInvalidInput(abstractControl, validationValues);
        } else {
          abstractControl.valueChanges.subscribe(function (value) {
            that.validationUtilService.resetInvalidValue(abstractControl, value, key, that.listItems.validationValues.incomeDetails[key]);
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
      this.incomeDetailValues = this.listItems.validationValues.incomeDetails;
      data = data || {};
      return this.formBuilder.group({
        'id': [data && data.id ? data.id : null],
        'incomeType': [data && data.incomeType ? data.incomeType : null, Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.incomeType))],
        'amount': [data.amount || null, Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.amount))],
        'frequency': [data.frequency || null, Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.frequency))],
        'income': [data.income || null, Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.income))],
        'comment': [data.comment || null, Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.comment))],
        'primarySourceOfIncome': [data.primarySourceOfIncome || false]
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  initFormData(tabData) {
    try {
      if (this.incomeForm) {
        let control = <FormArray>this.incomeForm.controls['incomeDetails'];
        while (this._incomeDetailsArray.length !== 0) {
          this._incomeDetailsArray.removeAt(0)
        }
        // this._incomeDetailsArray.removeAt(0);
        tabData.incomeDetails.forEach((data, index) => {
          control.push(this.createItem(data));
          if (data && data.amount === 0) {
            control.controls[index].get('amount').setValue(0)
          }
          if (data && data.income === 0) {
            control.controls[index].get('income').setValue(0)
          }
          this.onSelectIncomeType({value: data.incomeType}, index);

        });

        if (tabData.incomeDetails.length === 10) {
          this.showAddIncomeBtn = false;
        }
        else {
          this.showAddIncomeBtn = true;
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  addIncome(index?): void {
    try {
      if (this._incomeDetailsArray.controls.length <= 10) {
        this._incomeDetailsArray.push(this.createItem());
        this.validationUtilService.blockInvalidInput(this._incomeDetailsArray, this.listItems.validationValues.incomeDetails);
        if (this._incomeDetailsArray.controls.length === 10) {
          this.showAddIncomeBtn = false;
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  removeIncome(group: FormGroup, index): void {
    try {
      if (group.get('id').value) {
        this.formControls.incomeDetails.controls[index].controls.id.value = group.get('id').value * -1;
        this.deleteTabData.emit({
          data: (
            this.incomeForm.getRawValue()
          ),
          tabName: 'INCOME',
          actionType: 'CONTINUE',
          context: "INCOME"
        });
      } else {
        this._incomeDetailsArray.removeAt(index);
      }
      this.showAddIncomeBtn = true;
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  // back() {
  //   this.incomeForm.removeControl('incomeDetails');
  //   this.createForm();
  //   this.initModel(this.tabData);
  //   this.submitted = false;
  //   window.scroll(0, 0);
  //   this.goBack.emit({
  //     prevTabIndex: 2
  //   })
  // };

  back() {
    try {
      window.scroll(0, 0);
      this.incomeForm.reset();
      this.initModel(this.tabData);
      this.goBack.emit({
        prevTabIndex: 2
      })
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  setIncome(index) {
    try {
      let amount = this.formControls.incomeDetails.controls[index].controls.amount.value;
      let frequency = this.formControls.incomeDetails.controls[index].controls.frequency.value;

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
        // this.formControls.incomeDetails.controls.income.setValue(income);
        this.formControls.incomeDetails.controls[index].controls.income.setValue(income);
        this.formControls.incomeDetails.controls[index].controls.income.disable();
      } else if (amount === 0) {
        // this.formControls.incomeDetails.controls.income.setValue(0);
        this.formControls.incomeDetails.controls[index].controls.income.setValue(0);
        this.formControls.incomeDetails.controls[index].controls.income.disable();
      }
      else {
        // this.formControls.incomeDetails.controls.income.setValue(null);
        this.formControls.incomeDetails.controls[index].controls.income.setValue(null);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  continue(nextTabIndex?, isContinueClicked?) {
    try {
      if (this.incomeForm.valid) {
        this.saveTabData.emit({
          data: (
            this.incomeForm.getRawValue()
          ),
          nextTabIndex: !this._dom.isEmpty(nextTabIndex) ? nextTabIndex : 4,
          tabName: 'INCOME',
          actionType: 'CONTINUE',
          context: "INCOME",
          isContinueClicked: (isContinueClicked) ? isContinueClicked : false
        });
      } else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.incomeForm);
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
        data: (
          this.incomeForm.getRawValue()
        ),
        tabName: 'INCOME',
        actionType: 'SAVE',
        context: "INCOME"
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  //added by kishori for dynamic validation on selecting Income Type
  onSelectIncomeType(event, index){
      let amount =this.formControls.incomeDetails.controls[index].controls.amount;
      let frequency = this.formControls.incomeDetails.controls[index].controls.frequency;
      let income = this.formControls.incomeDetails.controls[index].controls.income;
      if(event.value === 'NI'){
        amount.setValidators(null);
        frequency.setValidators(null);
        income.setValidators(null);
        this.noIncome[index] = true;

      }else{
        amount.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.amount)));
        frequency.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.frequency)));
        income.setValidators(Validators.compose(this.validationUtilService.composeValidators(this.incomeDetailValues.income)));
        this.noIncome[index] = false;
      }
      amount.updateValueAndValidity({ emitEvent: false });
      frequency.updateValueAndValidity({ emitEvent: false });
      income.updateValueAndValidity({ emitEvent: false });
  }

}
