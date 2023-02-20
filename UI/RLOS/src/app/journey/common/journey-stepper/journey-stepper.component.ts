import { Component, OnInit, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { JourneyService } from '../../_root/journey.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'journey-stepper',
  templateUrl: './journey-stepper.component.html',
  styleUrls: ['./journey-stepper.component.scss']
})

export class JourneyStepperComponent implements OnInit {
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  currentStep = 0;
  @ViewChild('stepper') stepper;
  steps;
  constructor(private _formBuilder: FormBuilder, private location: Location, private _router: Router, private route: ActivatedRoute, private journeyService: JourneyService) {
  }

  ngOnInit() {
    this.steps = [
      {
        "label": "Getting Started",
        "isCompleted": false
      },
      {
        "label": "About Yourself",
        "isCompleted": false
      },
      {
        "label": "Co-Applicants",
        "isCompleted": false
      },
      {
        "label": "Product Details",
        "isCompleted": false
      },
      {
        "label": "Financials",
        "isCompleted": false
      },
      {
        "label": "Review",
        "isCompleted": false
      },
      {
        "label": "Consent",
        "isCompleted": false
      },
      {
        "label": "Documents",
        "isCompleted": false
      },
      {
        "label": "Complete",
        "isCompleted": false
      }
    ]
    // this.steps = ['Start Application', 'Personal Information', 'Co-Applicant Information', 'Summary', 'Disclosures', 'Submit'];
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    for (let i = 0; i < this.steps.length; i++) {
      this.steps[i].isCompleted = false;
    }

  }

  ngAfterViewInit() {

    this.setStepper();
  }

  setStepper() {
    if (this.stepper) {
      let step = this.journeyService.getStep();
      // this.stepper.selectedIndex = null;
      this.stepper.selectedIndex = step.activeStep;
      this.currentStep = step.activeStep;
      if (this.steps) {
        if (step.activeStep > 0) {
          for (let i = 0; i < step.activeStep; i++) {
            this.steps[i].isCompleted = true;
          }
        }
        else {
          for (let i = 0; i < step.activeStep; i++) {
            this.steps[i].isCompleted = false;
          }
        }
      }
      // });
      this.stepper.selectionChange.subscribe(selection => {
        // //console.log(selection.selectedStep)
        // //console.log(selection.previouslySelectedStep)
      });
    }
  };


} 
