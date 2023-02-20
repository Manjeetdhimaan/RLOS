import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';



@Component({
    selector: 'application-exist-dailog',
    templateUrl: './application-exist.component.html',
    styleUrls: ['./application-exist.component.scss']
})

export class ApplicationExistDialog {
    @ViewChild('file1') file1;
    @ViewChild('file2') file2;
    @ViewChild('selectField') selectField;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<ApplicationExistDialog, any>
    ) {
    }

    resumeApplication(): void {
        this.dialogRef.close('Resume');
    };

    onNoClick(){
        this.dialogRef.close();
    }


    resetApplication(): void {
        this.dialogRef.close('Reset');
    };


}