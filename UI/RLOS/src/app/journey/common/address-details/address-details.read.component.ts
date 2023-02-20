import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AddressDetailsComponent } from './address-details.component';
@Component({
    selector: 'address-details-readonly',
    templateUrl: './address-details.read.component.html'
})

export class AddressDetailsReadComponent extends AddressDetailsComponent implements OnInit {

    @Input() model;
    @Input() applicantInfo;
    notSpecified;

    ngOnInit() {
        this.notSpecified = "Not Specified";
    }

    ngAfterViewInit() {
    }
}
