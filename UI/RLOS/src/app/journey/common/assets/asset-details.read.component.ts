import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssetsComponent } from './assets.component';
@Component({
    selector: 'asset-details-readonly',
    templateUrl: './asset-details.read.component.html'
})

export class AssetDetailsReadComponent extends AssetsComponent implements OnInit {

    @Input() model;
    notSpecified;

    ngOnInit() {
        this.notSpecified = "Not Specified";
    }

    ngAfterViewInit() {
    }
}
