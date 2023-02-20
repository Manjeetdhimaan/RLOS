import { Router } from '@angular/router';
import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { ValidationUtilsService } from 'src/app/core/services/validation-utils.service';
import { PersistanceService } from 'src/app/core/services/persistence.service';
import { JourneyService } from 'src/app/journey/_root/journey.service';
import { MessageService } from 'src/app/shared/services';
import { environment } from 'environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { SaveExitConfirmComponent } from 'src/app/journey/common/overlays';

@Component({
  selector: 'app-document-section',
  templateUrl: './document-section.component.html',
  styleUrls: ['./document-section.component.scss']
})
export class DocumentSectionComponent implements OnInit {

  documentTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;
  @Input() tabData;
  documentDetailsForm: FormGroup;
  formControls;
  documentList;
  applicantList;
  documentDetailValues;
  _documentDetailsArray;
  showAddDocument;
  showRemoveDocument;
  documentMdmList = [];
  accountRelationShip;
  applicableFor;
  applicantType;
  order;
  accountRelationshipList;
  showWithoutUpload = true;
  showWhenUploaded = false;
  alert: {};
  showAlert;
  appConfig;
  allowedFileType;
  maxFileSize;
  tinNumber: any;
  appData: any;
  showDocumentNameError: any

  constructor(private messageService: MessageService, private journeyService: JourneyService, private persistenceService: PersistanceService,
    private router: Router, private fb: FormBuilder, public dialog: MatDialog) {
    const currentStep = 5;
    this.showAlert = false;
    this.messageService.sendStepper(currentStep);
    this.appConfig = this.persistenceService.getApplicationConfig();
    this.allowedFileType = this.appConfig.fileTypes.split(',').join(', ');
    this.maxFileSize = this.appConfig.maxFileSize;
  }


  ngOnInit(): void {

    try {
      this.showDocumentNameError = false;
      this.initStaticData();
      // let appData = this.journeyService.getFromStorage();
      this.appData = this.journeyService.getAccountRelationshipInDto();
      // this.journeyService.setInStorage(appData);
      //to get system generated documentlist
      let tabData = this.appData && this.appData.documents ? this.getModifiedDocList(this.appData.documents) : this.getDocList();
      this.touchedRows = [];
      this.documentTable = this.fb.group({
        documentRows: this.fb.array([])
      });
      this.addRow();

      //to display system generated document list
      this.initModel(tabData);
    } catch (exception) {
      console.log(exception.message)
    }

  }

  getModifiedDocList(uploadedDocuments) {
    try {
      let uploadedDocs = uploadedDocuments;
      let documentList = this.getDocList();
      uploadedDocs.forEach(element => {
        documentList.forEach(item => {
          if (element.documentName === item.documentName && element.order === item.order) {
            item['id'] = element.id;
            item['docIndex'] = element.docIndex;
            item['uploadDate'] = element.uploadDate;
            item['applicantType'] = element.order === 1 ? "PRIMARY" : "CO_APPLICANT";
          }
        });
      });
      return documentList;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  ngAfterOnInit() {
    try {
      this.control = this.documentTable.get('documentRows') as FormArray;
    } catch (exception) {
      console.log(exception.message)
    }

  }

  initStaticData() {
    try {
      this.documentMdmList = this.journeyService.getMasterDocumentList();
      this.accountRelationshipList = this.journeyService.getAccountRelationship();
    } catch (exception) {
      console.log(exception.message)
    }
  }

  initModel(tabData) {
    try {
      if (tabData) {
        this.initFormData(tabData);
      }
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  initFormData(tabData) {
    try {
      const control = this.documentTable.get('documentRows') as FormArray;
      control.removeAt(0);
      tabData.forEach(data => {
        control.push(this.initiateForm(data));
      });

    }
    catch (exception) {
      console.log(exception.message)
    }
  }


  getDocList() {

    try {
      // const appData = this.journeyService.getFromStorage();
      if (this.appData) {
        //applicant level documents
        var applicantLevelDocuments = this.documentMdmList.filter(element => element.loanType === 'Applicant');

        //application level documents
        let applicationDocuments = this.documentMdmList.filter(item => (item.loanType !== 'Applicant'));

        this.documentList = [];
        for (let i = 0; i < this.appData.applicants.length; i++) {
          for (let j = 0; j < applicantLevelDocuments.length; j++) {
            let applicantDoc = this.targetList(applicantLevelDocuments[j], this.appData.applicants[i]);
            this.documentList.push(applicantDoc);
          }
        }

        // document list application level
        for (let index = 0; index < applicationDocuments.length; index++) {
          let applicantionDoc = this.targetList(applicationDocuments[index]);
          this.documentList.push(applicantionDoc);
        }
        return this.documentList;
      }
    } catch (exception) {
      console.log(exception.message)
    }

  }


  targetList(document, applicant?) {
    try {

      if (applicant && applicant.type === 'PRIMARY') {
        this.accountRelationShip = this.journeyService.getLabelFromCode(this.accountRelationshipList, applicant.loanRelationshipCode);

        this.tinNumber = applicant.tinNumber;
      } else if (applicant.type === 'CO_APPLICANT') {
        this.accountRelationShip = this.journeyService.getLabelFromCode(this.accountRelationshipList, applicant.loanRelationshipCode);;
        this.tinNumber = applicant.tinNumber;
      } else {
        this.accountRelationShip = 'NA'
        this.tinNumber = null;
      }

      this.applicantType = applicant && applicant.type ? applicant.type : null;
      this.order = applicant && applicant.order ? applicant.order : null;


      if (applicant) {
        this.applicableFor = applicant.firstName + " " + applicant.lastName;
      } else if (document.ApplicableFor === 'Application') {
        this.applicableFor = 'Application';
      } else {
        this.applicableFor = 'Account';
      }

      const docData = {
        'uploadedFor': this.applicableFor,
        'documentName': document.label,
        'accountRelationShip': this.accountRelationShip,
        'uploadDate': null,
        'applicantType': this.applicantType,
        'order': this.order,
        'isEditable': false,
        'tinNumber': this.tinNumber
      }

      return docData;

    } catch (exception) {
      console.log(exception.message)
    }


  }

  initiateForm(data?): FormGroup {
    try {
      data = data || {};
      let relationship;
      if (data && data.applicantType && data.applicantType === 'PRIMARY') {
        relationship = 'Primary Applicant'
      } else if (data && data.applicantType && data.applicantType === 'CO_APPLICANT') {
        relationship = 'Co Applicant'
      } else {
        relationship = 'NA'
      }
      return this.fb.group({
        id: [data.id || ''],
        justUploaded: [false],
        tinNumber: [data.tinNumber || ''],
        documentName: [data.documentName || ''],
        uploadedFor: [data.uploadedFor || ''],
        accountRelationShip: [data.accountRelationShip || ''],
        uploadDate: [data.uploadDate || ''],
        docIndex: [data.docIndex || ''],
        // odIndex: [data.odIndex || ''],
        extension: [data.extension || ''],
        applicantType: [data.applicantType || ''],
        order: [data.order || ''],
        isEditable: [data.isEditable === false ? false : true],
        relationship: [relationship || null]
      });
    } catch (exception) {
      console.log(exception.message)
    }

  }
  addRow() {
    try {
      const control = this.documentTable.get('documentRows') as FormArray;
      control.push(this.initiateForm());
    } catch (exception) {
      console.log(exception.message)
    }

  }

  deleteRow(index: number) {
    try {
      const control = this.documentTable.get('documentRows') as FormArray;
      control.removeAt(index);
    } catch (exception) {
      console.log(exception.message)
    }

  }

  editRow(group: FormGroup) {
    try {
      group.get('isEditable').setValue(true);
    } catch (exception) {
      console.log(exception.message)
    }

  }

  doneRow(group: FormGroup) {
    try {
      group.get('isEditable').setValue(false);
    } catch (exception) {
      console.log(exception.message)
    }

  }

  saveUserDetails() {
    try {
      // console.log(this.documentTable.value);
    } catch (exception) {
      console.log(exception.message)
    }

  }

  get getFormControls() {
    try {
      const control = this.documentTable.get('documentRows') as FormArray;
      return control;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  submitForm() {
    try {
      const control = this.documentTable.get('documentRows') as FormArray;
      this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
      console.log(this.touchedRows);
    } catch (exception) {
      console.log(exception.message)
    }

  }

  toggleTheme() {
    try {
      this.mode = !this.mode;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  addFiles(fileElem?) {
    try {
      //if (group.get('documentName').value) {
      fileElem.click();
      // } else {
      //   this.showDocumentNameError = true;
      // }

    } catch (exception) {
      console.log(exception.message)
    }

  }

  onFilesAdded($event, group: FormGroup, index) {
    try {
      if (group.get('documentName').value) {
        let documentObject = {
          documentName: group.get('documentName').value ? group.get('documentName').value : null,
          uploadedFor: group.get('uploadedFor').value ? group.get('uploadedFor').value : null,
          accountRelationship: group.get('accountRelationShip').value ? group.get('accountRelationShip').value : null,
          uploadDate: group.get('uploadDate').value ? group.get('uploadDate').value : null,
          documentIndex: index,
          docIndex: group.get('docIndex').value ? group.get('docIndex').value : null,
          id: group.get('id').value ? group.get('id').value : null,
          order: group.get('order').value ? group.get('order').value : null,
          tinNumber: group.get('tinNumber').value ? group.get('tinNumber').value : null
        }

        this.readThis($event.target, documentObject);
      } else {
        // group.set('isuploadClicked').value = true;
        this.showDocumentNameError = true;
      }

    } catch (exception) {
      console.log(exception.message)
    }
  }

  readThis(inputValue: any, document): void {
    try {
      const appData = this.journeyService.getFromStorage();
      var file: File = inputValue.files[0];
      let fileExt = file.name.split('.').pop();
      if (this.isFileExtAllowed(fileExt) && this.isAllowedFileSize(file)) {
        document['extension'] = fileExt;
        let uploadedDate = new Date();
        let date = (uploadedDate.getMonth() + 1) + '/' + (uploadedDate.getDate()) + '/' + uploadedDate.getFullYear();
        if (file && document) {
          if (file) {
            var myReader: FileReader = new FileReader();

            myReader.onloadend = (e) => {
              let imageData = {
                "uploadedFor": document.uploadedFor,
                "accountRelationship": document.accountRelationship,
                "nibNumber": document.tinNumber,
                "order": document.order,
                "data": this.convertBase64(myReader.result),
                "docName": file && file.name ? file.name : null,
                "extension": fileExt ? fileExt : null,
                "docType": document.documentName,
                "id": document.id ? document.id : null,
                "docIndex": null,
                // "odIndex": null,
                "workItemNumber": appData && appData.arn ? appData.arn : null,
                "uploadDate": date ? date : null,
                "error": null
              }

              this.uploadFiles(imageData, document);
            }
            myReader.readAsDataURL(file);
          }
        }
      } else {
        var alertObj = {
          type: 'error',
          message: (!this.isFileExtAllowed(fileExt)) ? `Only ${this.allowedFileType} file type allowed` : `Maximum ${this.maxFileSize} mb file allowed`,
          showAlert: true
        }
        this.alert = {};
        this.showAlert = true;
        window.scroll(0, 0);
        this.alert = alertObj;
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }

  uploadFiles(imageData, document) {
    try {
      const appData = this.journeyService.getFromStorage();
      const control = this.documentTable.get('documentRows') as FormArray;
      let modifiedDate = new Date().getFullYear() + '-' + this.formatDate(new Date().getMonth() + 1) + '-' + this.formatDate(new Date().getDate())
      control.at(document.documentIndex).get('uploadDate').patchValue(modifiedDate);
      let documentList = this.dtoToModel({ documents: this.documentTable.get('documentRows').value });

  
      //Commented by Hemlata for Mock Server Journey on 19 Oct 2022
      // this.journeyService.uploadDocuments(imageData).subscribe((response) => {
      //   if (response && response['success'] && response['data']) {
      //     this.showDocumentNameError = false;
      //     //if uploading an already uploaded document
      //     if (response['data']['id']) {
      //       control.at(document.documentIndex).get('id').patchValue(response['data']['id']);
      //     }

      //     control.at(document.documentIndex).get('uploadDate').patchValue(response['data']['uploadDate']);
      //     control.at(document.documentIndex).get('docIndex').patchValue(response['data']['docIndex']);
      //     control.at(document.documentIndex).get('extension').patchValue(document['extension']);
      //     control.at(document.documentIndex).get('justUploaded').patchValue(true);
      //     control.at(document.documentIndex).get('isEditable').patchValue(false);
      //     let documentList = this.dtoToModel({ documents: this.documentTable.get('documentRows').value });

      //     if (appData) {
      //       appData['documents'] = documentList.documents;
      //       this.journeyService.setInStorage(appData)
      //     }
      //   }
      // }, errorObject => {
      //   var alertObj = {
      //     type: "error",
      //     fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
      //     message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
      //     showAlert: true,
      //     stackTrace: {}
      //   }
      //   this.alert = {};
      //   this.showAlert = true;
      //   window.scroll(0, 0);
      //   this.alert = alertObj;
      // })
    } catch (exception) {
      console.log(exception.message)
    }
  }

  formatDate(value) {
    return (value < 10 ? '0' + value : value);
  };

  convertBase64(base64String) {
    try {
      return base64String.replace("data:image/jpeg;base64,", "").replace("data:image/jpg;base64,", "").replace("data:image/png;base64,", "").replace("data:image/gif;base64,", "").replace("data:application/pdf;base64,", "").replace("data:image/tiff;base64,", "").replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "").replace("data:application/vnd.ms-excel;base64,", "").replace("data:text/plain;base64,", "");
    } catch (exception) {
      console.log(exception.message)
    }
  }



  continue() {
    try {
      let appData = this.journeyService.getFromStorage();
      appData.preferences.lastVisitedPage = "DOCUMENT";
      let isComplete: boolean = (appData && appData.preferences && appData.preferences.status === "COMPLETED") ? true : false;
      let preferenceData = "DOCUMENT";
      JourneyService.stepObject[6].isValid = true;
      let applicationDTO = this.journeyService.getAccountRelationshipInDto();

      if (environment.isMockingEnabled) {
        this.journeyService.setInStorage(applicationDTO);
        this.router.navigate(['/journey/complete']);
      } else {
        //if resumed from dashboard and application status is 'IN_PROGRESS'
        if (isComplete) {
          this.journeyService.updateDocuments({
            arn: appData.arn,
            appData: applicationDTO,
            context: preferenceData
          }).subscribe((response) => {
            if (response && response.success && response.data && response.data.arn) {
              this.journeyService.setInStorage(response.data);
              this.journeyService.savePreference({
                arn: appData.arn,
                lastVisitedPage: preferenceData,
                visitorIP: null,
                saveFlag: false
              }).subscribe((response) => {
                if (response) {
                  this.router.navigate(['/journey/complete']);
                }
              }, errorObject => {
                var alertObj = {
                  type: "error",
                  fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                  message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                  showAlert: true,
                  stackTrace: {}
                }
                this.alert = {};
                this.showAlert = true;
                window.scroll(0, 0);
                this.alert = alertObj;
              });
            }
          }, errorObject => {
            var alertObj = {
              type: "error",
              fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
              message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
              showAlert: true,
              stackTrace: {}
            }
            this.alert = {};
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          });
        } else {
          this.journeyService.submitDocuments({
            arn: appData.arn,
            appData: applicationDTO,
            context: preferenceData,
            saveFlag: false
          }).subscribe((response) => {
            if (response && response.success && response.data && response.data.arn) {
              this.journeyService.setInStorage(response.data);
              this.journeyService.savePreference({
                arn: appData.arn,
                lastVisitedPage: preferenceData,
                visitorIP: null,
                saveFlag: false
              }).subscribe((response) => {
                if (response) {
                  this.router.navigate(['/journey/complete']);
                }
              }, errorObject => {
                var alertObj = {
                  type: "error",
                  fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                  message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                  showAlert: true,
                  stackTrace: {}
                }
                this.alert = {};
                this.showAlert = true;
                window.scroll(0, 0);
                this.alert = alertObj;
              });
            }
          }, errorObject => {
            var alertObj = {
              type: "error",
              fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
              message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
              showAlert: true,
              stackTrace: {}
            }
            this.alert = {};
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          })
        }
      }

    }
    catch (exception) {
      console.log(exception.message)
    }
  }

  dtoToModel(model) {
    try {
      let dataList: any = {};
      if (model.documents) {
        dataList.documents = model.documents.map((document) => {
          return {
            'id': document.id ? document.id : null,
            'documentName': document.documentName ? document.documentName : null,
            'uploadedFor': document.uploadedFor ? document.uploadedFor : null,
            'accountRelationShip': document.accountRelationShip ? document.accountRelationShip : null,
            'uploadDate': document.uploadDate ? document.uploadDate : null,
            'docIndex': document.docIndex ? document.docIndex : null,
            // 'odIndex': document.odIndex ? document.odIndex : null,
            'extension': document.extension ? document.extension : null,
            'applicantType': document.applicantType ? document.applicantType : null,
            'order': document.order ? document.order : null,
            'isEditable': document.isEditable ? document.isEditable : false,
            'justUploaded': document.justUploaded
          }
        });
      }
      return dataList;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  closeError() {
    try {
      this.alert = {};
      this.showAlert = false;
    } catch (exception) {
      console.log(exception.message)
    }
  }

  //method to check file size
  isAllowedFileSize(file) {
    const size = file.size / (1024 * 1024);
    const appConfig = this.persistenceService.getApplicationConfig();
    if (size <= parseInt(appConfig.maxFileSize)) {
      return true;
    } else {
      return false;
    }
  }

  //method to check allowed extension
  isFileExtAllowed(fileExt) {
    try {
      const appConfig = this.persistenceService.getApplicationConfig();
      const allowedFileType = appConfig.fileTypes.split(',');
      const isAllowed = allowedFileType.filter(element => {
        return element.toLowerCase() === fileExt.toLowerCase();
      });
      if (isAllowed.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (exception) {
      console.log(exception.message)
    }
  }

  //save and exit method
  saveAndExitApplication() {
    try {
      let appData = this.journeyService.getFromStorage();
      appData.preferences.lastVisitedPage = "DOCUMENT";
      let preferenceData = "DOCUMENT";
      JourneyService.stepObject[6].isValid = true;
      let applicationDTO = this.journeyService.getAccountRelationshipInDto();

      const dialogRef = this.dialog.open(SaveExitConfirmComponent, {
        width: '600px',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === "Y") {
          this.journeyService.updateDocuments({
            arn: appData.arn,
            appData: applicationDTO,
            context: preferenceData
          }).subscribe(response => {
            if (response && response.success && response.data && response.data.arn) {
              this.journeyService.setInStorage(response.data);
              this.journeyService.savePreference({
                arn: appData.arn,
                lastVisitedPage: preferenceData,
                visitorIP: null,
                saveFlag: true
              }).subscribe((response) => {
                if (response) {
                  this.router.navigate(['/journey/complete']);
                }
              }, errorObject => {
                var alertObj = {
                  type: "error",
                  fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
                  message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
                  showAlert: true,
                  stackTrace: {}
                }
                this.alert = {};
                this.showAlert = true;
                window.scroll(0, 0);
                this.alert = alertObj;
              });
            }
          }, errorObject => {
            var alertObj = {
              type: "error",
              fieldErrors: (errorObject && errorObject.error.errorMessageList && errorObject.error.errorMessageList.length > 0) ? errorObject.error.errorMessageList : null,
              message: (errorObject && !errorObject.error.errorMessageList) ? 'Some error occured, please contact support' : null,
              showAlert: true,
              stackTrace: {}
            }
            this.alert = {};
            this.showAlert = true;
            window.scroll(0, 0);
            this.alert = alertObj;
          });
        }
      });

    } catch (exception) {
      console.log(exception.messgae);
    }
  }

}

