import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasicDetailsComponent } from './basic-details.component';
@Component({
    selector: 'basic-details-readonly',
    templateUrl: './basic-details.read.component.html',
    styleUrls: ['./basic-details.component.scss']
})

export class BasicDetailsReadComponent extends BasicDetailsComponent implements OnInit {

    @Input() model;
    @Input() isCoApplicant;
    notSpecified;
    showIssueState;

    ngOnInit() {
        this.notSpecified = "Not Specified";
    }

    ngAfterViewInit() { }
}
