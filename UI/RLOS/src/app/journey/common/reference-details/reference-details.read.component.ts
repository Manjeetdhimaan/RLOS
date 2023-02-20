import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ReferenceDetailsComponent } from './reference-details.component';
@Component({
    selector: 'reference-details-readonly',
    templateUrl: './reference-details.read.component.html'
})

export class ReferenceDetailsReadComponent extends ReferenceDetailsComponent implements OnInit {

    @Input() model;
    notSpecified;

    //subhasree
    ngOnInit() {
        this.notSpecified = "Not Specified";
        this.model.currentAddress = this.model.addresses.find(address => address.type === 'CURRENT');
        this.model.mailingAddress = this.model.addresses.find(address => address.type === 'MAILING');
    }

    ngAfterViewInit() {
    }
}
