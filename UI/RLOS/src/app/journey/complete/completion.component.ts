import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { JourneyService } from '../_root/journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { PersistanceService } from '../../core/services';
import { MessageService } from '../../shared';

@Component({
  selector: 'completion',
  templateUrl: './completion.component.html',
  styleUrls: ['./completion.component.scss']
})
export class CompletionComponent implements OnInit {
  addressForm: FormGroup;
  arn;
  private formControls;

  @Output()
  saveTabData: EventEmitter<String> = new EventEmitter<String>();

  constructor(private journeyService: JourneyService, private messageService: MessageService, private _route: Router, private formBuilder: FormBuilder, private persistenceService: PersistanceService) {
    this.journeyService.setStepper(6);
    let currentStep = 6;
    this.messageService.sendStepper(currentStep);
  }

  ngOnInit() {
    // this.arn = this.journeyService.getARNFromStorage();
    let appData = this.journeyService.getFromStorage();
    this.arn = appData.arn

    // this.journeyService.removeFromStorage();
    // this.journeyService.removeLookupFromStorage();
    this.persistenceService.removeAllConfigData();
  }
  exit() {
    window.open("https://jm.jmmb.com/", "_self");
  }


  back() {
    this._route.navigate(['/journey/complete'])
  }

  continue(value) {
    this._route.navigate(['/journey/complete']);
  }

}
