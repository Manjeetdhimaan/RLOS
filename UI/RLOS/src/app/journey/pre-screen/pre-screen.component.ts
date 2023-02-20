import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, FormArrayName } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TranslateService } from '@ngx-translate/core';
import { PersistanceService, EnumsService, ValidationUtilsService } from 'src/app/core/services';
import { DOMHelperService } from 'src/app/shared';
import { AuthService } from 'src/app/auth/auth.service';
import { JourneyService } from '../_root/journey.service';
// import { PersistanceService, EnumsService, ValidationUtilsService } from '../core/services';
// import { DOMHelperService } from '../shared';
import { environment } from '../../../../environments/environment';
import { SchedularComponent } from '../common/overlays';


@Component({
  selector: 'app-pre-screen',
  templateUrl: './pre-screen.component.html',
  styleUrls: ['./pre-screen.component.scss']
})
export class PreScreenComponent implements OnInit {
  submitted: boolean;
  private formControls;
  @Input() listItems;
  alert: {};
  showAlert;
  loanType;
  LoanCode: string = 'PL';
  preScreeningForm: FormGroup;
  isAlreadyMember;
  branchList;
  preScreeningValues: any;
  questionList;
  loanList;
  securityQuestions;
  selectedQuestion1;
  selectedQuestion2;
  selectedQuestion3;
  data = {};
  constructor(private _router: Router, public dialog: MatDialog, private dom: DOMHelperService, private authService: AuthService, private formBuilder: FormBuilder, private translate: TranslateService, private persistanceService: PersistanceService, private enumsService: EnumsService, private _elementRef: ElementRef, private _dom: DOMHelperService, private validationUtilService: ValidationUtilsService, private JourneyService: JourneyService) {
    translate.setDefaultLang('en');
    this.showAlert = false;
    // let lookup = require('src/assets/resources/mocks/mdm.json');
    // this.persistanceService.setLookupStorage(lookup);
    this.initStaticData()
  }



  ngOnInit() {
    // this.persistenceService.removeAllConfigData();
    // let appData = this.persistanceService.getFromJourneyStorage();
    // if (appData && appData.arn)
    //   this._router.navigate(['/auth/resume']);
    // else
    //   this._router.navigate(['/auth/home']);
    this.createForm();
    // let productType = this.authService.getFromStorage().loanName;
    // let product = productType.product;
    // let loanTypeList = this.authService.getLookupFromStorage();
    if (environment.isMockingEnabled) {
      console.log('called json')
      let lookup = require('src/assets/resources/mocks/mdm.json');
      return lookup;
    }
    else {
      const self = this;
      if (this.dom.isEmpty(self.authService.getLookupFromStorage())) {
        self.authService.getLookupData('RLOS')
          .subscribe(resp => {
            //   self.stateList = self.authService.getState();
            //   self.collateralTypeList = self.authService.getCollateralType();
            //   self.loanProductList = self.authService.getLoanProduct();
            self.authService.setLookupInStorage(resp);
          }, error => {
            const alertObj = {
              type: 'error',
              message: 'Some error occured, please contact support',
              showAlert: true,
              stackTrace: {}
            };
            self.showAlert = true;
            window.scroll(0, 0);
            self.alert = alertObj;
          });
      }
    }
    this.initStaticData();
  }
  initStaticData() {
    this.securityQuestions = this.JourneyService.getSecurityQuestions();
    this.loanList = this.JourneyService.getLoanProductType();
    this.branchList = this.JourneyService.getBranchList();

  }

  // checkAppData() {
  //     let appData = this.persistenceService.getFromJourneyStorage();
  //     if (!appData) {
  //         this._router.navigate(['product']);
  //     }
  // }

  createForm() {
    // this.questionList = this.persistenceService.getSecurityQuestions();
    this.preScreeningValues = require('./../../../assets/validators/journey/validation-values.json');
    this.preScreeningValues = this.preScreeningValues.application.additionalInfo.securityQuestions;

    // this.preScreeningForm = this.formBuilder.group({});
    // this.preScreeningForm = this.formBuilder.group({

    // })
    this.preScreeningForm = this.formBuilder.group({
      'branch': [null, Validators.required],
      'isMeetingRequirements': [null, Validators.requiredTrue],
      // 'q1': [null, Validators.required],
      // 'response1': [null, Validators.compose(this.validationUtilService.composeValidators(this.preScreeningValues.response1))],
      // 'q2': [null, Validators.required],
      // 'response2': [null, Validators.compose(this.validationUtilService.composeValidators(this.preScreeningValues.response2))],
      // 'q3': [null, Validators.required],
      // 'response3': [null, Validators.compose(this.validationUtilService.composeValidators(this.preScreeningValues.response3))]
    })
    // // for (let index = 0; index < this.questionList.length; index++) {
    // //     this.preScreeningForm.addControl('Answer' + (index + 1), this.formBuilder.control('', Validators.required));

    // }

    this.formControls = this.preScreeningForm.controls;
    this.validationUtilService.blockInvalidInput(this.preScreeningForm, this.preScreeningValues);
  }
  selectQuestion() {
    // this.id = {...this.id,...this.selectedQuestion};
    // this.id.push(this.selectedQuestion);
    this.data = [{ id: this.selectedQuestion1, response: this.preScreeningForm.get('response1').value },
    { id: this.selectedQuestion2, response: this.preScreeningForm.get('response2').value },
    { id: this.selectedQuestion3, response: this.preScreeningForm.get('response3').value }]

    //this.data = JSON.stringify(this.preScreeningForm.value);
  }

  resumeContinue() {
    // this._router.navigate(['auth/resume']);
    this.goToLink('http://localhost:8082/#/auth/resume');

  }

  goToLink(url: string) {
    window.open(url, "_self");
  }

  continue() {
    if (this.preScreeningForm.valid) {
      let appData = this.persistanceService.getFromJourneyStorage();

      // if(this.accType === 'INDV'){

      var info = {
        applicants: [{ type: 'PRIMARY' }],
        // loanDetails: [this.loanType = this.preScreeningForm.get('loan').value, this.LoanCode = this.LoanCode] , 
        //subhasree
        // loansectionDetails: [{ loanType: this.preScreeningForm.get('loan').value, LoanCode: this.LoanCode }],
        //   let loanDetails : {
        //     loanType:this.preScreeningForm.get('loan').value,

        //     LoanCode: this.LoanCode,
        //  }
        // LoanType: this.preScreeningForm.get('loan').value,
        // LoanCode : this.LoanCode
      };
      // var additionalInfo = {
      //     "isMeetingRequirements": this.preScreeningForm.get('isMeetingRequirements').value,
      //     // "securityQuestions": this.securityQuestionsModel()
      // }

      // var info = {
      //     applicants: [{ additionalInfo: additionalInfo, type: 'PRIMARY' }]
      // }
      // let appData = this.persistenceService.getFromJourneyStorage();
      // if (appData.applicants) {
      //     appData.applicants[0] = { ...appData.applicants[0], ...info.applicants[0] };
      // }
      // else {
      //     appData = { ...appData, ...info };
      // }
      if (appData.applicants) {
        appData.applicants[0] = { ...appData.applicants[0] };
        // appData.additionalInfo = additionalInfo;
      }
      else {
        appData = { ...appData, ...info };
      }

      this.persistanceService.setInStorage('APP', appData);
      if (this.persistanceService.getConfigFromJourneyStorage() && this.persistanceService.getConfigFromJourneyStorage().state.memberId) {
        JourneyService.stepObject[0].isValid = true;
        this._router.navigate(['journey/applicant']);
      }
      else {

        this._router.navigate(['journey/home']);
      }
    }
    else {
      this.submitted = true;
      this.validationUtilService.markFormGroupTouched(this.preScreeningForm);
      this._dom.moveToInvalidCheckBoxField(this._elementRef);
    }
  }


}
