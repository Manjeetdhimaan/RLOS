import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmpDetailsComponent } from './employment-details.component';
@Component({
    selector: 'emp-details-readonly',
    templateUrl: './employment-details.read.component.html'
})

export class EmpDetailsReadComponent extends EmpDetailsComponent implements OnInit {

    @Input() model;
    notSpecified;

    ngOnInit() {
        this.notSpecified = "Not Specified";
    }

    ngAfterViewInit() {
    }
}
