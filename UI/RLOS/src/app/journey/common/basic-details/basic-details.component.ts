import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormArrayName } from '@angular/forms';
import { forkJoin } from "rxjs";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { UploadDialog } from '../../common/overlays';
// import { LocalizationPipe } from '../../../../../assets/pipes/journey/localization-pipe';
import { ValidationUtilsService } from '../../../core/services';
import { DOMHelperService } from '../../../shared';
import { JourneyService } from '../../_root/journey.service';
import { environment } from 'environments/environment';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/directives/format-datepicker';
import { MaskedDate } from 'src/app/shared/services/utils/mask.helper';
import { PersistanceService } from '../../../core/services/persistence.service';

// import { PersonalInfoService } from '../personal-details.service';

declare var require: any;


@Component({
  selector: 'basic-info',
  templateUrl: './basic-details.component.html',
  styleUrls: ['./basic-details.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class BasicDetailsComponent implements OnInit {
  public personalForm: FormGroup;

  dateMask = MaskedDate;

  formControls;
  public idList: FormArray;
  public submitted: boolean;
  private modalData;
  public Age: number;
  // public ids: any[] = [{
  //   idType: '',
  //   idNumber: '',
  //   idIssueDate: '',
  //   idExpDate: '',
  //   idIssuingCountry:''
  // }];
  maxDateid;
  minDateid;
  maxDateDob;
  minDateDob;
  minDateSSN;
  maxDateSSN;
  startDate;
  validation;
  basicDetailValues;
  maritalStatusList;
  prefixList;
  suffixList;
  relationshipList;
  idTypeList;
  countryList;
  haveId;
  genderList;
  dependentList = [];
  savedEmail;
  dropdownPlaceHolder;
  maxLengthSSN;
  showCoApplicantRequiredMsg;
  showInvalidExpDate;
  showInvalidIssueDate;
  isIdUploaded: boolean;
  showIdScan;
  @Input() tabData;
  @Input() listItems;
  @Input() isCoApplicant;
  @Input() isComponentReadOnly;
  @Input() isJuniorAccSelected;
  isReadOnly;
  isDOBReadOnly;
  isSSNReadOnly;
  isMiddleNameReadOnly;
  isFirstNameReadOnly;
  isLastNameReadOnly;
  isEmailReadOnly;
  isDobReadOnly;
  isCellPhoneReadOnly;
  isConfirmEmailReadOnly;
  ssn;
  encryptedSSN;
  showssn;
  showEvent;
  yesNoList;
  allowedAgeList;
  invalidDateMessage;
  loanType;
  tinNumberMandatoryFlag;
  nibNumberMandatoryFlag;
  accountTypeList;
  loanRelationshipList;
  accounTypePlaceholder;
  territorySelected;
  @Output() saveTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteTabData: EventEmitter<any> = new EventEmitter<any>();
  @Output() moveToInvalidTab: EventEmitter<any> = new EventEmitter<any>();
  @Output() extractIdScanData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private _route: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private _elementRef: ElementRef, private persistanceService: PersistanceService,
    private validationUtilService: ValidationUtilsService, private journeyService: JourneyService, private _dom: DOMHelperService) {
    // this.maxDateDob = new Date();
    // this.minDateDob = new Date();
    // this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);
    this.minDateSSN = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    this.maxDateSSN = new Date();
    this.maxDateSSN.setFullYear(this.maxDateSSN.getFullYear() + 100);
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

  ngOnInit() {
    try {

      this.territorySelected = this.persistanceService.getFromStorage('Territory');
      if (this.isJuniorAccSelected) {
        this.maxDateDob = new Date();
        this.maxDateDob.setFullYear(this.maxDateDob.getFullYear());
        this.minDateDob = new Date();
        this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 18, this.minDateDob.getMonth(), this.minDateDob.getDate() + 1);
      } else {
        this.maxDateDob = new Date();
        this.maxDateDob.setFullYear(this.maxDateDob.getFullYear() - 18);
        this.minDateDob = new Date();
        this.minDateDob.setFullYear(this.minDateDob.getFullYear() - 100);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
    try {
      const appData = this.journeyService.getFromStorage();
      this.loanType = (appData && appData.loanDetails && appData.loanDetails.loanType) ? appData.loanDetails.loanType : null;
      this.maxDateid = new Date();
      this.maxDateid.setFullYear(this.maxDateid.getFullYear());
      this.minDateid = new Date();
      this.minDateid.setFullYear(this.minDateid.getFullYear() - 100);
      window.scroll(0, 0);
      this.createForm();
      this.initModel(this.tabData);
      var validationMessages = require('../../../../assets/i18n/journey/en.json');
      this.validation = validationMessages.application.applicant;

      this.initStaticData();

      // if (this.isCoApplicant) {
      //   this.personalForm.get('isCoapplicantSignatory').reset();
      //   this.personalForm.get('isCoapplicantSignatory').setValidators(null);
      // }
      // this.personalForm.get('isCoapplicantSignatory').updateValueAndValidity({ emitEvent: false });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  get idFormGroup() {
    return this.personalForm.get('idDetails') as FormArray;
  }
  createid(data?): FormGroup {
    try {
      // this.basicDetailValues = this.listItems.validationValues;
      data = data || {};
      return this.formBuilder.group({
        'id': [data.id || null],
        'idExpDate': [data.idExpDate || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.idExpDate))],
        'idType': [data.idType || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.idType))],
        'idIssueDate': [data.idIssueDate || null],
        'idNumber': [data.idNumber || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.idNumber))],
        'idIssuingCountry': [data.idIssuingCountry || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.idIssuingCountry))],
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
    // this.validationUtilService.blockInvalidInput(this.personalForm, this.basicDetailValues);
  }

  removeAsset(group: FormGroup, index): void {
    try {
      if (group.get('id').value) {
        this.formControls.idDetails.controls[index].controls.id.value = group.get('id').value * -1;
        this.deleteTabData.emit({
          data: { basicDetails: this.personalForm.getRawValue(), documents: this.modalData },
          tabName: "BASIC",
          actionType: 'CONTINUE',
          context: "BASIC"
        });
      } else {
        this.idList.removeAt(index);
      }

    }
    catch (exception) {
      console.log(exception.message)
    }
  };


  onActivate(event) {
    window.scroll(0, 0);
  }

  initStaticData() {
    try {
      this.maritalStatusList = this.listItems.maritalStatusList;
      this.idTypeList = this.listItems.idTypeList;
      this.countryList = this.listItems.countryList;
      // this.prefixList = ["Dr.", "Miss.", "Mr.", "Mrs.", "Ms"];
      this.prefixList = this.listItems.prefixList;
      this.suffixList = this.listItems.suffixList;
      // this.suffixList = [ "jr."];
      // this.relationshipList = ["Guarantor", "Joint"];
      this.relationshipList = this.listItems.relationshipList;
      this.yesNoList = ["Yes", "No"];
      // this.yesNoList = this.listItems.yesNoList;
      this.genderList = this.listItems.genderList;
      this.dependentList = this.journeyService.getDependentList();
      this.allowedAgeList = this.listItems.allowedAgeList;

      this.dropdownPlaceHolder = "Please select";
      this.accountTypeList = this.listItems.accountTypeList;
      this.loanRelationshipList = this.listItems.loanRelationshipList;
    }
    catch (exception) {
      console.log(exception.message)
    }

  }

  createForm(data?) {
    try {
      this.basicDetailValues = this.listItems.validationValues;
      // this.maxLengthSSN = this.basicDetailValues.ssn.find(bdv => bdv.type === "maxlength").value;
      data = data || {};
      this.haveId = data.id ? true : false;


      this.personalForm = this.formBuilder.group({
        // 'isCoapplicantSignatory': [data.isCoapplicantSignatory || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.isCoapplicantSignatory))],
        'loanRelationship': data.loanRelationship || null,
        'relation': data.relation || null,
        'haveLicense': null,
        'id': data.id || null,
        'birNumber': data.birNumber || null,
        'existingCustomer': [data.existingCustomer || null],
        'citizenship': [data.citizenship || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.citizenship))],
        'tinNumber': [data.tinNumber || null],
        'prefix': [data.prefix || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.prefix))],
        // 'firstName': [data.firstName || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.firstName))],
        'firstName': [data.firstName, Validators.required],
        'middleName': [data.middleName || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.middleName))],
        'maidenName': [data.maidenName || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.maidenName))],
        'motherMaidenName': [data.motherMaidenName || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.motherMaidenName))],
        'age': [{ value: data.age || null, disabled: true }],
        // 'age': [data.age || null],
        'lastName': [data.lastName || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.lastName))],
        'suffix': [data.suffix || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.suffix))],
        'dob': [data.dob || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.dob))],
        'maritalStatus': [data.maritalStatus || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.maritalStatus))],
        'howLongInYears': [data.howLongInYears || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.howLongInYears))],
        'gender': [data.gender || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.gender))],
        'placeOfBirth': [data.placeOfBirth || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.placeOfBirth))],
        'email': [data.email || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.email))],
        'confirmEmail': data.confirmEmail || null,
        // 'idExpDate': [data.idExpDate || null],
        // 'idType': [data.idType || null],
        // 'idIssueDate': [data.idIssueDate || null],
        // 'idNumber':  [data.idNumber || null],
        // 'idIssuingCountry':  [data.idIssuingCountry || null],
        'ssn': [data.ssn || null],
        'isBankEmployee': [data.isBankEmployee || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.isBankEmployee))],
        'isGovernmentEmployee': [data.isGovernmentEmployee || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.isGovernmentEmployee))],
        'noOfDependent': [data.noOfDependent || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.noOfdependent))],
        'type': [data.type || null],
        // 'isAlreadyExist': [data.isAlreadyExist],
        'cellPhoneNo': [data.cellPhoneNo || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.cellPhoneNo))],
        'homePhoneNo': [data.homePhoneNo || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.homePhoneNo))],
        'workPhoneNo': [data.workPhoneNo || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.workPhoneNo))],
        'accountType': [data.accountType || null],
        'accountNumber': [data.accountNumber || null],
        'isBankEmployeeRelative': [data.isBankEmployeeRelative || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.isBankEmployeeRelative))],
        'bankRelationComment': [data.bankRelationComment || null, Validators.compose(this.validationUtilService.composeValidators(this.basicDetailValues.bankRelationComment))],
        idDetails: this.formBuilder.array([this.createid()])
      })

      this.idList = this.personalForm.get('idDetails') as FormArray;
      this.formControls = this.personalForm.controls;
      this.setDynamicValidations();

      // if (data && data.age === 0) {
      //   this.formControls.get('age').setValue(0);
      // }

      this.isFirstNameReadOnly = data.firstName ? true : false;
      this.isLastNameReadOnly = data.lastName ? true : false;
      this.isEmailReadOnly = data.email ? true : false;
      this.isCellPhoneReadOnly = data.cellPhoneNo ? true : false;
      this.isConfirmEmailReadOnly = data.confirmEmail ? true : false;
      this.isDOBReadOnly = data.dob ? true : false;

      if (this.isFirstNameReadOnly && !this.isCoApplicant) {
        this.personalForm.controls['firstName'].disable();
      }

      if (this.isLastNameReadOnly && !this.isCoApplicant) {
        this.personalForm.controls['lastName'].disable();
      }

      if (this.isEmailReadOnly && !this.isCoApplicant) {
        this.personalForm.controls['email'].disable();
      }

      if (this.isConfirmEmailReadOnly && !this.isCoApplicant) {
        this.personalForm.controls['confirmEmail'].disable();
      }

      if (this.isCellPhoneReadOnly && !this.isCoApplicant) {
        this.personalForm.controls['cellPhoneNo'].disable();
      }
      if (this.isDOBReadOnly && !this.isCoApplicant) {
        this.personalForm.controls['dob'].disable();
      }

      if (this.isCoApplicant) {
        this.personalForm.get('loanRelationship').setValidators(Validators.required);
        this.personalForm.get('relation').setValidators([Validators.required, Validators.maxLength(10)]);
      } else {
        this.personalForm.get('loanRelationship').clearValidators();
        this.personalForm.get('relation').clearValidators();
        this.personalForm.get('loanRelationship').setValidators(null);
        this.personalForm.get('relation').setValidators(null);
      }
      this.personalForm.get('loanRelationship').updateValueAndValidity({ emitEvent: false });
      this.personalForm.get('relation').updateValueAndValidity({ emitEvent: false });

      if (this.haveId) {
        this.isReadOnly = true;
      }
      else {
        this.isReadOnly = false;
      }
      // this.isDOBReadOnly = data.dob instanceof Date && !isNaN(data.dob) ? true : false;
      // this.isSSNReadOnly = data.ssn ? true : false;
      this.isMiddleNameReadOnly = data.middleName ? true : false;
      this.validationUtilService.blockInvalidInput(this.personalForm, this.basicDetailValues);
      // this.showIdScan = !this.personalForm.get('isAlreadyExist').value ? true : false;
      if (data) {
        Object.keys(this.personalForm.controls).forEach((key: string) => {
          const abstractControl = this.personalForm.controls[key];
          if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
            this.validationUtilService.blockInvalidInput(abstractControl, this.basicDetailValues);
          } else {
            this.validationUtilService.resetInvalidValue(abstractControl, abstractControl.value, key, this.basicDetailValues[key]);
          }
        });
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };


  setDynamicValidations() {
    let ssn = this.personalForm.get('ssn');
    //ssn.clearValidators();
    if (this.territorySelected === 'JM') {
      ssn.setValidators(Validators.required);
    } else if (this.territorySelected === 'TT') {
      ssn.clearValidators();
      ssn.setValidators(null);
    } else {
      ssn.clearValidators();
      ssn.setValidators(null);
    }
    ssn.setValidators(Validators.required);// For Temporary Purpose
    ssn.updateValueAndValidity({ emitEvent: false });
  }

  initModel(tabData) {
    try {
      if (tabData) {
        this.createForm(tabData);
        this.calculcateAge({ value: tabData.dob });
        if (tabData.idDetails) {
          this.initFormData(tabData.idDetails);
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }

    this.isIdUploaded = this.journeyService.checkForIDScanDocs({ id: this.personalForm.get('id').value });

  };


  initFormData(tabData) {
    try {
      if (this.personalForm) {
        let control = <FormArray>this.personalForm.controls['idDetails'];
        tabData.forEach(data => {
          control.push(this.createid(data));
        });
        this.idList.removeAt(0);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }

  }
  enableInputBox() {
    this.showEvent = false;
    this.showssn = true;
    setTimeout(() => {
      let element: HTMLElement = document.getElementById('ssn') as HTMLElement;
      element.click();
    });
  }

  ngAfterViewInit() {
    window.scroll(0, 0);
  }

  onSearchChange(limit) {
    if (!limit) {
      return;
    }
    this.onSearchChange(--limit);
  }






  // addIDDetails(){
  //   this.ids.push({
  //     id: this.ids.length + 1,
  //     // idType: '',
  //     // idNumber: '',
  //     // idIssueDate: '',
  //     // idExpDate: '',
  //     // idIssuingCountry:''
  //   });
  // }

  addIDDetails() {
    try {
      this.basicDetailValues = this.listItems.validationValues;
      this.idList.push(this.createid());
      this.validationUtilService.blockInvalidInput(this.idList, this.basicDetailValues);
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  getMinAge(list, code) {
    return list.find(item => {
      return item.loanType === code;
    }).code;
  }

  getMaxAge(list, code) {
    return list.find(item => {
      return item.loanType === code;
    }).label;
  }

  calculcateAge(event) {
    try {
      // let minAge = this.loanType ? this.getMinAge(this.allowedAgeList, this.loanType) : null;
      // let maxAge = this.loanType ? this.getMaxAge(this.allowedAgeList, this.loanType) : null;
      let minAge = 18;
      let maxAge = 150;
      if (minAge && maxAge) {
        if (event.value) {
          this.showCoApplicantRequiredMsg = false;
          if ((new Date()) > new Date(event.value)) {
            var diff_ms = Date.now() - (new Date(event.value)).getTime();
            var age_dt = new Date(diff_ms);
            let age = Math.abs(age_dt.getUTCFullYear() - 1970);
            this.personalForm.get('age').setValue(age);
            this.personalForm.get('age').disable();
            if (age <= maxAge && age >= minAge) {
              this.showCoApplicantRequiredMsg = false;
              this.personalForm.get('dob').setErrors(null);
            } else {
              this.showCoApplicantRequiredMsg = true;
              this.personalForm.get('dob').setErrors({ notValid: true });
              this.invalidDateMessage = `Age must be between ${minAge} and ${maxAge} years of age`;
            }
          }
          else {
            if (this.personalForm) {
              this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
              this.showCoApplicantRequiredMsg = false;
            }
          }
        } else if (event.target && event.target.value) {
          this.showCoApplicantRequiredMsg = false;
          if ((new Date()) > new Date(event.target.value)) {

            var diff_ms = Date.now() - (new Date(event.target.value)).getTime();
            var age_dt = new Date(diff_ms);
            let age = Math.abs(age_dt.getUTCFullYear() - 1970);
            if (age <= maxAge && age >= minAge) {
              this.showCoApplicantRequiredMsg = false;
              this.personalForm.get('dob').setErrors(null);
            } else {
              this.showCoApplicantRequiredMsg = true;
              this.personalForm.get('dob').setErrors({ notValid: true });
              this.invalidDateMessage = `Age must be between ${minAge} and ${maxAge} years of age`;
            }
          }
          else {
            if (this.personalForm) {
              this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
              this.showCoApplicantRequiredMsg = false;
            }
          }
        } else {
          if (this.personalForm) {
            this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
            this.showCoApplicantRequiredMsg = false;
          }
        }
      } else {
        if (this.personalForm) {
          this.personalForm.get('dob').setErrors({ matDatepickerMin: true });
          this.showCoApplicantRequiredMsg = false;
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  calculcateAgeFromInputChange(event) {
    try {
      // let minAge = this.loanType ? this.getMinAge(this.allowedAgeList, this.loanType) : null;
      // let maxAge = this.loanType ? this.getMaxAge(this.allowedAgeList, this.loanType) : null;
      let minAge = 18;
      let maxAge = 150;
      if (minAge && maxAge) {
        if (event.target && event.target.value) {
          this.showCoApplicantRequiredMsg = false;
          if ((new Date()) > new Date(event.target.value)) {

            var diff_ms = Date.now() - (new Date(event.target.value)).getTime();
            var age_dt = new Date(diff_ms);
            let age = Math.abs(age_dt.getUTCFullYear() - 1970);
            if (age <= maxAge && age >= minAge) {
              this.showCoApplicantRequiredMsg = false;
              this.personalForm.get('dob').setErrors(null);
            } else {
              this.showCoApplicantRequiredMsg = true;
              this.personalForm.get('dob').setErrors({ notValid: true });
              this.invalidDateMessage = `Age must be between ${minAge} and ${maxAge} years of age`;
            }
          }
          else {
            if (this.personalForm) {
              this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
              this.showCoApplicantRequiredMsg = false;
            }
          }
        }
        else {
          if (this.personalForm) {
            this.personalForm.get('dob').setErrors({ matDatepickerMax: true });
            this.showCoApplicantRequiredMsg = false;
          }
        }
      } else {
        if (this.personalForm) {
          this.personalForm.get('dob').setErrors({ matDatepickerMin: true });
          this.showCoApplicantRequiredMsg = false;
        }
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  onKeydown(event, value) {
    if (event.value.length >= value) {
      event.preventDefault();
    }
  }



  openDocDialog(uploadedImages) {
    try {
      var dialogRef = this.dialog.open(UploadDialog, {
        data: { imageData: uploadedImages, showIDScan: true, id: this.personalForm.get('id').value }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result.length > 0 && result[0] !== null) {
          if (result[0].data) {
            this.extractIdScanData.emit({ id: this.personalForm.get('id').value, documents: result });
            this.isIdUploaded = false;
            result.forEach(element => {
              if (element.data) {
                this.isIdUploaded = true;
              }
            });
            this.modalData = this.isIdUploaded ? result : [];
          }
          else {
            this.modalData = [];
            this.isIdUploaded = false;
          }
        }
        else {
          this.modalData = [];
          this.isIdUploaded = false;
        }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  uploadDoc(): void {
    try {
      let uploadedDocs = this.journeyService.getIDScanDocs({ id: this.personalForm.get('id').value });
      let arn = this.journeyService.getArn();
      if (uploadedDocs && arn) {
        let idScanDoc = uploadedDocs.find((item) => {
          return item.docTypeCode === 'IDSCN'
        });

        if (idScanDoc) {
          let uploadedImages = [];
          this.journeyService.getImages(idScanDoc).subscribe((response) => {
            uploadedImages.push(response);
            this.openDocDialog(uploadedImages);
          })
        } else {
          this.openDocDialog([]);
        }
      } else {
        this.openDocDialog(this.modalData);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  };

  checkEmail() {
    let email = this.personalForm.get('email').value;
    let confirmEmail = this.personalForm.get('confirmEmail').value;
    if (!this.haveId && email && confirmEmail) {
      if ((email.toLowerCase() !== confirmEmail.toLowerCase())) {
        this.personalForm.get('confirmEmail').setErrors({ notUnique: true });
      } else {
        if (this.personalForm.get('confirmEmail').errors)
          this.personalForm.get('confirmEmail').setErrors(null);
      }
    }
  }

  continue(nextTabIndex, isContinueClicked?) {
    // if (this.ssn) {
    //   this.personalForm.get('ssn').setValue(this.ssn);
    // }
    try {
      if (this.personalForm.valid) {
        this.saveTabData.emit({
          data: { basicDetails: this.personalForm.getRawValue(), documents: this.modalData },
          nextTabIndex: !this._dom.isEmpty(nextTabIndex) ? nextTabIndex : 1,
          tabName: "BASIC",
          actionType: 'CONTINUE',
          context: "BASIC",
          isContinueClicked: (isContinueClicked) ? isContinueClicked : false
        });
      } else {
        this.submitted = true;
        this.validationUtilService.markFormGroupTouched(this.personalForm);
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
        data: { basicDetails: this.personalForm.getRawValue() },
        tabName: "BASIC",
        actionType: 'SAVE',
        context: "BASIC"
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  formatDate(value) {
    return (value < 10 ? '0' + value : value);
  };

  back() {
    this._route.navigate(['/journey/product'])
  }


  resetForm() {
    this.personalForm.reset();
    this.encryptedSSN = null;
    this.showEvent = false;
    this.showssn = true;
    this.ssn = null;
    this.showCoApplicantRequiredMsg = false;
    this.showInvalidExpDate = false;
    this.showInvalidIssueDate = false;
    this.submitted = true;
    this.isIdUploaded = false;
    this.modalData = [];
  }
  //accessibility changes
  selectedPrefix(event) {
    this.personalForm.get('prefix').setValue(event);
  }

  selectedIssuingCountry(event) {
    this.personalForm.get('idIssuingCountry').setValue(event);
  }

  selectedIdType(event) {
    this.personalForm.get('idType').setValue(event);
  }
  selectedMaritalStatus(value) {
    this.personalForm.get('maritalStatus').setValue(value);

  }



  checkIdDatesValidity(group: FormGroup) {
    try {
      if ((group.controls.idIssueDate.value && group.controls.idExpDate.value) && (group.controls.idExpDate.value < group.controls.idIssueDate.value)) {
        group.controls.idExpDate.setErrors({ expDateLessThanIssueDate: true });
      }
      return null;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  isGenderSelected() {
    try {
      if (this.personalForm) {
        let maidenName = this.personalForm.get('maidenName');
        maidenName.reset();
        maidenName.updateValueAndValidity({ emitEvent: false });
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  idTypeChanged(group: FormGroup) {
    try {
      if (group.controls.idType.value !== 'NG_NIB') {
        group.controls.idIssueDate.setValidators([Validators.required]);
      } else {
        group.controls.idIssueDate.reset();
        group.controls.idIssueDate.setValidators(null);
      }
      group.controls.idIssueDate.updateValueAndValidity({ emitEvent: false });
    } catch (exception) {
      console.log(exception.message);
    }
  }

  //Added by Hemlata to get UCIN/ Account Number form User on 17 Oct 2022
  isExistingCustomer(event) {
    let accountNumber = this.personalForm.get('accountNumber');
    let accountType = this.personalForm.get('accountType');
    accountType.clearValidators();
    accountNumber.clearValidators();
    accountType.markAsUntouched();
    accountNumber.markAsUntouched();
    if (event && event.checked) {
      accountType.setValidators(Validators.required);
      //accountNumber.setValidators(Validators.required);
    } else {
      accountType.setValue(null);
      accountNumber.setValue(null);
      accountType.setValidators(null);
      accountNumber.setValidators(null);
    }
    accountType.updateValueAndValidity({ emitEvent: false });
    accountNumber.updateValueAndValidity({ emitEvent: false });
  }

  getAccountType(event) {
    this.accountTypeList.forEach((data: any) => {
      if (data.code === event.value)
        this.accounTypePlaceholder = data.label;
    })
    let accountNumber = this.personalForm.get('accountNumber');
    accountNumber.clearValidators();
    accountNumber.setValidators(Validators.required);
    accountNumber.updateValueAndValidity({ emitEvent: false });
  }

}