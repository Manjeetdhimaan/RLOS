import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'error-alert',
    templateUrl: './error-alert.component.html',
    styleUrls: ['./error-alert.component.scss']
})
export class ErrorAlertComponent {

    @Input() errorObject;
    @Output() close: EventEmitter<any> = new EventEmitter<any>();
    showAlert: boolean;
    viewMore: boolean;
    showMessage: boolean;
    constructor() {
        this.showAlert = true;
    }

    ngOnInit() {
        this.showAlert = this.errorObject.showAlert ? true : false;
        if (this.errorObject.message) {
            if (this.errorObject.message.indexOf('undefined') !== -1) {
                this.showMessage = true;
            }
            else {
                this.showMessage = false;
            }
        }
        this.viewMore = true;
    }

    closeError() {
        this.close.emit();
    }

    toggleStackTrace() {
        this.viewMore = !this.viewMore;
    }
}