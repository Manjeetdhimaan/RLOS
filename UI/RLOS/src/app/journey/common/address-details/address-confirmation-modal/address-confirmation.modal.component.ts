import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';



@Component({
  selector: 'confirm-dailog',
  templateUrl: './address-confirmation.modal.component.html',
  styleUrls: ['./address-confirmation.modal.component.scss']
})
export class ConfirmDialog {
  @ViewChild('file1') file1;
  @ViewChild('file2') file2;
  @ViewChild('selectField') selectField;

  constructor(public dialogRef: MatDialogRef<ConfirmDialog, any>) {
  }

  confirmOrNot(confirmation): void {
    this.dialogRef.close(confirmation);
  };

  onNoClick(): void {
    this.dialogRef.close();
  };




}