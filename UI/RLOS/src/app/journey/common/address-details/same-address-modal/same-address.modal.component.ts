import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';



@Component({
  selector: 'same-address-dailog',
  templateUrl: './same-address.modal.component.html',
  styleUrls: ['./same-address.modal.component.scss']
})
export class SameAddressDialog {
  @ViewChild('file1') file1;
  @ViewChild('file2') file2;
  @ViewChild('selectField') selectField;

  constructor(public dialogRef: MatDialogRef<SameAddressDialog, any>) {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }



}