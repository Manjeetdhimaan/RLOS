import { Component, OnInit, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormArrayName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {  MatSlideToggleChange } from '@angular/material/slide-toggle';

import { JourneyService } from '../_root/journey.service';
import { SaveExitConfirmComponent, UploadEsignDialog } from '../common/overlays';
// import { LocalizationPipe } from '../../../../assets/pipes/journey/localization-pipe';
import { ValidationUtilsService, PersistanceService } from '../../core/services';
import { DOMHelperService, MessageService } from '../../shared';
import { ConsentsService } from './consents.service';
import { SchedularComponent } from '../common/overlays';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-disclosures',
  templateUrl: './consents.component.html',
  styleUrls: ['./consents.component.scss']
})
export class DisclosuresComponent implements OnInit {
  step = 0;
  branchCodeList;
  formControls;
  startForm: FormGroup;
  // consentForm: FormGroup;
  public submitted: boolean;
  alert: {};
  model: any;
  consentValues;
  branchCode: any;
  // checked = [];
  labelPosition: any;
  dropdownPlaceHolder = "Please Select";
  disclosures;
  checked = false;
  cutomerRemarks;
  referralSource;
  referralSourceList;
  constructor(private journeyService: JourneyService,
    private consentsService: ConsentsService,
    private formBuilder: FormBuilder, private _dom: DOMHelperService,
    private _route: Router, private _elementRef: ElementRef,
    private validationUtilService: ValidationUtilsService,
    public dialog: MatDialog, private messageService: MessageService,
    private persistenceService: PersistanceService) {
    this.journeyService.setStepper(5);
    let currentStep = 5;
    this.messageService.sendStepper(currentStep);
  }

  ngOnInit() {
    let appData = this.journeyService.getFromStorage();
    this.checked = (appData && appData.consent === true) ? true : false;
    if (appData && appData.cutomerRemarks) {
      this.cutomerRemarks = appData.cutomerRemarks;
    }
    if (appData && appData.referralSource) {
      this.referralSource = appData.referralSource;
    }
    this.journeyService.backFlag = true;
    this.labelPosition = "before";
    this.referralSourceList = this.journeyService.getReferralSourceList();
    this.initModel();
  }

  setStep(index: number) {
    this.step = index;
  }

  initModel() {
    this.disclosures = this.journeyService.getDisclosureDetails();
    this.consentValues = this.journeyService.getValidationValues().application.consents;
    this.model = this.consentsService.dtoToModel();
  }

  gotoNextRoute() {
    this._route.navigate(['/journey/documents']);
  };

  uploadEsign(): void {
    const dialogRef = this.dialog.open(UploadEsignDialog, {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        let applicant = this.journeyService.getPrimaryApplicant();
        this.journeyService.saveDocuments({ id: applicant.id, documents: response }).subscribe(() => {
          this.gotoNextRoute();
        });

      }
    });
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  openSchedular() {
    const dialogRefAppExist = this.dialog.open(SchedularComponent, {
      width: '500px'
    })
    dialogRefAppExist.afterClosed().subscribe(result => {

      console.log(result);
    });
  }



  continue() {
    this.saveData();
  }

  // checkConsent(index, value) {
  //   this.checked[index] = !value;
  // }

  acceptConsent(event: MatSlideToggleChange) {
    this.checked = event.checked;
  }



  saveData() {

    if (this.checked) {
      let preferenceData = "CONSENTS";
      this.submitted = false;
      let appData = this.journeyService.getFromStorage();
      appData['consent'] = this.checked;
      appData['cutomerRemarks'] = this.cutomerRemarks;
      appData['referralSource'] = this.referralSource ? this.referralSource : null;
      if (environment.isMockingEnabled) {
        this.journeyService.setInStorage(appData);
        this._route.navigate(['/journey/documents']);

      } else {
        this.journeyService.saveConsent({
          arn: appData.arn,
          appData: appData,
          context: preferenceData,
          saveFlag: false
        }).subscribe(
          response => {
            if (response && response.success && response.data) {
              this.journeyService.setInStorage(response.data);
              this._route.navigate(['/journey/documents']);
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
            this.alert = alertObj;
          });
      }

    } else {
      this.submitted = true;
      this._dom.moveToInvalidField(this._elementRef);
    }
  }



  saveAndExitApp() {
    const dialogRef = this.dialog.open(SaveExitConfirmComponent, {
      width: '600px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === "Y") {
        let preferenceData = "CONSENTS";
        this.submitted = false;
        let appData = this.journeyService.getFromStorage();
        appData['consent'] = this.checked;
        appData['cutomerRemarks'] = this.cutomerRemarks;
        appData['referralSource'] = this.referralSource ? this.referralSource : null;
        this.journeyService.saveConsent({
          arn: appData.arn,
          appData: appData,
          context: preferenceData,
          saveFlag: true
        }).subscribe(
          response => {
            this._route.navigate(['journey/save']);
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
            this.alert = alertObj;
          });
      }
    });

  }

  closeError() {
    this.alert = {};
  }

  back() {
    this._route.navigate(['journey/review'])
  }

}
