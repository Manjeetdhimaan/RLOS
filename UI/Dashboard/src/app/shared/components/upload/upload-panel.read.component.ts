import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UploadComponent } from './upload.component';
import { PersistanceService } from '../../../core/services';
@Component({
    selector: 'upload-panel-readonly',
    templateUrl: './upload-panel.read.component.html',
    styleUrls: ['./upload.component.scss']
})

export class UploadPanelReadComponent extends UploadComponent implements OnInit {

    @Input() imageData;
    @Output() reCapture: EventEmitter<any> = new EventEmitter<any>();
    @Output() delete: EventEmitter<any> = new EventEmitter<any>();
    @Output() upload: EventEmitter<any> = new EventEmitter<any>();
    @Output() showError: EventEmitter<any> = new EventEmitter<any>();
    protected persistenceService: PersistanceService
    constructor(persistenceService: PersistanceService) {
        super(persistenceService);
        this.persistenceService = persistenceService;
    }

    ngOnInit() {
        this.imageData = this.imageData ? this.imageData : {};
        this.showFileTypeError = false;
        this.showFileSizeError = false;
    }

    ngAfterViewInit() {
    }

    addFiles(fileElem) {
        fileElem.click();
    }

    deleteFile() {
        this.delete.emit(this.imageData);
        this.imageData = {};
    }

    onFilesAdded($event, imageType?) {
        this.readThis($event.target, imageType);
    }

    readThis(inputValue: any, imageType): void {
        var file: File = inputValue.files[0];
        let fileExt = file.name.split('.').pop().toUpperCase();

        if (this.isFileExtAllowed(fileExt) && this.isAllowedFileSize(file)) {
            this.showError.emit({
                errorType: 'all',
                isShow: false
            });
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

                this.upload.emit(this.imageData);
            }
            myReader.readAsDataURL(file);
        }
        else {
            if (!this.isAllowedFileSize(file)) {
                this.showError.emit({
                    errorType: 'showFileSizeError',
                    isShow: true
                });
            }
            if (!this.isFileExtAllowed(fileExt)) {
                this.showError.emit({
                    errorType: 'showFileTypeError',
                    isShow: true
                });
            }
        }
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
}
