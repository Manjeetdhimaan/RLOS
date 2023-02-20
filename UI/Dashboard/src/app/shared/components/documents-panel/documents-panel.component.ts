import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, ViewEncapsulation, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { PersistanceService } from '../../../core/services/persistence.service';

@Component({
  selector: 'documents-panel',
  templateUrl: './documents-panel.component.html',
  styleUrls: ['./documents-panel.component.scss']
})
export class DocumentsPanelComponent implements OnInit, OnChanges {
  imageData: any;

  @Input()
  bucket: any;
  @Input()
  index: any;
  @Input() isComponentReadOnly;
  payload: any;
  showFileTypeError;
  showFileSizeError;
  allowedFileType;
  appConfig;
  @Output() savePanelData: EventEmitter<any> = new EventEmitter<any>();

  constructor(private persistenceService: PersistanceService) {
    this.appConfig = this.persistenceService.getApplicationConfig();
    this.allowedFileType = this.appConfig.fileTypes.split(',').join(', ');
  }

  ngOnInit() {
    this.imageData = {};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isComponentReadOnly && changes.isComponentReadOnly.currentValue) {
      this.isComponentReadOnly = changes.isComponentReadOnly.currentValue;
    }
  }

  getArray(size) {
    return new Array(size)
  };

  saveData(payload) {
    this.showFileTypeError = false;
    this.showFileSizeError = false;
    payload.docTypeCode = this.bucket.docTypeCode;
    payload.images[0].oldDocKey = this.bucket.omnidocsKey ? this.bucket.omnidocsKey : null;
    this.payload = payload;
    this.uploadFiles();
  };

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

  uploadFiles() {
    this.payload = this.payload ? this.payload : this.bucket;
    // if (this.payload.images && this.payload.images.length > 0) {
    this.savePanelData.emit({ payload: this.payload, isReadOnly: this.bucket.isComponentReadOnly, index: this.index });
    // }
  };

  editPanel() {
    this.bucket.isComponentReadOnly = false;
  };

}
