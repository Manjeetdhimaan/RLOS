import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';



@Component({
    selector: 'confirm-bank-employee',
    templateUrl: './confirm-employee.component.html',
    styleUrls: ['./confirm-employee.component.scss']
})

export class ConfirmOverlay {
    constructor(public dialogRef: MatDialogRef<ConfirmOverlay, any>
    ) {
    }

    confirmOrNot(confirmation): void {
        this.dialogRef.close(confirmation);
    };


    onNoClick(): void {
        this.dialogRef.close();
    };


}