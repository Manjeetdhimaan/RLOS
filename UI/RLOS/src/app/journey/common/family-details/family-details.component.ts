import { Component, OnInit, ViewChild, Input, Output, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormArrayName } from '@angular/forms';
import { ValidationUtilsService } from 'src/app/core/services/validation-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { JourneyService } from '../../_root/journey.service';
import { DOMHelperService } from '../../../shared';

@Component({
  selector: 'app-family-details',
  templateUrl: './family-details.component.html',
  styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsComponent implements OnInit {
  family: FormGroup;
  submitted: boolean;
  private formControls;
  flag: boolean = false;
  public childrenList: FormArray;
  @Input() isComponentReadOnly;
  @Input() hideFields;
  @Input() isJointApplicant;
  @Input() jointApplicantIndex;
  @Input() tabData;
  @Input() listItems;
  @Input() isJuniorAccSelected;
  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToInvalidTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();

  familyDetailValues;
  invalidDateMessage;

  showEvent;
  yearsList = [];
  dependentList = [];
  familyRelationshipList;

  isReadOnly;
  isMiddleNameReadOnly;

  applicationType;
  i = 0;
  // public children: any[] = [{
  //   name: '',
  //   relationship: '',
  //   employerName: '',
  //   Address: '',
  //   telephoneNumber: '',
  //   mobilePhoneNumber: ''
  // }];


  constructor(private formBuilder: FormBuilder, private validationUtilService: ValidationUtilsService, private translate: TranslateService, private JourneyService: JourneyService, private _elementRef: ElementRef, private _dom: DOMHelperService) {
    this.applicationType = this.JourneyService.getFromStorage().applicationType;
  }

  ngOnInit() {
    try {
      window.scroll(0, 0);
      this.createForm();
      this.initStaticData();
      this.initModel(this.tabData);
      // this.childrenvalidate();
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

  initStaticData() {
    try {
      this.yearsList = this.JourneyService.getYears();
      this.dependentList = this.JourneyService.getDependentList();
      this.familyRelationshipList = this.listItems.familyRelationshipList;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initModel(tabData) {
    try {
      if (tabData) {
        this.createForm(tabData);
        if (tabData.childrenDetails) {
          this.initFormData(tabData.childrenDetails);
        }

      }
    }
    catch (exception) {
      console.log(exception.message)
    }
    // this.childrenvalidate();
  };

  initFormData(tabData) {
    try {
      let control = <FormArray>this.family.controls['childrenDetails'];

      while (this.childrenList.length !== 0) {
        this.childrenList.removeAt(0)
      }

      tabData.forEach(data => {
        control.push(this.createchildren(data));
      });
      // this.childrenList.removeAt(0);
      if (this.childrenList.length > 0) {
        this.flag = true;
      } else {
        this.flag = false;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }

  }



  addchildrenDetails() {
    try {
      this.flag = true;
      // this.basicDetailValues = this.listItems.validationValues;
      // if (this.i == 0) {
      //   this.childrenList.removeAt(0)
      //   this.i++
      // }
      this.childrenList.push(this.createchildren());
      this.validationUtilService.blockInvalidInput(this.childrenList, this.familyDetailValues);
      // this.childrenvalidate();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  removeAsset(group: FormGroup, index): void {
    try {
      if (group.get('id').value) {
        this.formControls.childrenDetails.controls[index].controls.id.value = group.get('id').value * -1;
        this.deleteTabData.emit({
          data: {
            familyDetails: this.family.getRawValue()
          },
          tabName: 'FAMILY',
          actionType: 'CONTINUE',
          context: "FAMILY"
        });
      } else {
        this.childrenList.removeAt(index);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  // addchildren() {
  //   this.children.push({
  //     name:  [null  ],
  //     relationship:  [null  ],
  //     employerName:  [null  ],
  //     Address:  [null  ],
  //     telephoneNumber:  [null  ],
  //     mobilePhoneNumber:  [null  ]
  //   });
  // }

  get childrenFormGroup() {
    return this.family.get('childrenDetails') as FormArray;
  }

  createchildren(data?): FormGroup {
    try {
      data = data || {};
      return this.formBuilder.group({
        'id': [data.id || null],
        'name': [data.name || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.name))],
        'relationship': [data.relationship || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.relationship))],
        'employerName': [data.employerName || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.employerName))],
        'address': [data.address || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.address))],
        'telephoneNumber': [data.telephoneNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.telephoneNumber))],
        'mobilePhoneNumber': [data.mobilePhoneNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.mobilePhoneNumber))]
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  // childrenvalidate() {
  //   const mockchildren = this.family.controls.childrenDetails;
  //   let testArray = mockchildren['controls'];
  //   const name = testArray[0]['controls'].name;
  //     const relationship = testArray[0]['controls'].relationship;
  //     const address =testArray[0]['controls'].address;
  //     const mobilePhoneNumber = testArray[0]['controls'].mobilePhoneNumber;

  //     if ( this.flag === 'true') {
  //       name.setValidators([Validators.required]);     
  //       relationship.setValidators([Validators.required]);
  //       address.setValidators([Validators.required]);
  //       mobilePhoneNumber.setValidators([Validators.required]);
  //     }
  //     else{
  //       name.reset();
  //       name.setValidators(null);
  //       relationship.reset();
  //       relationship.setValidators(null);
  //       address.reset();
  //       address.setValidators(null);
  //       mobilePhoneNumber.reset();
  //       mobilePhoneNumber.setValidators(null);
  //     }
  //     name.updateValueAndValidity({ emitEvent: false });
  //     relationship.updateValueAndValidity({ emitEvent: false });
  //     address.updateValueAndValidity({ emitEvent: false });
  //     mobilePhoneNumber.updateValueAndValidity({ emitEvent: false });


  // }

  createForm(data?) {
    try {
      this.familyDetailValues = this.listItems.validationValues.familyDetails;
      data = data || {};
      this.family = this.formBuilder.group({
        'id': [data.id || null],
        // 'noOfDependent': [data.noOfDependent || null],
        'fatherName': [data.fatherName || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.fatherName))],
        'employerName': [data.employerName || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.employerName))],
        'residentialAddress': [data.residentialAddress || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.residentialAddress))],
        'telephoneNumber': [data.telephoneNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.telephoneNumber))],
        'mobilePhoneNumber': [data.mobilePhoneNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.mobilePhoneNumber))],
        'motherName': [data.motherName || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.motherName))],
        'motherEmployerName': [data.motherEmployerName || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.motherEmployerName))],
        'motherResidentialAddress': [data.motherResidentialAddress || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.motherResidentialAddress))],
        'motherTelephoneNumber': [data.motherTelephoneNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.motherTelephoneNumber))],
        'motherMobilePhoneNumber': [data.motherMobilePhoneNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.familyDetailValues.motherMobilePhoneNumber))],
        childrenDetails: this.formBuilder.array([])
      })
      this.childrenList = this.family.get('childrenDetails') as FormArray;
      this.formControls = this.family.controls;
      this.validationUtilService.blockInvalidInput(this.family, this.familyDetailValues);
    }
    catch (exception) {
      console.log(exception.message)
    }

  }

  back() {
    try {
      window.scroll(0, 0);
      this.family.reset();
      this.initModel(this.tabData);
      this.goBack.emit({
        prevTabIndex: 4
      })
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  continue(nextTabIndex?, isContinueClicked?) {
    try {
      if (this.family.valid) {
        this.saveTabData.emit({
          // data: this.family.value,
          data: {
            familyDetails: this.family.value
          },
          nextTabIndex: !this._dom.isEmpty(nextTabIndex) ? nextTabIndex : 6,
          tabName: 'FAMILY',
          actionType: 'CONTINUE',
          context: "FAMILY",
          isContinueClicked: (isContinueClicked) ? isContinueClicked : false
        });
      } else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.family);
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
          familyDetails: this.family.value
        },
        tabName: 'FAMILY',
        actionType: 'SAVE',
        context: "FAMILY"
      });
    } catch (exception) {
      console.log(exception.message)
    }


  }

}
