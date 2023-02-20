import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerInput } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { APP_DATE_FORMATS, AppDateAdapter } from 'src/app/shared/directives/format-datepicker';
import { Subscription, fromEvent } from 'rxjs';
import { PersistanceService, ValidationUtilsService } from 'src/app/core/services';
import { MaskedDate } from 'src/app/shared/services/utils/mask.helper';


@Component({
    selector: 'app-scheduler',
    templateUrl: './scheduler.component.html',
    styleUrls: ['./scheduler.component.scss'],
    providers: [
        { provide: DateAdapter, useClass: AppDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
    ]
})
export class SchedulerComponent implements OnInit {

    dateMask = MaskedDate;

    @ViewChild('file1') file1;
    @ViewChild('file2') file2;
    @ViewChild('selectField') selectField;

    eventSubscription: Subscription;
    @ViewChild('dateOfAppointment') dateOfAppointment: ElementRef;
    @ViewChild(MatDatepickerInput) datepickerInput: MatDatepickerInput<any>;

    schedularForm: FormGroup;
    formControls;
    hourList;
    minuteList;
    alert: {};
    showAlert;
    minDate;
    maxDate;
    scheduleAppointmentValues;
    public submitted: boolean;
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<SchedulerComponent, any>, private formBuilder: FormBuilder,
        private persistanceService: PersistanceService, private validationUtilService: ValidationUtilsService
    ) {
        this.minDate = new Date();
        this.maxDate = new Date();
        this.maxDate.setFullYear(this.maxDate.getFullYear() + 100);
        this.showAlert = false;
        this.createForm();
        this.initStaticList();
    }
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    // ngAfterViewInit() {
    //     this.eventSubscription = fromEvent(this.dateOfAppointment.nativeElement, 'input').subscribe(_ => {
    //         this.datepickerInput._onInput(this.dateOfAppointment.nativeElement.value);
    //     });
    // }

    createForm() {
        try {

            var validationValues = require('../../../../../assets/validators/journey/validation-values.json');
            this.scheduleAppointmentValues = validationValues.application.scheduleAppointment;
            this.schedularForm = this.formBuilder.group({
                'meetingDate': [null, Validators.compose(this.validationUtilService.composeValidators(this.scheduleAppointmentValues.meetingDate))],
                'hour': [null, Validators.compose(this.validationUtilService.composeValidators(this.scheduleAppointmentValues.hour))],
                'minute': [null, Validators.compose(this.validationUtilService.composeValidators(this.scheduleAppointmentValues.minute))]
            })
            this.formControls = this.schedularForm.controls;
            this.validationUtilService.blockInvalidInput(this.schedularForm, this.scheduleAppointmentValues);
        }
        catch (exception) {
            console.log(exception.message)
        }
    };

    initStaticList() {
        try {
            this.hourList = this.persistanceService.getHourList();
            this.minuteList = this.persistanceService.getMinuteList();
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getHourList() {
        try {
            var hourList = [];
            for (var i = 9; i <= 16; i++) {
                hourList.push("" + i + "");
            }
            return hourList;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    getMinuteList() {
        try {
            var minuteList = [];
            for (var i = 0; i <= 59; i++) {
                minuteList.push("" + i + "");
            }
            return minuteList;
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    formatDate(value) {
        return (value < 10 ? '0' + value : value);
    }


    confirmOrNot(confirmation): void {
        try {
            if (this.schedularForm.valid) {
                const appData = this.persistanceService.getFromJourneyStorage();

                let date = this.schedularForm.value.meetingDate.getFullYear() + '-' + this.formatDate(this.schedularForm.value.meetingDate.getMonth() + 1) + '-' + this.formatDate(this.schedularForm.value.meetingDate.getDate());
                let arn = (appData && appData.arn) ? appData.arn : null;
                let branchCode = (appData && appData.branchCode) ? appData.branchCode : null;


                let appointmentObject = {
                    "appointmentDate": date ? date : null,
                    "arn": arn ? arn : null,
                    "branchCode": branchCode ? branchCode : null,
                    "hour": this.schedularForm.value.hour ? this.schedularForm.value.hour : null,
                    "time": this.schedularForm.value.minute ? this.schedularForm.value.minute : null
                }

                this.persistanceService.scheduleAppointment(appointmentObject).subscribe((response) => {
                    if ((response && response.success && response !== undefined) && (response.data === 0 || response.data === 1)) {
                        this.dialogRef.close(response.data);
                    } else {
                        const alertObj = {
                            type: 'error',
                            message: 'Some error occured, please contact support',
                            showAlert: true,
                            stackTrace: {}
                        }
                        this.showAlert = true;
                        window.scroll(0, 0);
                        this.alert = alertObj;
                    }
                }, error => {
                    var alertObj = {
                        type: "error",
                        message: 'Some error occured, please contact support',
                        showAlert: true,
                        stackTrace: {}
                    }
                    this.showAlert = true;
                    this.alert = alertObj;
                    window.scroll(0, 0);
                })
            } else {
                this.submitted = true;
                this.validationUtilService.markFormGroupTouched(this.schedularForm);
            }
        }
        catch (exception) {
            console.log(exception.message)
        }
    }

    closeError() {
        this.showAlert = false;
        this.alert = {};
    }


    onNoClick(): void {
        try { this.dialogRef.close('N'); }
        catch (exception) {
            console.log(exception.message)
        }
    };

}
