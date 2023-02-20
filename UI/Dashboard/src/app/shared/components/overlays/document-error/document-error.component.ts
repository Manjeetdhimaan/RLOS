import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';



@Component({
    selector: 'document-error',
    templateUrl: './document-error.component.html',
    styleUrls: ['./document-error.component.scss']
})

export class DocErrorDialog {
    constructor(public dialogRef: MatDialogRef<DocErrorDialog, any>
    ) {
    }


    onNoClick(): void {
        this.dialogRef.close();
    };


}