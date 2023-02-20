import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss']
})

export class LoaderComponent implements OnInit {
    show = false;
    private subscription: Subscription;
    constructor(
        private loaderService: LoaderService,
        private spinner: NgxSpinnerService
    ) { }
    ngOnInit() {
        this.subscription = this.loaderService.getLoaderState()
            .subscribe((state) => {
                if (state.show) {
                    this.spinner.show();
                }
                else {
                    this.spinner.hide();
                }
            });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}