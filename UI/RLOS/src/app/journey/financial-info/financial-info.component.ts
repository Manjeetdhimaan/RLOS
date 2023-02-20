import { Component, OnInit, ViewChild, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { JourneyService } from '../_root/journey.service';
import { AssetsComponent } from './../common/assets';
import { FinancialInfoService } from './financial-info.service';
import { PersistanceService } from '../../core/services';
import { MessageService } from '../../shared';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaveExitConfirmComponent, UploadDialog } from '../common/overlays';
import { environment } from 'environments/environment';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-summary',
    templateUrl: './financial-info.component.html',
    styleUrls: ['./financial-info.component.scss']
})
export class FinancialInfoComponent implements OnInit {
    @ViewChild('tab1') tab1;
    @ViewChildren('coTab') components: QueryList<AssetsComponent>;
    @ViewChild('tab3') tab3;
    @ViewChild('tab4') tab4;
    @ViewChild('tab5') tab5;
    step = 0;
    private formControls;
    startForm: FormGroup;
    personalForm: FormGroup;
    model: any = {};
    alert: {};
    appData;
    primaryApplicant;
    coApplicants;
    primaryApplicantName;
    coApplicantsName: any = [];
    coApplicantAssetComponent;
    listItems;
    applicantDTO;
    isDocumentUploaded: any = [];
    isAssetMandatory;
    constructor(private journeyService: JourneyService, private translate: TranslateService, private messageService: MessageService, public dialog: MatDialog,
        private formBuilder: FormBuilder, private _route: Router, private financeInfoService: FinancialInfoService, public persistenceService: PersistanceService) {
        this.journeyService.setStepper(4);
        let currentStep = 4;
        this.messageService.sendStepper(currentStep);
    }

    ngOnInit() {
        this.checkForMandatory();
        this.initModel();
    };

    checkForMandatory() {
        this.isAssetMandatory = false;//this.financeInfoService.isAssetsMandatory();
        // if (!this.isAssetMandatory) {
        //     this._route.navigate(['journey/review']);
        // }
    }

    ngAfterViewInit() {
        // print array of CustomComponent objects
        this.coApplicantAssetComponent = this.components;
    }

    initModel() {
        this.listItems = {
            assetType: this.financeInfoService.getAssetType(),
            liabilityType: this.financeInfoService.getLiabilityTypeList(),
            validationValues: this.financeInfoService.getApplicantValidationValues()
        }
        if (this.isAssetMandatory) {
            this.listItems.validationValues.assetDetails.assetType.push({ type: 'required' });
            this.listItems.validationValues.assetDetails.amount.push({ type: 'required' });
            this.listItems.validationValues.assetDetails.instName.push({ type: 'required' });
        }
        else {
            this.listItems.validationValues.assetDetails.assetType = this.listItems.validationValues.assetDetails.assetType.filter(function (value, index, arr) {
                return value.type !== "required";
            });
            this.listItems.validationValues.assetDetails.amount = this.listItems.validationValues.assetDetails.amount.filter(function (value, index, arr) {
                return value.type !== "required";
            });
            this.listItems.validationValues.assetDetails.instName = this.listItems.validationValues.assetDetails.instName.filter(function (value, index, arr) {
                return value.type !== "required";
            });
        }
        this.primaryApplicant = this.financeInfoService.dtoToModel("PRIMARY")[0];
        this.coApplicants = this.financeInfoService.dtoToModel("CO_APPLICANT");

        if (this.primaryApplicant.middleName)
            this.primaryApplicantName = this.primaryApplicant.firstName + " " + this.primaryApplicant.middleName + " " + this.primaryApplicant.lastName;
        else
            this.primaryApplicantName = this.primaryApplicant.firstName + " " + this.primaryApplicant.lastName;

        this.isDocumentUploaded[0] = this.journeyService.checkForCollateralDocs(1) ? true : false;
        this.coApplicants.forEach(applicant => {
            let applicantName;
            if (applicant.middleName)
                applicantName = applicant.firstName + " " + applicant.middleName + " " + applicant.lastName;
            else
                applicantName = applicant.firstName + " " + applicant.lastName;

            this.isDocumentUploaded[applicant.order - 1] = this.journeyService.checkForCollateralDocs(applicant.order) ? true : false;
            this.coApplicantsName.push(applicantName);
        });
    }

    setStep(index: number) {
        this.step = index;
    }

    createAppDataDTO(tabData) {
        this.appData = (this.appData ? this.appData : this.journeyService.getFromStorage());

        if (this.tempAppData) {
            this.appData = Object.assign({}, this.appData, this.tempAppData);
        }

        this.appData = this.financeInfoService.modelToDTO(tabData.data, this.appData);
    }

    getValidationErrorsForApplicant(errors, applicantDTO) {
        let errorsList = [];
        errors.forEach(element => {
            let index = element.field.match(/\d+/g).map(Number)[0];
            let field = element.field.replace(/[`~!@#$%^&*()_|+\-=?0-9;:'",<>\{\}\[\]\\\/]/gi, '');
            if (field.indexOf("emp") > -1) {
                let fieldArr = field.split('.');
                field = "empDetails." + applicantDTO.employmentDetails[index].employmentType + "." + fieldArr[1];
            }
            if (field.indexOf("addressDetails") > -1) {
                let fieldArr = field.split('.');
                field = "addressDetails.address." + fieldArr[1];
            }
            if (field.indexOf("incomeDetails") > -1) {
                let fieldArr = field.split('.');
                field = "incomeDetails." + fieldArr[1];
            }
            if (field.indexOf("assetDetails") > -1) {
                let fieldArr = field.split('.');
                field = "assetDetails." + fieldArr[1];
            }
            let validationName = element.message.replace(/[ ]/gi, '');
            validationName = validationName.split('|');
            let path = "application.applicant." + field + ".validation." + validationName[0];
            this.translate.get(path, { value: validationName[1] }).subscribe((text: string) => {
                errorsList.push(text);
            });
        });
        return errorsList;
    }

    setFieldsValidity(formGroup, value) {
        Object.keys(formGroup.controls).forEach((key: string) => {
            const abstractControl = formGroup.controls[key];
            if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
                this.setFieldsValidity(abstractControl, value);
            } else {
                abstractControl.touched = value;
            }
        });
    }

    continue(action?) {
        let isValid = true;
        if (this.tab1 && !(this.tab1.assetForm.valid)) {
            isValid = false;
            this.setFieldsValidity(this.tab1.assetForm, true);
        }
        if (this.coApplicants.length > 0) {
            this.coApplicantAssetComponent._results.forEach(element => {
                if (!element.assetForm.valid) {
                    isValid = false;
                    this.setFieldsValidity(element.assetForm, true);
                    return false;
                }
            });
        }
        if (isValid) {
            this.appData = this.journeyService.getFromStorage();
            if (this.tab1) {
                this.tab1.continue();
                // this.updateApplicationDTO(action);
            }
            if (this.coApplicants.length > 0) {
                this.coApplicantAssetComponent._results.forEach(element => {
                    element.continue();
                    // this.updateApplicationDTO(action);
                });
            }
            this.updateApplicationDTO(action);
        }
    }

    tabIndex;
    updateCalls = [];
    tempAppData;
    onTabChange(event) {
        this.tabIndex = event.index;
        if (this.tab1 && event.index !== 0) {
            this.tab1.continue();
            this.appData.applicants.forEach(applicant => {
                const applicantId = applicant.id;
                if (applicant.assetDetails) {
                    applicant.assetDetails.forEach(asset => {
                        asset.applicantId = applicantId;
                    });
                }
            });
        }
        if (this.coApplicants.length > 0 && this.coApplicantAssetComponent._results[0]) {
            this.coApplicantAssetComponent._results.forEach((element, index) => {
                if (index + 1 !== event.index) {
                    element.continue();
                    this.appData.applicants.forEach(applicant => {
                        const applicantId = applicant.id;
                        if (applicant.assetDetails) {
                            applicant.assetDetails.forEach(asset => {
                                asset.applicantId = applicantId;
                            });
                        }
                    });
                }
            });
        }

        this.tempAppData = this.appData;
        // this.journeyService.setInStorage(this.appData);
        this.primaryApplicant = this.financeInfoService.dtoToModel("PRIMARY", this.tempAppData)[0];
        this.coApplicants = this.financeInfoService.dtoToModel("CO_APPLICANT", this.tempAppData);
    }

    updateApplicationDTO(action?) {

        let preferenceData = "FINANCE-INFO";

        if (environment.isMockingEnabled) {
            this.alert = {};
            window.scroll(0, 0);
            this.appData = (this.appData ? this.appData : this.journeyService.getFromStorage());
            this.journeyService.setInStorage(this.appData);
            this._route.navigate(['journey/review']);
        }
        else {
            this.journeyService.updateData({
                arn: this.appData.arn,
                appData: this.appData,
                context: preferenceData,
                saveFlag: action === 'continue' ? false : true
            }).subscribe(
                response => {
                    if (response && response.success && response.data) {
                        if (action === 'continue') {
                            this.alert = {};
                            window.scroll(0, 0);
                            this.appData = response.data;
                            this.journeyService.setInStorage(this.appData);
                            this._route.navigate(['journey/review']);
                        } else {
                            this.alert = {};
                            this._route.navigate(['journey/save']);
                        }
                    }
                }, errorObject => {
                    var alertObj = {};
                    if (errorObject.error.exceptionCode === 1001) {
                        alertObj = {
                            type: 'error',
                            message: 'Some error occured, please contact support',
                            //exceptionCode: error.error.exceptionCode,
                            showAlert: true,
                            fieldErrors: this.getValidationErrorsForApplicant(errorObject.error.fieldErrors, this.applicantDTO)
                        }
                    }
                    else {
                        alertObj = {
                            type: "error",
                            fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                            message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                            showAlert: true,
                            stackTrace: {}
                        }
                    }
                    this.alert = alertObj;
                    window.scroll(0, 0);
                });
        }
    }

    openUploadDialog(order, uploadedDocs?) {
        this.appData = this.journeyService.getFromStorage();
        uploadedDocs = uploadedDocs ? uploadedDocs : this.journeyService.getCollateralDocs(order);
        const dialogRef = this.dialog.open(UploadDialog, {
            // width: '500px',
            data: {
                imageData: uploadedDocs,
                captureOtherImages: true,
                showIDScan: true,
                buckets: [{
                    docTypeCode: "W2",
                    docName: "Personal Financial Statement",
                    mandatory: false,
                    processingRequired: false,
                    size: 1
                }],
                id: this.appData.applicants[0].id
            }
        });

        return dialogRef.afterClosed();

    };


    saveAndExitApp() {
        const dialogRef = this.dialog.open(SaveExitConfirmComponent, {
            width: '600px',
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((result) => {
            if (result === "Y") {
                this.continue('save');
            }
        });
    }

    back() {
        this._route.navigate(['journey/loan'])
    }

    closeError() {
        this.alert = {};
    }
}
