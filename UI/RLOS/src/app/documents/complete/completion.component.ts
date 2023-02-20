import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { JourneyService } from '../_root/journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { PersistanceService } from '../../core/services';

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

  constructor(private _route: Router, private persistenceService: PersistanceService) {

  }

  ngOnInit() {
    let application = this.persistenceService.getFromStorage("APP");
    if (application) {
      this.arn = application.arn;
    }

    // this.journeyService.removeFromStorage();
    // this.journeyService.removeLookupFromStorage();
  }

  continue(value) {
    this._route.navigate(['/documents/complete']);
  }

}
