import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { JourneyService } from './journey.service';
import { Subscription } from 'rxjs';

import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from '../../shared';
@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.scss']
})
export class JourneyComponent implements OnInit {
  // public browserRefresh: boolean;
  @ViewChild('stepper') stepper;
  steps = [];
  currentStep;
  subscription: Subscription;
  constructor(private _router: Router, private journeyservice: JourneyService, private translate: TranslateService,
    private spinner: NgxSpinnerService, private messageService: MessageService) {
    translate.setDefaultLang('en');
  }

  ngOnInit() {
    console.log('journy component')
    this.steps = this.journeyservice.steps;
    window.scroll(0, 0);
    // this.stepper.setStepper();
    this.messageService.getStepper().subscribe(step => {
      if (step) {
        console.log('IF journy component')
        this.stepper.setStepper();
      }
    });


    // this.journeyservice.getLookupData()
    //   .subscribe(resp => {s
    //     this.journeyservice.setLookupInStorage(resp);
    //   }, error => {
    //   });

    // this._router.navigate(['/journey/applicant'], { queryParams: { loanType: 'PERSONAL_LOAN' } });
    // this._router.navigate(['/journey/applicant']);
  }

  onActivate(event) {
    window.scroll(0, 0);
  }

  setCurrentStep(step) {
    this.currentStep = step.currentStep;
    this.stepper.setStepper();
  }

}
