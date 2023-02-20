import { Component, ViewEncapsulation, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from './../../../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { PersistanceService } from '../../../../core/services';
import { DOMHelperService } from '../../../../shared';

@Component({
    selector: 'experian-dialog',
    templateUrl: './experian-dialog.component.html',
    styleUrls: ['./experian-dialog.component.scss']
})
export class ExperianDialog {
    step = 0;
    formControls;
    experianForm: FormGroup;
    sessionID;
    questions = [];
    questionObject;
    alert = {};
    submitted;
    firstPage;
    secondPage;
    name;
    refNumber;
    constructor(
        public dialogRef: MatDialogRef<ExperianDialog, any>, private persistenceService: PersistanceService, private _dom: DOMHelperService,
        private formBuilder: FormBuilder, private authService: AuthService, private _elementRef: ElementRef,
        @Inject(MAT_DIALOG_DATA) public modalData) {
        this.firstPage = true;
        this.secondPage = false;
        if (this.modalData.personalForm.applicants[0].middleName)
            this.name = this.modalData.personalForm.applicants[0].firstName + " " + this.modalData.personalForm.applicants[0].middleName + " " + this.modalData.personalForm.applicants[0].lastName
        else
            this.name = this.modalData.personalForm.applicants[0].firstName + " " + this.modalData.personalForm.applicants[0].lastName;

        this.questionObject = this.modalData.questions;
        this.refNumber = this.modalData.refNumber;
    }

    close() {
        this.dialogRef.close("N");
    }

    initModel() {
        this.experianForm = this.formBuilder.group({});

        var i = 1;
        let that = this;
        Object.keys(that.questionObject).forEach(function (key) {
            if (key.toLowerCase().indexOf("question") > -1) {
                if (that.questionObject[key]) {
                    that.questions.push({
                        "question": that.questionObject[key],
                        "options": [],
                        "order": i
                    });
                    i++;
                }
            }
        });

        that.questions.forEach((obj, index) => {
            Object.keys(that.questionObject).forEach(function (key) {
                if (key.toLowerCase().indexOf("option" + (index + 1)) > -1) {
                    obj.options.push(that.questionObject[key]);
                }
            });
        });

        for (let j = 1; j <= that.questions.length; j++) {
            that.experianForm.addControl('Answer' + j, that.formBuilder.control('', Validators.required));
        }
        
        this.formControls = this.experianForm.controls;

        that.sessionID = that.questionObject['sessionID'];
        that.firstPage = false;
        that.secondPage = true;

    }

    continue(event?) {
        if (this.experianForm.valid) {
            let expValues = this.experianForm.value;
            expValues.SessionID = this.sessionID;
            let request = {
                expValues: expValues,
                refNumber: this.refNumber
            }
            this.dialogRef.close(request);
        }
        else {
            this.submitted = true;

            var elems = this._elementRef.nativeElement.querySelectorAll('.ng-invalid');
            if (elems[0].tagName === "FORM") {
                for (let i = 0; i < elems.length; i++) {
                    if (elems[i].hasAttribute('matInput')) {
                        elems[i].focus();
                        break;
                    }
                }
            } else {
                elems[0].focus();
            }
        }
    }

    print() {
        window.print();
    }

    clickHere() {
        this.initModel();
    }
}