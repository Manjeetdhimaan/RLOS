import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map } from "rxjs/operators";
import { TranslateService } from '@ngx-translate/core';

import { DocumentsService } from '../documents.service';


@Component({
  selector: 'documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  payload: any;
  buckets: any = [];
  documents: any;
  alertObj = {};
  dataLoaded: any = false;
  @ViewChild('file1') file1;
  @ViewChild('file2') file2;
  @ViewChild('selectField') selectField;
  @Input() config;
  @Input() index;
  isUploadComplete: boolean = true;
  isReadOnly;

  constructor(private documentsService: DocumentsService, private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    this.isReadOnly = true;

    let documents = this.config.documents;
    if (documents.length === 0) {
      documents = this.config.documents;
    }
    if (documents.length > 0) {
      for (let j = 0; j < documents.length; j++) {
        let index = this.getBucketIndex(documents, documents[j].docTypeCode);
        if (index >= 0) {
          let documentAtIndex = this.config.documents.find(x => x.docTypeCode == documents[j].docTypeCode);
          let docIndex = this.config.documents.findIndex(x => x.docTypeCode == documents[j].docTypeCode);
          this.config.documents[docIndex].images = [{ data: null }];
          if (documentAtIndex.images.length >= 0) {
            this.dataLoaded = true;
          } else {
            this.dataLoaded = true;
          }
        } else {
          this.dataLoaded = true;
        }
      }

    } else {
      this.dataLoaded = false;
    }
    // });

  };

  loadImages(docTypeCode, ind) {
    let index = this.getBucketIndex(this.config.documents, docTypeCode);
    // let documents = this.config.documents[index].documents;
    // return this.documentsService.getImages(this.config.applicantId, ind, documents).pipe(map(image => {
    this.config.documents[index].images.push({ data: {} });
    // }));
  };

  getBucketIndex(buckets, docTypeCode) {
    return buckets.findIndex((bucket) => {
      return bucket.docTypeCode === docTypeCode;
    });
  };

  savePanelData(params) {
    if (params.payload.action === 'delete') {
      this.deleteFile(params);
    } else {
      this.uploadFiles(params);
    }
  };

  deleteFile(params) {
    this.documentsService.deleteDocument(params.payload, this.config.applicantID).subscribe((response) => {
      this.config.documents[params.index].isComponentReadOnly = false;
      this.config.documents[params.index].uploaded = false;
      this.config.documents[params.index].images = [];
      this.checkIsReadOnly(params.index);
    });
  };

  uploadFiles(params) {
    params.payload.applicantId = this.config.id;
    this.config.documents[params.index].isComponentReadOnly = params.isReadOnly;
    this.documentsService.saveDocuments(params.payload).subscribe((response) => {
      this.config.documents[params.index].isComponentReadOnly = false;
      this.config.documents[params.index].uploaded = true;
      response[0].images[0].data = response[0].images[0].name ? response[0].images[0].name : response[0].images[0].ext;

      this.config.documents[params.index] = Object.assign(this.config.documents[params.index], response[0]);
      this.config.documents[params.index].omnidocsKey = response[0].images[0].omnidocsKey;
      let appData = this.documentsService.getFromStorage();
      appData.applicants[this.index].documents = this.config.documents;
      sessionStorage.setItem('JMMB.APP', JSON.stringify(appData));
      this.checkIsReadOnly(params.index);
    }, error => {
      this.alertObj = {
        type: 'error',
        message: "An Error Occured",
        showAlert: true,
        stackTrace: []
      }
    });
  }

  closeError() {
    this.alertObj = {};
  }

  checkIsReadOnly(index) {
    return this.config.documents[index].isComponentReadOnly;
  }

}
