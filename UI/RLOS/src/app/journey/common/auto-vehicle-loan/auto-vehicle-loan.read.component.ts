import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AutoVehicleLoanComponent } from './auto-vehicle-loan.component';
@Component({
    selector: 'auto-vehicle-loan-readonly',
    templateUrl: './auto-vehicle-loan.read.component.html'
})

export class AutoVehicleLoanReadComponent extends AutoVehicleLoanComponent implements OnInit {

    @Input() model;
    @Input() collateralType;
    @Input() showVINNumber;
    notSpecified;

    ngOnInit() {
        this.notSpecified = "Not Specified";
    }

    ngAfterViewInit() {
    }
}
