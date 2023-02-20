import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'documents-view',
  templateUrl: './journey.component.html'
})
export class JourneyComponent implements OnInit {
  steps = [];
  constructor(private _router: Router, private translate: TranslateService,
    private spinner: NgxSpinnerService) {
    translate.setDefaultLang('en');
  }
  ngOnInit() {
    // this.steps = this.journeyservice.steps;
    // this.journeyservice.getLookupData()
    //   .subscribe(resp => {s
    //     this.journeyservice.setLookupInStorage(resp);
    //   }, error => {
    //   });

    // this._router.navigate(['/journey/applicant'], { queryParams: { loanType: 'PERSONAL_LOAN' } });
   // this._router.navigate(['/journey/applicant']);
  }

}
