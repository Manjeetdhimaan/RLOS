import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentsService } from '../documents.service';
import { map } from "rxjs/operators";
import { TranslateService } from '@ngx-translate/core';
//import { DocErrorDialog } from '../../shared/components/overlays/document-error';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocErrorDialog } from 'src/app/shared/components/overlays/document-error';

@Component({
  selector: 'documents-tab',
  templateUrl: './documents-tab.component.html',
  styleUrls: ['./documents-tab.component.scss']
})
export class DocumentsTabComponent implements OnInit {
  imageData: any;
  payload: any;
  buckets: any = [];
  documents: any;
  alertObj = {};
  primaryConfig: any;
  coAppConfig: any;
  dataLoaded: any = false;
  configLoaded: boolean = false;
  invalidBucketIndex;
  applicantIndex;
  alert: {};
  @ViewChild('file1') file1;
  @ViewChild('file2') file2;
  @ViewChild('selectField') selectField;

  @Input() config;
  @Input() index;
  isUploadComplete: boolean = true;
  isReadOnly;

  constructor(private _route: Router, private documentsService: DocumentsService, private translate: TranslateService, public dialog: MatDialog,
    private spinner: NgxSpinnerService) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.imageData = {};
    let appData = this.documentsService.getFromStorage();
    let coAppData = appData.applicants.filter(x => x.type == "CO_APPLICANT");
    let workItemNumber = appData.workItemNumber;

    if (!appData.applicants[0].document) {
      appData.applicants[0]['document'] = [];
      let modifiedData = this.documentsService.modifyDto(workItemNumber, appData.applicants[0]);
      this.primaryConfig = modifiedData.document;
    } else {
      this.primaryConfig = appData.applicants[0].document;
    }


    if (coAppData) {
      let temp = [];
      coAppData.forEach(element => {
        if (!element.document) {
          element['document'] = [];
          let modifiedData = this.documentsService.modifyDto(workItemNumber, element);
          temp.push(modifiedData.document);
        } else {
          temp.push(element.document);
        }
      });
      this.coAppConfig = temp;
    }

    // this.coAppConfig = modifiedData.document;
    this.configLoaded = true;
    this.documentsService.setInStorage('APP', appData)
    // this.documentsService.getConfig().subscribe((conf: any) => {
    //   if (conf) {
    //     let config = this.documentsService.getFromStorage();
    //     this.primaryConfig = config.applicants.filter(x => x.type === "PRIMARY");
    //     // this.primaryConfig = this.getApplicantConfig(primaryConf, 'PRIMARY');
    //     this.primaryConfig = this.documentsService.processConfig(this.primaryConfig[0]);
    //     this.coAppConfig = config.applicants.filter(x => x.type === "CO_APPLICANT");
    //     // this.coAppConfig = this.getApplicantConfig(coAppConf, 'CO_APPLICANT');
    //     let temp = [];
    //     this.coAppConfig.forEach((conf) => {
    //       temp.push(this.documentsService.processConfig(conf));
    //     });
    //     this.coAppConfig = temp;
    //     this.configLoaded = true;
    //   }
    //   else {
    //     var alertObj = {
    //       type: "error",
    //       message: "There is some Error occured. Please contact branch.",
    //       //exceptionCode: error.error.status,
    //       showAlert: true
    //     }
    //     this.alert = alertObj;
    //   }
    // }, error => {
    //   if (error.error.exceptionCode === 1020) {
    //     this._route.navigate(['documents/complete']);
    //   }
    //   else {
    //     var alertObj = {
    //       type: "error",
    //       message: error.message,
    //       //exceptionCode: error.error.status,
    //       showAlert: true,
    //       stackTrace: error.stackTrace
    //     }
    //     this.alert = alertObj;
    //   }
    // });
  };

  getApplicantConfig(config, applicantType) {
    let applicantConfig = config.filter((bucket) => {
      return bucket.type === applicantType
    });

    return applicantConfig;
  }


  // continue() {
  //   let appData = this.documentsService.getFromStorage();
  //   let arn = appData.arn
  //   if (arn) {
  //     this.documentsService.submitDocument(arn).subscribe(resp => {
  //       this._route.navigate(['journey/complete']);
  //     });
  //   }

  // }

  continue() {
    this.applicantIndex = -1;
    if (1) {
      this.documentsService.submitApplication().subscribe(response => {
        this._route.navigate(['journey/complete']);
      });
    } else {
      var dialogRef = this.dialog.open(DocErrorDialog);
      dialogRef.afterClosed().subscribe(result => {
        this.primaryConfig.documents.forEach((bucket, index) => {
          if (!bucket.uploaded) {
            this.applicantIndex = 0;
            this.invalidBucketIndex = index;
          }
        });        
        if (this.applicantIndex === 0) {
          this.primaryConfig.invalidIndex = this.invalidBucketIndex;
        }
        else if (this.applicantIndex < 0) {
          this.coAppConfig.forEach((coApp, coAppIndex) => {
            coApp.documents.forEach((bucket, index) => {
              if (!bucket.uploaded) {
                this.applicantIndex = coAppIndex + 1;
                this.invalidBucketIndex = index;
              }
            });
          });
          if (this.applicantIndex > 0)
            this.coAppConfig[this.applicantIndex - 1].invalidIndex = this.invalidBucketIndex;
        }
      });
    }
  }

  closeError() {
    this.alert = {};
  }
  back() {
    this._route.navigate(['/journey/consents'])
  }
}
