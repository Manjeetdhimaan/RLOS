import { Component, ViewEncapsulation, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { PersistanceService } from '../../../../core/services';
import { JourneyService } from '../../../_root/journey.service';

@Component({
  selector: 'upload-dialog',
  templateUrl: './id-scan.modal.component.html',
  styleUrls: ['./id-scan.modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadDialog {
  @ViewChild('file1') file1;
  @ViewChild('file2') file2;
  @ViewChild('file3') file3;
  @ViewChild('selectField') selectField;

  captureOtherImages: boolean = false;
  captureDealerInvoice: boolean = false;
  showIDScan: boolean = false;
  imageData: any = [];
  showMandatoryDocsMsg: boolean = false;
  buckets: any;
  showFileTypeError;
  showFileSizeError;
  allowedFileType;
  appConfig;
  applicantId;

  constructor(
    public dialogRef: MatDialogRef<UploadDialog, any>, private journeyService: JourneyService, private persistenceService: PersistanceService,
    @Inject(MAT_DIALOG_DATA) public modalData) {
    this.imageData = this.modalData.imageData ? this.modalData.imageData : [];
    this.applicantId = this.modalData.id;
    this.showIDScan = this.modalData.showIDScan;
    this.captureOtherImages = this.modalData.captureOtherImages;
    this.captureDealerInvoice = this.modalData.captureDealerInvoice;
    this.appConfig = this.persistenceService.getApplicationConfig();
    this.allowedFileType = this.appConfig.fileTypes.split(',').join(', ');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  continue(event?) {
    if (this.captureOtherImages && this.imageData) {
      if (this.imageData[0] && this.imageData[1] && this.imageData[0].data && this.imageData[1].data) {
        this.dialogRef.close(this.imageData);
      } else {
        this.showMandatoryDocsMsg = true;
      }
    }
    else if (this.captureDealerInvoice && this.imageData) {
      if (this.imageData[0] && this.imageData[0].data) {
        this.dialogRef.close(this.imageData);
      } else {
        this.showMandatoryDocsMsg = true;
      }
    }
    else {
      this.dialogRef.close(this.imageData);
    }
  }

  addFiles(fileElem) {
    fileElem.click();
  }

  addBackFiles() {
    this.file2.nativeElement.click();
  }

  deleteFile(data) {
    if (this.applicantId && this.imageData[data.imgInfo.order].oldDocKey)
      this.journeyService.removeDocuments(this.imageData[data.imgInfo.order], this.applicantId).subscribe(response => {
        this.showFileTypeError = false;
        this.showFileSizeError = false;
        this.imageData[data.imgInfo.order] = null;
      },
        error => {
          console.log(error);
        });
    else {
      this.showFileTypeError = false;
      this.showFileSizeError = false;
      this.imageData[data.imgInfo.order] = null;
    }    
  }

  // onFilesAdded($event, data) {
  //   this.readThis($event.target, data);
  // }

  onFilesAdded(data) {
    this.showFileTypeError = false;
    this.showFileSizeError = false;
    this.readThis(data);
  }

  showError(data) {
    if (data.isShow) {
      if (data.errorType === 'all') {
        this.showFileTypeError = true;
        this.showFileSizeError = true;
      }
      else if (data.errorType === 'showFileSizeError') {
        this.showFileSizeError = true;

      }
      else if (data.errorType === 'showFileTypeError') {
        this.showFileTypeError = true;
      }
    }
    else {
      this.showFileTypeError = false;
      this.showFileSizeError = false;
    }
  }

  readThis(data, inputValue?: any): void {
    var file: File = data.inputValue.files[0];
    var myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.imageData[data.imgInfo.order] = this.imageData[data.imgInfo.order] ? this.imageData[data.imgInfo.order] : {};
      this.imageData[data.imgInfo.order] = {
        "docTypeCode": data.imgInfo.code,
        "data": myReader.result,
        "ext": file.name.split('.').pop().toUpperCase(),
        "name": file.name,
        "oldDocKey": data.oldDocKey
      }
      if (this.imageData[0] && this.imageData[1] && this.imageData[0].data && this.imageData[1].data) {
        this.showMandatoryDocsMsg = false;
      }
    }
    myReader.readAsDataURL(file);
  }
}