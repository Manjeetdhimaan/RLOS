import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';



@Component({
    selector: 'add-coapplicant-dailog',
    templateUrl: './add-coapplicant.component.html',
    styleUrls: ['./add-coapplicant.component.scss']
})

export class AddCoApplicantDialog {
    @ViewChild('file1') file1;
    @ViewChild('file2') file2;
    @ViewChild('selectField') selectField;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<AddCoApplicantDialog, any>
    ) {
    }

    confirmOrNot(confirmation): void {
        this.dialogRef.close(confirmation);
    };


    onNoClick(): void {
        this.dialogRef.close();
    }


}