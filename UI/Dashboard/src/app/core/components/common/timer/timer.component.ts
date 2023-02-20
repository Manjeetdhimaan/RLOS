import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

/** Component opened inside a snackbar. */
@Component({
  selector: 'countdown-snackbar',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class CountdownSnackbarComponent {
  time;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<CountdownSnackbarComponent, any>) {
    this.time = this.data.timeoutDuration;
  }

  ngOnInit() {
    let that = this;
    setInterval(function () {
      if (that.time > 0) {
        that.time -= 1;
      }
      if(that.time === 0){
        that.dialogRef.close();
      }
    }, 1000);
  }

  Confirm(confirmation) {
    this.dialogRef.close(confirmation);
  }
}
