import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JourneyService } from '../_root/journey.service';
import { Router, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { PersistanceService } from '../../core/services';

@Component({
  selector: 'thankYou',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
  addressForm: FormGroup;
  arn;
  private formControls;

  @Output()
  saveTabData: EventEmitter<String> = new EventEmitter<String>();

  constructor(private journeyService: JourneyService, private _route: Router, private formBuilder: FormBuilder, private persistenceService: PersistanceService) {
  }

  ngOnInit() {
    this.arn = this.persistenceService.getARNFromJourneyStorage();
    this.persistenceService.removeAllConfigData();
  }



  exit() {
    window.open("https://jm.jmmb.com/", "_self");
    // let navigationExtras: NavigationExtras = {
    //   queryParams: { 'arn': this.persistenceService.getARNFromJourneyStorage() }
    // };
    // this.persistenceService.setConfig({ state: { context: "JOURNEY" } })
    // this._route.navigate(['auth/resume'], navigationExtras);
  }
}
