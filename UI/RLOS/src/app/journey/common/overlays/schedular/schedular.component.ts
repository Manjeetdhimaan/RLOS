import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { JourneyService } from '../journey.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/directives/format-datepicker';
import { MaskedDate } from 'src/app/shared/services/utils/mask.helper';



@Component({
    selector: 'schedular-dailog',
    templateUrl: './schedular.component.html',
    styleUrls: ['./schedular.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})

export class SchedularComponent {
    dateMask = MaskedDate;
    @ViewChild('file1') file1;
    @ViewChild('file2') file2;
    @ViewChild('selectField') selectField;
    schedularForm: FormGroup;
    formControls;
    hourList;
    minuteList;
    minDate;
    maxDate;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SchedularComponent, any>, private formBuilder: FormBuilder
    ) {
        this.minDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() + 100);
        this.createForm();
        this.initStaticList();
    }

    createForm() {
        this.schedularForm = this.formBuilder.group({
            'meetingDate': [null, Validators.required],
            'hour': [null, Validators.required],
            'minute': [null, Validators.required]
        })
        this.formControls = this.schedularForm.controls;
    };

    initStaticList() {
        this.hourList = this.getHourList();
        this.minuteList = this.getMinuteList();
    }

    getHourList() {
        var minuteList = [];
        for (var i = 0; i <= 16; i++) {
            minuteList.push("" + i + "");
        }
        return minuteList;
    }

    getMinuteList() {
        var minuteList = [];
        for (var i = 0; i <= 59; i++) {
            minuteList.push("" + i + "");
        }
        return minuteList;
    }

    confirmOrNot(confirmation): void {
        this.dialogRef.close(this.schedularForm.value);
    };


    onNoClick(): void {
        this.dialogRef.close('N');
    };


}