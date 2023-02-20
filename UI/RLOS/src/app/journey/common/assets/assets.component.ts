import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { JourneyService } from '../../_root/journey.service';
// import { PersonalInfoService } from '../personal-details.service';
// import { LocalizationPipe } from '../../../../../assets/pipes/journey/localization-pipe';
import { ValidationUtilsService } from '../../../core/services';
import { DOMHelperService } from '../../../shared';


@Component({
  selector: 'asset-details',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {
  assetForm: FormGroup = new FormGroup({});
  formControls;
  public submitted: boolean = false;
  dropdownPlaceHolder: string;
  _assetDetailsArray;
  liabilityList: FormArray;
  expensesDetails: FormArray;

  public assetTypeList: any;
  public currecncyTypeList: any;


  assetDetailValues;
  showAddAsset;
  @Input() listItems;
  @Input() isCoApplicant;
  @Input() isComponentReadOnly;

  @Input() tabData;
  @Input() isDocumentUploaded;
  @Input() assetInfo;
  @Input() applicantOrder;
  @Input() required;

  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() openUploadDialog: EventEmitter<any> = new EventEmitter<any>();
  @Output() editUploadDialog: EventEmitter<any> = new EventEmitter<any>();
  @Output() goBack: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _route: Router, private formBuilder: FormBuilder, private validationUtilService: ValidationUtilsService, private _dom: DOMHelperService, private journeyService: JourneyService) { }

  ngOnInit() {
    
    this.createForm();
    this.initModel(this.tabData);
    this.initStaticData();
  }

  initModel(tabData) {
    this.dropdownPlaceHolder = "Please select";
    if (tabData && tabData.id) {
      this.assetForm.get('id').patchValue(tabData.id);
    }

    if (tabData) {
      this.initFormData(tabData);
    }

  }

  initStaticData() {
    this.assetTypeList = this.listItems.assetType;
    this.currecncyTypeList = this.journeyService.getCurrencyList();
    this.liabilityList = this.journeyService.getLiabilityTypeList();
  };

  createForm(data?) {
    
    this.assetForm = this.formBuilder.group({
      id: null,
      assetDetails: this.formBuilder.array([this.createItem()]),
      liabilityDetails: this.formBuilder.array([this.createLiability()]),
      expensesDetails: this.formBuilder.array([this.createExpenses()])
    });

    (<FormArray>this.assetForm.get('assetDetails')).push(
      new FormGroup({
        'assetTypeList': new FormControl(null, Validators.required),
        'type': new FormControl(null, Validators.required),
        'currecncyTypeList': new FormControl(null, Validators.required),
        'instName': new FormControl(null, Validators.required),
        'Registered-Owner-Name': new FormControl(null, Validators.required),
        'lienHoldername': new FormControl(null, Validators.required),
        'lien-Value': new FormControl(null, Validators.required),
      })
    )

    this.formControls = this.assetForm.controls;
    this._assetDetailsArray = this.assetForm.get('assetDetails') as FormArray;
    this.liabilityList = this.assetForm.get('liabilityDetails') as FormArray;
    this.expensesDetails = this.assetForm.get('expensesDetails') as FormArray;

    this.blockInvalidInput(this.assetForm, this.listItems.validationValues.assetDetails);
    //Hemlata
    if (data) {
      Object.keys(this.assetForm.controls).forEach((key: string) => {
        const abstractControl = this.assetForm.controls[key];
        if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
          this.validationUtilService.blockInvalidInput(abstractControl, this.listItems.validationValues.assetDetails);
        } else {
          this.validationUtilService.resetInvalidValue(abstractControl, abstractControl.value, key, this.listItems.validationValues.assetDetails[key]);
        }
      });
    }
  }

  public blockInvalidInput(group: FormGroup | FormArray, validationValues): void {
    let that = this;
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        that.blockInvalidInput(abstractControl, validationValues);
      } else {
        abstractControl.valueChanges.subscribe(function (value) {
          that.validationUtilService.resetInvalidValue(abstractControl, value, key, that.listItems.validationValues.assetDetails[key]);
        });
      }
    });
  }


  createLiability() {
    try {
      return this.formBuilder.group({
        liabilityList: new FormControl(null, Validators.required),
        OACL: new FormControl(null, Validators.required),
        OABA: new FormControl(null, Validators.required),
        currecncyTypeList: new FormControl(null, Validators.required),
        'Monthly-Payment': new FormControl(null, Validators.required),
        'Institution-Name': new FormControl(null, Validators.required),
      });
    } catch (err) {
      console.log(err.message);
    }
  }
  

  createExpenses() {
    try {
      return this.formBuilder.group({
        liabilityList: new FormControl(null, Validators.required),
        frequencyList: new FormControl(null, Validators.required),
        currecncyTypeList: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  get assetDetailsFormGroup() {
    return this.assetForm.get('assetDetails') as FormArray;
  }

  //code added by akash arora


  // 1 field add on krke dikha de only on -> data.type -> COB 

  createItem(data?): FormGroup {
    
    this.assetDetailValues = this.listItems.validationValues.assetDetails;
    try {
    data = data || {};

    return this.formBuilder.group({
      assetTypeList: [data.assetTypeList || null],
        id: [data.id || null],
        type: [{ value: data.type || null, disabled: true }],
        amount: [data.amount || null],
        currecncyTypeList: [data.amount || null],
        instName: [data.instName || null, [Validators.maxLength(40)]],
        comment: [data.comment || null, [Validators.maxLength(40)]],
        applicantOrder: this.applicantOrder,
        assetLabel: data.assetLabel,
        lienHoldername: [
          data.lienHoldername || null,
          [Validators.maxLength(40)],
        ],
        'Registered-Owner-Name': [
          data.lienHoldername || null,
          [Validators.maxLength(40)],
        ],
    });
  }
  catch(error) {
    console.log(error.message)
  }
    //if(data && data.type && data.type === 'COB')
    // if (data.type == 'COB') {
    //   return this.formBuilder.group({
    //     'id': [data.id || null],
    //     'type': [{ value: data.type || null, disabled: true }, Validators.compose(this.validationUtilService.composeValidators(this.assetDetailValues.assetType))],
    //     'amount': [data.amount || null],
    //     'instName': [data.instName || null, [Validators.maxLength(40)]],
    //     'comment': [data.comment || null, [Validators.maxLength(40)]],
    //     "applicantOrder": this.applicantOrder,
    //     'assetLabel': data.assetLabel,
    //     'lienHoldername': [data.lienHoldername || null, [Validators.maxLength(40)]]
    //   });
    // }
    // else {
    //   console.log('else block calleed')
    //   return this.formBuilder.group({
    //     'id': [data.id || null],
    //     'type': [{ value: data.type || null, disabled: true }, Validators.compose(this.validationUtilService.composeValidators(this.assetDetailValues.assetType))],
    //     'amount': [data.amount || null],
    //     'instName': [data.instName || null, [Validators.maxLength(40)]],
    //     'comment': [data.comment || null, [Validators.maxLength(40)]],
    //     "applicantOrder": this.applicantOrder,
    //     'assetLabel': data.assetLabel
    //   });
    // }

    
  };

  initFormData(tabData) {
    let control = <FormArray>this.assetForm.controls['assetDetails'];
    this._assetDetailsArray.removeAt(0);
    // let localTabData = {
    //   assetDetails: [
    //     {
    //       amount:
    //       null,
    //     applicationId
    //       :
    //       null,
    //     assetLabel
    //       :
    //       "Cash at Other Banks/Credit Unions ",
    //     comment
    //       :
    //       null,
    //     instName
    //       :
    //       null,
    //     type
    //       :
    //       "COB"
    //     },
    //     {
    //       amount:
    //       null,
    //     applicationId
    //       :
    //       null,
    //     assetLabel
    //       :
    //       "Cash at Other Banks/Credit Unions ",
    //     comment
    //       :
    //       null,
    //     instName
    //       :
    //       null,
    //     type
    //       :
    //       "FR"
    //     },
    //   ]
     
    // }

    // tabData.assetDetails.forEach(data => {
    //   control.push(this.createItem(data));
    // })
    if (tabData.length === 2) {
      this.showAddAsset = false;
    }
    else {
      this.showAddAsset = true;
    }
  };

  /*addAsset(index?): void {
    console.log("add asset button clicked!");
    if (this._assetDetailsArray.controls.length <= 10) {
      this._assetDetailsArray.push(this.createItem());
      this.validationUtilService.blockInvalidInput(this._assetDetailsArray, this.listItems.validationValues.assetDetails);
      if (this._assetDetailsArray.controls.length === 2) {
        this.showAddAsset = false;
      }
    }
  };*/

  addAsset(){
    (<FormArray>this.assetForm.get('assetDetails')).push(
      new FormGroup({
        'assetTypeList': new FormControl(null, Validators.required),
        'type': new FormControl(null, Validators.required),
        'currecncyTypeList': new FormControl(null, Validators.required),
        'amount': new FormControl(null, Validators.required),
        'comment': new FormControl(null, Validators.required),
        'instName': new FormControl(null, Validators.required),
        'Registered-Owner-Name': new FormControl(null, Validators.required),
        'lienHoldername': new FormControl(null, Validators.required),
        'lien-Value': new FormControl(null, Validators.required),
      })
    )
  }

  removeAsset(index): void {
    (<FormArray>this.assetForm.get('assetDetails')).removeAt(index)
    // this._assetDetailsArray.removeAt(index);
    this.showAddAsset = true;
  };

  addMoreLoan() {
    (<FormArray>this.assetForm.get('liabilityDetails')).push(
      new FormGroup({
        'liabilityList': new FormControl(null, Validators.required),
        'OACL': new FormControl(null, Validators.required),
        'OABA': new FormControl(null, Validators.required),
        'Monthly-Payment': new FormControl(null, Validators.required),
        'Institution-Name': new FormControl(null, Validators.required),
      })
    )
  }
  removeLiability(index){
    (<FormArray>this.assetForm.get('liabilityDetails')).removeAt(index);
  }


  addMoreExpenses() {
    (<FormArray>this.assetForm.get('expensesDetails')).push(
      new FormGroup({
        'liabilityList': new FormControl(null, Validators.required),
        'frequencyList': new FormControl(null, Validators.required),
        'currecncyTypeList': new FormControl(null, Validators.required),
        'amount': new FormControl(null, Validators.required),
      })
    )
  }

  removeExpenses(index){
    (<FormArray>this.assetForm.get('expensesDetails')).removeAt(index);
  }

  back() {
    this.assetForm.removeControl('assetDetails');
    this.createForm();
    this.initModel(this.tabData);
    window.scroll(0, 0);
  };

  setAmountDecimalValue(index) {
    if (this.formControls.assetDetails.controls[index].controls["amount"].value) {
      let amount = this.formControls.assetDetails.controls[index].controls["amount"].value;
      let amtArr = amount.split(".");
      if (amtArr.length > 1 && !amtArr[1]) {
        amtArr[1] = "00";
        amount = amtArr.join(".");
        this.formControls.assetDetails.controls[index].get('amount').setValue(amount);
      }
    }
  }

  continue() {
    if (this.assetForm.valid) {
      this.saveTabData.emit({
        data: this.assetForm.getRawValue(),
        // nextTabIndex: !this._dom.isEmpty(nextTabIndex) ? nextTabIndex : 5,
        tabName: "ASSET",
        actionType: 'CONTINUE',
        // isContinueClicked: (isContinueClicked) ? isContinueClicked : false
      });
    } else {
      this.submitted = true;
    }
  }

  saveAndExit() {
    // if (this.assetForm.valid) {
    this.saveTabData.emit({
      data: this.assetForm.value,
      tabName: "ASSET",
      actionType: 'SAVE'
    });
    // } else {
    //   this.submitted = true;
    // }
  }

  // openDocModule() {
  //   this.openUploadDialog.emit({ order: this.formControls.assetDetails.controls[0].value.applicantOrder });
  // }

  // editDocModule() {
  //   this.editUploadDialog.emit({ order: this.formControls.assetDetails.controls[0].value.applicantOrder });
  // }

  showOtherAssets: boolean =false;
  idx:any

  onResetFieldsAssetShow(data, index){
    this.idx = index
    
    if(data.value.toLowerCase() == 'fr') {
      console.log(data.value, index);
      this.showOtherAssets =true;
      return;
    }
    this.showOtherAssets = false
    console.log("on basis os Asset Select fields shown up")
  }

 

}
