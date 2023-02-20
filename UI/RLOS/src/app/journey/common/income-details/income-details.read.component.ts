import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IncomeDetailsComponent } from './income-details.component';
@Component({
    selector: 'income-details-readonly',
    templateUrl: './income-details.read.component.html'
})

export class IncomeDetailsReadComponent extends IncomeDetailsComponent implements OnInit {

    @Input() model;
    notSpecified;

    ngOnInit() {
        this.notSpecified = "Not Specified";
    }

    ngAfterViewInit() {
    }
}
