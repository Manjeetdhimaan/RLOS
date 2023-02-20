import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PersistanceService } from '../../../core/services';

@Component({
  selector: 'upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  // imageData: any;
  @ViewChild('file1') file1;
  @ViewChild('file2') file2;
  @ViewChild('selectField') selectField;
  showAdded;
  showFileTypeError;
  showFileSizeError;
  myInput;
  showCamera;
  @Input() imageData: any;
  @Input() isReadOnly;
  @Input() order;
  @Input() isDocumentModule;
  @Input() imgInfo;
  @Output() saveData: EventEmitter<any> = new EventEmitter<any>();
  @Output() showError: EventEmitter<any> = new EventEmitter<any>();
  @Output() onFileAdded: EventEmitter<any> = new EventEmitter<any>();
  @Output() removeFile: EventEmitter<any> = new EventEmitter<any>();
  constructor(protected persistenceService: PersistanceService) {
    if (this.persistenceService.isTouchDevice()) {
      this.showCamera = true;
    }
    else {
      this.showCamera = false;
    }
  }

  ngOnInit() {
    this.imageData = this.imageData ? this.imageData : null;
    this.showAdded = this.imageData && this.imageData.name ? true : false;
  }

  // ngOnChanges() {
  //   this.imageData = this.image ? this.image : {};
  // }

  addFiles(fileElem?) {
    if (this.persistenceService.isTouchDevice()) {
      let that = this;
      that.myInput = document.getElementById('myFileInput');
      that.myInput.addEventListener('change', function () {
        var file: File = this.files[0];
        let fileExt = file.name.split('.').pop().toUpperCase();
        if (that.isFileExtAllowed(fileExt) && that.isAllowedFileSize(file)) {
          that.showFileTypeError = false;
          that.showFileSizeError = false;
          that.showFileTypeError = true;
          that.showError.emit({
            errorType: 'all',
            isShow: false
          });
          if (that.isDocumentModule) {
            var myReader: FileReader = new FileReader();

            myReader.onloadend = (e) => {
              let omnidocsKey = (that.imageData && that.imageData.omnidocsKey) ? that.imageData.omnidocsKey : null;
              that.imageData = {
                "data": myReader.result,
                "ext": file.name.split('.').pop(),
                "name": file.name,
                "order": that.order,
                "oldDocKey": omnidocsKey
              }

              that.saveData.emit({
                action: 'upload',
                images: [that.imageData]
              });
            }
            myReader.readAsDataURL(file);
          }
          else {
            let omnidocsKey = (that.imageData && that.imageData.omnidocsKey) ? that.imageData.omnidocsKey : null;
            that.onFileAdded.emit({ inputValue: that.myInput, imgInfo: that.imgInfo, oldDocKey: omnidocsKey });
            that.showAdded = true;
          }
        }
        else {
          if (!that.isAllowedFileSize(file)) {
            that.showFileSizeError = true;

            that.showError.emit({
              errorType: 'showFileSizeError',
              isShow: true
            });
          }
          if (!that.isFileExtAllowed(fileExt)) {
            that.showFileTypeError = true;
            that.showError.emit({
              errorType: 'showFileTypeError',
              isShow: true
            });
          }
        }
      }, false);
    }
    else {
      fileElem.click();
    }
  }

  deleteFile() {
    // this.showFileTypeError = false;
    // this.showFileSizeError = false;
    // this.showFileTypeError = true;
    if (this.isDocumentModule) {
      this.saveData.emit({
        action: 'delete',
        imageData: this.imageData
      });
      this.imageData.data = null;
      this.imageData = {};
    }
    else {
      this.removeFile.emit({ imgInfo: this.imgInfo });
      this.showAdded = false;
    }
  }

  onFilesAdded($event, imageType) {
    this.readThis($event.target, imageType);
  }

  readThis(inputValue: any, imageType): void {
    var file: File = inputValue.files[0];
    let fileExt = file.name.split('.').pop().toUpperCase();
    if (this.isFileExtAllowed(fileExt) && this.isAllowedFileSize(file)) {
      this.showFileTypeError = false;
      this.showFileSizeError = false;
      this.showFileTypeError = true;
      this.showError.emit({
        errorType: 'all',
        isShow: false
      });
      if (this.isDocumentModule) {
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
          let omnidocsKey = (this.imageData && this.imageData.omnidocsKey) ? this.imageData.omnidocsKey : null;
          this.imageData = {
            "data": myReader.result,
            "ext": file.name.split('.').pop(),
            "name": file.name,
            "order": this.order,
            "oldDocKey": omnidocsKey
          }

          this.saveData.emit({
            action: 'upload',
            images: [this.imageData]
          });
        }
        myReader.readAsDataURL(file);
      }
      else {
        let omnidocsKey = (this.imageData && this.imageData.omnidocsKey) ? this.imageData.omnidocsKey : null;
        this.onFileAdded.emit({ inputValue: inputValue, imgInfo: this.imgInfo, oldDocKey: omnidocsKey });
        this.showAdded = true;
      }
    }
    else {
      if (!this.isAllowedFileSize(file)) {
        this.showFileSizeError = true;

        this.showError.emit({
          errorType: 'showFileSizeError',
          isShow: true
        });
      }
      if (!this.isFileExtAllowed(fileExt)) {
        this.showFileTypeError = true;
        this.showError.emit({
          errorType: 'showFileTypeError',
          isShow: true
        });
      }
    }
  }

  uploadImage(imageData) {
    this.saveData.emit({
      action: 'upload',
      images: [imageData]
    });
  }

  isAllowedFileSize(file) {
    let size = file.size / (1024 * 1024);
    let appConfig = this.persistenceService.getApplicationConfig();
    return (size <= parseInt(appConfig.maxFileSize)) ? true : false;
  }

  isFileExtAllowed(fileExt) {
    let appConfig = this.persistenceService.getApplicationConfig();
    let allowedFileType = appConfig.fileTypes.split(',');
    let isAllowed = allowedFileType.filter(element => {
      return element === fileExt;
    });
    // if (fileExt === "JPG" || fileExt === "PNG" || fileExt === "JPEG" || fileExt === "PDF" || fileExt === "TIF" || fileExt === "TIFF" || fileExt === "DOC" || fileExt === "DOCX")
    //   return true;
    return isAllowed.length > 0 ? true : false;
  }

  sendFileError(file) {
    this.showError.emit({
      errorType: file.errorType,
      isShow: file.isShow
    });
  }

  back() {
    // this._route.navigate(['/journey/complete'])
  }

  continue(value) {
    //  this._route.navigate(['/journey/complete']);
  }

}
