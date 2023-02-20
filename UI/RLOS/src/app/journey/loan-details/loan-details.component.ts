import { Component, OnInit, Input, ViewChild, Output, Renderer2, ElementRef, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormArrayName, ValidatorFn, AbstractControl } from '@angular/forms';
import { forkJoin } from "rxjs";
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { JourneyService } from '../_root/journey.service';
import { PersistanceService, EnumsService, ValidationUtilsService } from '../../core/services';
import { LoanDetailsService } from './loan-details.service';
import { DOMHelperService, CustomValidatorsService, MessageService } from '../../shared';
import { SaveExitConfirmComponent, UploadDialog } from '../common/overlays';
import { environment } from 'environments/environment';

declare var require: any;

@Component({
  selector: 'app-get-started',
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss']
})
export class LoanDetailsComponent implements OnInit {
  formControls;
  startForm: FormGroup;
  loanType;
  loanList;
  loanTypeTooltip;
  dropdownPlaceholder = "Please Select";
  alert = {};
  LoandetailsValues;
  isDocumentUploaded: boolean = false
  private model: any;
  private data: any;
  private applicantList: any;
  private primaryApplicantList: any;
  action: any;
  loanAmountToolTip;
  showLoanAmountToolTip = false;
  hasCollateral;
  isLoanAmountInvalid;
  invalidLoanAmountMessage;
  showTooltip;
  isSaveCollateralDataCalled;

  conditionTypeList = [];
  financeTypeList = [];
  loanPurposeList = [];
  collateralTypeList = [];
  yesNoList;
  payoffTypeList = [];
  autoDebitList;
  showAutoDebit;
  loanAmounMinMax;
  showCollateralType;
  loanProduct;
  financeType;
  loanPurposeType;
  loanTypeList = [];
  collateralDetails = {};
  imageData = {};
  flag: string;
  draft: string;
  submitted: boolean;
  public cardList: FormArray;
  public overdraftList: FormArray;
  collateralData: any = {};
  termsList;
  loanTypes;
  hasCollateralList;
  cardTypeList;
  colateralTypeList;
  primaryOwnerList;
  currencyList;
  branchList;
  private collateralDTOForSave;
  collateralObject;
  i = 0;
  j = 0;
  productType;

  @ViewChild('auto_vehicle_loan') cref_auto_vehicle_loan;
  // @Output() saveData: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();


  constructor(private journeyService: JourneyService,
    private _route: Router,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private persistanceService: PersistanceService,
    private enumsService: EnumsService,
    private renderer: Renderer2,
    private loanDetailsService: LoanDetailsService,
    private dom: DOMHelperService,
    private translate: TranslateService,
    private _elementRef: ElementRef,
    private validationUtilService: ValidationUtilsService,
    private messageService: MessageService,
    private customValidatorsService: CustomValidatorsService) {
    window.scroll(0, 0);
    this.journeyService.setStepper(3);
    let currentStep = 3;
    this.messageService.sendStepper(currentStep);
  }

  maxOverdraftListLimit;
  maxCCListLimit;
  ngOnInit() {
    try {
      this.data = this.loanDetailsService.getLoanDetails();
      if (this.data && this.data.product) {
        this.productType = this.data.product;
      }

      if (this.data && this.data.loanType) {
        this.model = this.data.loanType;
      }

      this.initStaticData();
      this.applicantList = this.loanDetailsService.getapplicant();
      this.primaryApplicantList = this.loanDetailsService.getPrimaryApplicantList();
      this.maxCCListLimit = this.applicantList.length * this.cardTypeList.length;
      this.maxOverdraftListLimit = this.primaryApplicantList.length;
      this.createForm(this.data);
      this.initModel(this.data);



      this.isLoanAmountInvalid = false;
      this.showCollateralType = true;
      this.collateralValidate();
      this.loanValidate();
      this.cardValidate();
      this.overdraftValidate();
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  modifyCrediCardList() {
    if (this.cardTypeList && this.cardTypeList.length > 0) {
      this.cardTypeList.forEach(element => {
        element['type'] = (element.label).toLowerCase().includes("suncard") ? "Sun Card" : "Master Card";
      });
      return this.cardTypeList;
    }
  }

  initStaticData() {
    try {
      this.yesNoList = [{ code: "Yes", label: "Yes" }, { code: "No", label: "No" }];
      this.hasCollateralList = this.yesNoList;
      this.loanList = this.journeyService.getLoanProductType();
      this.loanTypeList = this.journeyService.getLoanType();
      this.cardTypeList = this.journeyService.getCardType();
      this.cardTypeList = this.modifyCrediCardList();
      this.branchList = this.journeyService.getBranchList();
      // this.currencyList = [{ code: "USD", label: "USD" }, { code: "BSD", label: "BSD" }];
      this.currencyList = this.journeyService.getCurrencyList();

      //subhasree 
      // this.loanPurposeList = this.journeyService.getLoanPurposeList(this.model.loanProduct);
      this.loanPurposeList = this.journeyService.getLoanPurposeList();
      this.termsList = this.journeyService.getTerm();
      this.conditionTypeList = this.journeyService.getConditionTypeList();
      this.loanAmounMinMax = this.loanDetailsService.getLoanAmountMinMax();
      this.colateralTypeList = this.journeyService.getCollateralTypeList();
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  get idFormGroup() {
    return this.startForm.get('creditCardDetails') as FormArray;
  }
  // createFilledCard(data){
  //   return this.formBuilder.group({
  //     'cardsRequiredFor': [this.applicantList || null, Validators.compose([Validators.required])],
  //     'cardType': [data.cardType || null, Validators.compose([Validators.required])],
  //     'branch': [data.branch || null, Validators.compose([Validators.required])]
  //   });
  // }

  createCard(data?): FormGroup {
    try {
      data = data || {};

      return this.formBuilder.group({
        'id': [data.id || null],
        'order': [data.order || null],
        'cardsRequiredFor': [data.cardsRequiredFor || null, Validators.compose([Validators.required])],
        'cardType': [data.cardType || null, Validators.compose([Validators.required])],
        'branch': [data.branch || null, Validators.compose([Validators.required])]
      });

    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  removeCard(index): void {
    try {
      this.cardList.removeAt(index);
      this.showAddCreditCardBtn = true;
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  get overdraftFormGroup() {
    return this.startForm.get('overdraftDetails') as FormArray;
  }

  createOverdraft(data?): FormGroup {
    try {
      data = data || {};
      return this.formBuilder.group({
        'id': [data.id || null],
        'order': [data.order || null],
        'overdraftRequiredFor': [data.overdraftRequiredFor || null, Validators.compose([Validators.required])],
        'overdraftPurpose': [data.overdraftPurpose || null, Validators.compose([Validators.required])],
        'otherOverdraftPurpose': [data.otherOverdraftPurpose || null],
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  removeOverdraft(index): void {
    try {
      this.overdraftList.removeAt(index);
      this.showAddOverDraftBtn = true;
    }
    catch (exception) {
      console.log(exception.message)
    }
  };


  createForm(data?) {
    try {
      this.journeyService.backFlag = true;
      data = data || {};
      var validationValues = require('../../../assets/validators/journey/validation-values.json');
      this.LoandetailsValues = validationValues.application.loanDetails;
      this.startForm = this.formBuilder.group({
        'id': [data.id || null],
        'collateralInsertionId': [data.collateralInsertionId || null],
        'product': [this.productType || null],
        'loanType': [data.loanType || null],
        'collateralName': [data.collateralName || null],
        'hasCollateral': [data.hasCollateral || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.loanProductType))],
        'loanPurposeType': [data.loanPurposeType || null, Validators.compose(this.validationUtilService.composeValidators(this.LoandetailsValues.loanPurposeType))],
        'amountRequired': [data.amountRequired || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.amountRequired))],
        'collateralType': [data.collateralType || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralType))],
        'otherCollateral': [data.otherCollateral || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.otherCollateral))],
        'collateralValue': [data.collateralValue || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.collateralValue))],
        'presentCollateralValue': [data.presentCollateralValue || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.presentCollateralValue))],
        'currency': [data.currency || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.currency))],
        'primaryOwner': [data.primaryOwner || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.primaryOwner))],
        'loanTerm': [data.loanTerm || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.loanTerm))],
        // 'loanAmount': [data.loanAmount ||null],
        'loanPurposeOthers': [data.loanPurposeOthers || null, Validators.compose(this.validationUtilService.composeValidators(validationValues.application.loanDetails.loanTerm))],
        // creditCardDetails: this.formBuilder.array([this.createCard(data.creditCardDetails || null)] || null),
        // overdraftDetails: this.formBuilder.array([this.createOverdraft(data.overdraftDetails || null)]),

      });
      // this.overdraftList = this.startForm.get('overdraftDetails') as FormArray;
      // this.cardList = this.startForm.get('creditCardDetails') as FormArray;
      this.formControls = this.startForm.controls;

      if (this.productType && this.productType === 'Loan' && this.model) {
        this.startForm.get('loanType').patchValue(this.model);
      }
      this.blockInvalidInput(this.startForm, this.LoandetailsValues);
      if (data) {
        Object.keys(this.startForm.controls).forEach((key: string) => {
          const abstractControl = this.startForm.controls[key];
          if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
            this.validationUtilService.blockInvalidInput(abstractControl, this.LoandetailsValues);
          } else {
            this.validationUtilService.resetInvalidValue(abstractControl, abstractControl.value, key, this.LoandetailsValues[key]);
          }
        });
      }
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
            that.validationUtilService.resetInvalidValue(abstractControl, value, key, that.LoandetailsValues[key]);
          });
        }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initModel(data?) {
    try {
      this.showAddCreditCardBtn = true;
      this.showAddOverDraftBtn = true;
      if (data) {
        this.createForm(data);
        // if (data.creditCardDetails) {
        //   this.initFormData(data);
        // }
        if (data.overdraftDetails) {
          this.initFormData(data);
        }
      }
      if (this.model && this.model.hasCollateral) {
        this.showTooltip = true;
        if (this.model.hasCollateral === 'Yes') {
          setTimeout(() => this.initChildComponents(this.model), 20);
        }
      }
      else {
        this.showTooltip = false;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  showAddOverDraftBtn;
  showAddCreditCardBtn;
  initFormData(tabData) {
    try {
      if (tabData && tabData.product === 'Credit Card') {
        const creditCardDetailsArray = this.startForm.get('creditCardDetails') as FormArray;

        while (creditCardDetailsArray.length !== 0) {
          creditCardDetailsArray.removeAt(0)
        }
        // creditCardDetailsArray.removeAt(0);
        tabData.creditCardDetails.forEach(data => {
          creditCardDetailsArray.push(this.createCard(data));
        });
        if (tabData.creditCardDetails.length === this.maxCCListLimit) {
          this.showAddCreditCardBtn = false;
        }
        else {
          this.showAddCreditCardBtn = true;
        }
      } else if (tabData && tabData.product === 'Overdraft') {
        const overdraftDetailsArray = this.startForm.get('overdraftDetails') as FormArray;
        overdraftDetailsArray.removeAt(0);
        tabData.overdraftDetails.forEach(data => {
          overdraftDetailsArray.push(this.createOverdraft(data));
        });
        if (tabData.overdraftDetails.length === this.maxOverdraftListLimit) {
          this.showAddOverDraftBtn = false;
        }
        else {
          this.showAddOverDraftBtn = true;
        }
      }

    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  addcardDetails() {
    try {
      // this.flag = 'true';
      var validationValues = require('../../../assets/validators/journey/validation-values.json');
      this.LoandetailsValues = validationValues.application.loanDetails;
      // if (this.i == 0) {
      //   this.cardList.removeAt(0)
      //   this.i++
      // }
      this.cardList.push(this.createCard());
      this.validationUtilService.blockInvalidInput(this.cardList, this.LoandetailsValues);
      this.cardValidate();
      if (this.cardList.length === this.maxCCListLimit) {
        this.showAddCreditCardBtn = false;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  addoverdraft() {
    try {
      var validationValues = require('../../../assets/validators/journey/validation-values.json');
      this.LoandetailsValues = validationValues.application.loanDetails;
      this.overdraftList.push(this.createOverdraft());
      this.validationUtilService.blockInvalidInput(this.overdraftList, this.LoandetailsValues);
      this.overdraftValidate();
      if (this.overdraftList.length === this.maxOverdraftListLimit) {
        this.showAddOverDraftBtn = false;
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initChildComponents(model) {
    try {
      if (model && model.loanProduct) {
        let collateralTypeDetailsForm = this.getFormByLoanAndCollateralType(model.loanProduct);
        if (model.collateralTypeDetails) {
          collateralTypeDetailsForm.patchValue(model.collateralTypeDetails);
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  cardValidate() {
    try {
      const mockCard = this.startForm.controls.creditCardDetails;
      let testArray = mockCard['controls'];
      const cardsRequiredFor = testArray[0]['controls'].cardsRequiredFor;
      const cardType = testArray[0]['controls'].cardType;
      const branch = testArray[0]['controls'].branch;

      if (this.model === 'Credit Card') {
        cardsRequiredFor.setValidators([Validators.required]);
        cardType.setValidators([Validators.required]);
        branch.setValidators([Validators.required]);

      }
      else {
        cardsRequiredFor.reset();
        cardsRequiredFor.setValidators(null);
        cardType.reset();
        cardType.setValidators(null);
        branch.reset();
        branch.setValidators(null);
      }
      cardsRequiredFor.updateValueAndValidity({ emitEvent: false });
      cardType.updateValueAndValidity({ emitEvent: false });
      branch.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  overdraftValidate() {
    try {
      const mockoverdraft = this.startForm.controls.overdraftDetails;
      let tempArray = mockoverdraft['controls'];
      const overdraftRequiredFor = tempArray[0]['controls'].overdraftRequiredFor;
      const overdraftPurpose = tempArray[0]['controls'].overdraftPurpose;
      const otherOverdraftPurpose = tempArray[0]['controls'].otherOverdraftPurpose;

      if (this.model === 'Overdraft') {
        overdraftRequiredFor.setValidators([Validators.required]);
        overdraftPurpose.setValidators([Validators.required]);
        otherOverdraftPurpose.setValidators([]);

      }
      else {
        overdraftRequiredFor.reset();
        overdraftRequiredFor.setValidators(null);
        overdraftPurpose.reset();
        overdraftPurpose.setValidators(null);
        otherOverdraftPurpose.reset();
        otherOverdraftPurpose.setValidators(null);
      }
      overdraftRequiredFor.updateValueAndValidity({ emitEvent: false });
      overdraftPurpose.updateValueAndValidity({ emitEvent: false });
      otherOverdraftPurpose.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  loanValidate() {
    try {
      const loanType = this.startForm.get('loanType');
      const loanTerm = this.startForm.get('loanTerm');
      const amountRequired = this.startForm.get('amountRequired');
      const loanPurposeOthers = this.startForm.get('loanPurposeOthers');
      const loanPurposeType = this.startForm.get('loanPurposeType');

      if (this.model === 'Overdraft' || this.model === 'Credit Card') {
        loanTerm.reset();
        loanTerm.setValidators(null);
        amountRequired.reset();
        amountRequired.setValidators(null);
        loanPurposeOthers.reset();
        loanPurposeOthers.setValidators(null);
        loanPurposeType.reset();
        loanPurposeType.setValidators(null);
      }
      else {
        loanTerm.setValidators([Validators.required]);
        amountRequired.setValidators([Validators.required]);
        loanPurposeType.setValidators([Validators.required]);
        if (this.startForm.get('loanPurposeType').value === 'NG_15') {
          loanPurposeOthers.setValidators([Validators.required]);
        }
        else {
          loanPurposeOthers.reset();
          loanPurposeOthers.setValidators(null);
        }
      }

      loanTerm.updateValueAndValidity({ emitEvent: false });
      amountRequired.updateValueAndValidity({ emitEvent: false });
      loanPurposeType.updateValueAndValidity({ emitEvent: false });
      loanPurposeOthers.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  collateralValidate() {
    try {
      const collateralOption = this.startForm.get('hasCollateral');
      const collateralType = this.startForm.get('collateralType');
      const otherCollateral = this.startForm.get('otherCollateral');
      const collateralValue = this.startForm.get('collateralValue');
      const presentCollateralValue = this.startForm.get('presentCollateralValue');
      const currency = this.startForm.get('currency');
      const primaryOwner = this.startForm.get('primaryOwner');

      if (this.startForm.get('hasCollateral').value === 'Yes') {
        primaryOwner.setValidators([Validators.required]);
        collateralType.setValidators([Validators.required]);
        collateralValue.setValidators([Validators.required]);
        presentCollateralValue.setValidators([Validators.required]);
        currency.setValidators([Validators.required]);
        if (this.startForm.get('collateralType').value === 'NG_OTHER') {
          otherCollateral.setValidators([Validators.required]);
        }
        else {
          otherCollateral.reset();
          otherCollateral.setValidators(null);
        }
      }
      else {
        primaryOwner.reset();
        primaryOwner.setValidators(null);
        collateralType.reset();
        collateralType.setValidators(null);
        otherCollateral.reset();
        otherCollateral.setValidators(null);
        collateralValue.reset();
        collateralValue.setValidators(null);
        presentCollateralValue.reset();
        presentCollateralValue.setValidators(null);
        currency.reset();
        currency.setValidators(null);
      }

      primaryOwner.updateValueAndValidity({ emitEvent: false });
      collateralType.updateValueAndValidity({ emitEvent: false });
      otherCollateral.updateValueAndValidity({ emitEvent: false });
      collateralValue.updateValueAndValidity({ emitEvent: false });
      presentCollateralValue.updateValueAndValidity({ emitEvent: false });
      currency.updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  saveDataInStorage(data) {
    try {
      let appData = this.persistanceService.getFromJourneyStorage();
      appData = Object.assign(appData, { loanDetails: data });
      this.persistanceService.setInJourneyStorage(appData);
      this._route.navigate(['/journey/financial-info']);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  showAlert;
  userInfo;
  continue(data) {
    try {
      this.alert = {};
      this.action = 'CONTINUE';
      let preferenceData = "LOANINFORMATION";

      // this.startForm.markAsTouched();
      if (this.startForm.valid) {
        let appData = this.journeyService.getFromStorage();
        //for Credit Card
        // if (this.formControls.product.value === 'Credit Card' && this.formControls.creditCardDetails.length > 1) {
        //   let ccList = this.startForm.controls['creditCardDetails'].value;
        //   let isCCListNotUnique = this.IsCreditCardListNotUnique(ccList);
        //   if (isCCListNotUnique) {
        //     var alertObj = {
        //       type: 'error',
        //       message: 'Same Type of Card is already present for the applicant.',
        //       showAlert: true,
        //     }
        //     window.scroll(0, 0);
        //     this.showAlert = true;
        //     this.alert = alertObj;
        //     return;
        //   }
        // }

        //for Overdraft facility
        // if (this.formControls.product.value === 'Overdraft' && this.formControls.overdraftDetails.length > 1) {
        //   let overdraftList = this.startForm.controls['overdraftDetails'].value;
        //   let isOverdraftListNotUnique = this.isOverDraftListNotUnique(overdraftList);
        //   if (isOverdraftListNotUnique) {
        //     var alertObj = {
        //       type: 'error',
        //       message: 'Overdraft details is already present for the applicant.',
        //       showAlert: true,
        //     }
        //     window.scroll(0, 0);
        //     this.showAlert = true;
        //     this.alert = alertObj;
        //     return;
        //   }
        // }

        if (environment.isMockingEnabled) {
          this.saveDataInStorage(this.startForm.value);
        } else {

          let loanDetailsObject = this.loanDetailsService.modelToDto({ loanDetails: this.startForm.value });
          appData = { ...appData, ...{ loanDetails: loanDetailsObject } };

          this.loanDetailsService.saveLoanDetailsData({
            arn: appData.arn,
            appData: appData,
            context: preferenceData,
            saveFlag: false
          }).subscribe((response) => {
            if (response && response.success && response.data) {
              this.journeyService.setInStorage(response.data);
              this._route.navigate(['/journey/financial-info']);
            }
          },
            errorObject => {
              var alertObj = {
                type: "error",
                fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                showAlert: true,
                stackTrace: {}
              }
              window.scroll(0, 0);
              this.showAlert = true;
              this.alert = alertObj;
            });
        }
      }
      else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.startForm);
        this.dom.moveToInvalidField(this._elementRef);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  saveAndExitApp(value, formName) {
    try {

      const dialogRef = this.dialog.open(SaveExitConfirmComponent, {
        width: '600px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === "Y") {
          this.action = 'SAVE';
          let appData = this.journeyService.getFromStorage();
          let preferenceData = "LOANINFORMATION";
          //for Credit Card
          if (this.formControls.product.value === 'Credit Card' && this.formControls.creditCardDetails.length > 1) {
            let ccList = this.startForm.controls['creditCardDetails'].value;
            let isCCListNotUnique = this.IsCreditCardListNotUnique(ccList);
            if (isCCListNotUnique) {
              var alertObj = {
                type: 'error',
                message: 'Same type of Card is already present for the applicant.',
                showAlert: true,
              }
              window.scroll(0, 0);
              this.showAlert = true;
              this.alert = alertObj;
              return;
            }
          }

          //for Overdraft facility
          if (this.formControls.product.value === 'Overdraft' && this.formControls.overdraftDetails.length > 1) {
            let overdraftList = this.startForm.controls['overdraftDetails'].value;
            let isOverdraftListNotUnique = this.isOverDraftListNotUnique(overdraftList);
            if (isOverdraftListNotUnique) {
              var alertObj = {
                type: 'error',
                message: 'Overdraft details is already present for the applicant.',
                showAlert: true,
              }
              window.scroll(0, 0);
              this.showAlert = true;
              this.alert = alertObj;
              return;
            }
          }

          if (this.startForm) {
            let loanDetailsObject = this.loanDetailsService.modelToDto({ loanDetails: this.startForm.value });
            appData = { ...appData, ...{ loanDetails: loanDetailsObject } };
            this.loanDetailsService.saveLoanDetailsData({
              arn: appData.arn,
              appData: appData,
              context: preferenceData,
              saveFlag: true
            }).subscribe((response) => {
              if (response && response.success && response.data) {
                this.journeyService.setInStorage(response.data);
                this.alert = {};
                this._route.navigate(['journey/save']);
              }
            },
              errorObject => {
                var alertObj = {
                  type: "error",
                  fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                  message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                  showAlert: true,
                  stackTrace: {}
                }
                window.scroll(0, 0);
                this.showAlert = true;
                this.alert = alertObj;
              });
          }
        }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }



  IsCreditCardListNotUnique(ccList) {
    try {
      this.userInfo = null;

      if (ccList && ccList.length > 1) {

        ccList.forEach(element => {
          element['cardUniqueType'] = element.cardType ? this.journeyService.getCardTypeFromCode(this.cardTypeList, element.cardType) : null //to identify card is master or suncard
        });

        const status = ccList.some(user => {
          let counter = 0;
          for (const iterator of ccList) {
            if (iterator.cardsRequiredFor === user.cardsRequiredFor && iterator.cardUniqueType === user.cardUniqueType) {
              counter += 1;
            }
          }
          return counter > 1;
        });
        return status;
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }

  isOverDraftListNotUnique(overdraftList) {
    try {
      this.userInfo = null;
      if (overdraftList && overdraftList.length > 1) {
        const status = overdraftList.some(user => {
          let counter = 0;
          for (const iterator of overdraftList) {
            if (iterator.overdraftRequiredFor === user.overdraftRequiredFor) {
              counter += 1;
            }
          }
          return counter > 1;
        });
        return status;
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }


  checkInvalidCREFType() {
    try {
      if (this.cref_auto_vehicle_loan && !this.cref_auto_vehicle_loan.autoVehicleLoanForm.valid) {
        this.cref_auto_vehicle_loan.save(this.action);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  checkCollateralData(values, formName, action) {
    try {
      this.alert = {};
      if (this.startForm.get('hasCollateral').value === 'Yes') {
        let cref_collateralType = this.getComponentByLoanAndCollateralType(this.model.loanProduct);
        if (cref_collateralType) {
          cref_collateralType.save(this.action);
        }
      }
      else if (this.startForm.get('hasCollateral').value === 'No') {
        this.saveData();
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  formatDate(value) {
    return (value < 10 ? '0' + value : value);
  };


  openUploadDialog(uploadedDocs?) {
    uploadedDocs = uploadedDocs ? uploadedDocs : this.journeyService.getDealerInvoice();
    const dialogRef = this.dialog.open(UploadDialog, {
      // width: '500px',
      data: {
        imageData: uploadedDocs,
        captureDealerInvoice: true,
        buckets: [{
          docTypeCode: "W2",
          docName: "Personal Financial Statement",
          mandatory: false,
          processingRequired: false,
          size: 1
        }]
      }
    });
    return dialogRef.afterClosed();
  }

  saveData(collateralTypeDetails?) {
    try {
      let appData = this.journeyService.getFromStorage();
      var loanObj = {
        loanDetails: { ...appData.loanDetails, ...this.startForm.getRawValue() }
      };
      if (collateralTypeDetails) {
        collateralTypeDetails.loanProduct = loanObj.loanDetails.loanProduct;
        loanObj.loanDetails.collateralTypeDetails = collateralTypeDetails;
      }
      appData = { ...appData, ...loanObj };
      appData.loanDetails.applicationId = appData.id;
      delete appData.preferences;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  savePreferences() {
    try {
      let preferenceData = {
        lastVisitedPage: "LOANINFORMATION"
      }
      this.journeyService.savePreference({
        contextObj: preferenceData
      }).subscribe(
        response => {
        }, error => {
          var alertObj = {
            type: "error",
            message: error.message,
            showAlert: true,
            stackTrace: {}
          }
          window.scroll(0, 0);
          this.showAlert = true;
          this.alert = alertObj;
        });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  /*
  REVIEW COMMENT --- Add Payoff Component Impl
  */
  getComponentByLoanAndCollateralType(collateralType) {
    if (((collateralType === 'PL') || (collateralType === 'AL') || (collateralType === 'HEL')
      || (collateralType === 'OF') || (collateralType === 'RML') || (collateralType === 'DC') || (collateralType === 'CC'))) {
      return this.cref_auto_vehicle_loan;
    }
  }

  /*
  REVIEW COMMENT --- Add Payoff Component Impl
  */
  getFormByLoanAndCollateralType(collateralType) {
    if (((collateralType === 'PL') || (collateralType === 'AL') || (collateralType === 'HEL')
      || (collateralType === 'OF') || (collateralType === 'RML') || (collateralType === 'DC') || (collateralType === 'CC'))) {
      return this.cref_auto_vehicle_loan.autoVehicleLoanForm;
    }
  }

  back() {
    try {
      this._route.navigate(['/journey/applicant'])
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  formatter(event) {
    if (event.which > 31 && (event.which < 48 || event.which > 57))
      return false;
    return true;
  }

  setLoanAmountValidations() {
    let minAmount = this.journeyService.getMinLoanAmountValue(this.loanAmounMinMax, this.loanProduct);
    let maxAmount = this.journeyService.getMaxLoanAmountValue(this.loanAmounMinMax, this.loanProduct);
    this.showLoanAmountToolTip = true;
    this.translate.get('application.loanDetails.loanAmount.validation.numberRange', { value1: minAmount, value2: maxAmount }).subscribe((text: string) => {
      this.invalidLoanAmountMessage = text;
      this.loanAmountToolTip = text;
    });
    // this.loanAmountToolTip = "Loan Amount should be between " + minAmount + " and " + maxAmount;
    this.showTooltip = true;

    let loanTerm = this.startForm.get('loanTerm');
    var validationValues = require('../../../assets/validators/journey/validation-values.json');
    let loanAmount = this.startForm.get('loanAmount');
    if (loanAmount.value !== null) {
      let minAmount = this.journeyService.getMinLoanAmountValue(this.loanAmounMinMax, this.loanProduct);
      let maxAmount = this.journeyService.getMaxLoanAmountValue(this.loanAmounMinMax, this.loanProduct);
      this.showLoanAmountToolTip = true;
      validationValues.application.loanDetails.loanAmount.push({ type: "numberRange", minValue: minAmount, maxValue: maxAmount });
      loanAmount.setValidators(this.customValidatorsService.composeCustomValidators(validationValues.application.loanDetails.loanAmount));
      loanAmount.updateValueAndValidity({ emitEvent: false });
    }
    else {
      this.onLoanAmountChange(loanAmount.value);
    }
    loanTerm.setValidators(this.validationUtilService.composeValidators(validationValues.application.loanDetails.loanTerm))
    loanTerm.updateValueAndValidity({ emitEvent: false });
  }

  selectedFinance(val) {
    // this.financeType = val;

  }
  /*------------------------------------*/
  // selectedLoanPurposeType(event) {
  //   this.startForm.get('loanPurposeType').setValue(event);

  //   this.startForm.get('hasCollateral').reset();
  //   let loanPurposeObj = this.loanPurposeList.find(lpl => (lpl.loanProduct === this.model.loanProduct && lpl.code === event));
  //   this.hasCollateralList = this.yesNoList.filter(ynl => ynl.code === loanPurposeObj.loanType);
  // }

  onLoanAmountChange(event) {
    let loanAmount = this.startForm.get('loanAmount');
    if (event === "" || event === null) {
      loanAmount.setErrors(null);
      loanAmount.setErrors({ required: true });
    }
    else {
      let minAmount = this.journeyService.getMinLoanAmountValue(this.loanAmounMinMax, this.loanProduct);
      let maxAmount = this.journeyService.getMaxLoanAmountValue(this.loanAmounMinMax, this.loanProduct);
      this.showLoanAmountToolTip = true;
      var validationValues = require('../../../assets/validators/journey/validation-values.json');
      validationValues.application.loanDetails.loanAmount.push({ type: "numberRange", minValue: minAmount, maxValue: maxAmount });
      loanAmount.setValidators(this.customValidatorsService.composeCustomValidators(validationValues.application.loanDetails.loanAmount));
      loanAmount.updateValueAndValidity({ emitEvent: false });

      this.translate.get('application.loanDetails.loanAmount.validation.numberRange', { value1: minAmount, value2: maxAmount }).subscribe((text: string) => {
        this.invalidLoanAmountMessage = text;
        this.loanAmountToolTip = text;
      });
      var regex = new RegExp(',', 'g');
      event = +(event.replace(regex, ''));
      if (event >= minAmount && event <= maxAmount) {
        this.startForm.get('loanAmount').setErrors(null);
        // this.startForm.get('loanAmount').updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  setAmountDecimalValue(formControl) {
    if (this.startForm.controls[formControl].value) {
      let amount = this.startForm.controls[formControl].value;
      let amtArr = amount.split(".");
      if (amtArr.length > 1 && !amtArr[1]) {
        amtArr[1] = "00";
        amount = amtArr.join(".");
        this.startForm.get(formControl).setValue(amount);
      }
    }
    else if (this.startForm.controls[formControl].value === "" || this.startForm.controls[formControl].value === null) {
      let loanAmount = this.startForm.get('loanAmount');
      loanAmount.setErrors(null);
      loanAmount.setErrors({ required: true });
    }
  }

  checkForNumericValue(e) {
    let code = e.keyCode;
    if ((code >= 32 && code <= 47) || (code >= 58 && code <= 126)) {
      e.preventDefault();
      return;
    }
  }

  closeError() {
    try {
      this.alert = {};
      this.showAlert = false;
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  isOtherProductType(collateralType) {
    if ((collateralType === 'PL') || (collateralType === 'AL') || (collateralType === 'HEL')
      || (collateralType === 'OF') || (collateralType === 'RML') || (collateralType === 'DC') || (collateralType === 'CC')) {
      return true;
    }
    return false;
  }

  isVLProductType(collateralType) {
    if (collateralType === 'PL' || collateralType === 'AL' || collateralType === 'HEL' || collateralType === 'OF' || collateralType === 'RML' || collateralType === 'DC' || collateralType === 'CC') {
      return true;
    }
    return false;
  }

  isOverdraftPurposeSelected(group: FormGroup) {
    try {

      if (group.controls.overdraftPurpose.value === 'NG_15') {
        group.controls.otherOverdraftPurpose.setValidators([Validators.required, Validators.maxLength(50)]);
      } else {
        group.controls.otherOverdraftPurpose.reset();
        group.controls.otherOverdraftPurpose.setValidators(null);
      }
      group.controls.otherOverdraftPurpose.updateValueAndValidity({ emitEvent: false });

    } catch (exception) {
      console.log(exception.message)
    }
  }

}



