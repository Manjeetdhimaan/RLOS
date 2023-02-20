import { Component, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PersistanceService } from './../../core/services/persistence.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../auth.service';
import { DOMHelperService } from 'src/app/shared';
import { SecurityOverlay } from '../status/overlay/security-dialog.component';



@Component({
  selector: 'app-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})

export class SecurityQuestionComponent implements OnInit {
  resumeForm: FormGroup;
  private formControls;
  submitted;
  // appType: any;
  appStatus: any;
  arnNumber: any;
  constructor(private dom: DOMHelperService,private formBuilder: FormBuilder,private persistenceService: PersistanceService, private _route: Router, public dialog: MatDialog, private authservice:AuthService) {
  }

  ngOnInit() {
    this.createForm();
  }
  createForm(){
    this.resumeForm = this.formBuilder.group({
      //'isMeetingRequirements': [null, Validators.requiredTrue],
      'number': [null, Validators.required],
      'houseno': [null, Validators.required],
      // 'isMVMember': [null],
      'city': [null, Validators.required],
      
      // 'politicallyExposedPosition': [null],
      // 'panNumber': [null]
      // 'applyMembership': [null, Validators.required]
  })
  this.formControls = this.resumeForm.controls;
  // this.appType = this.data.appType;
  // this.appStatus = this.data.appStatus;
  // this.arnNumber = this.data.arnNumber;
  this.setValidations();
  }
  setValidations() {
    var number = this.resumeForm.controls['number'];
    var houseno = this.resumeForm.controls['houseno'];
    var city = this.resumeForm.controls['city'];
    

   
    number.updateValueAndValidity({ emitEvent: false });
    houseno.updateValueAndValidity({ emitEvent: false });
    city.updateValueAndValidity({ emitEvent: false });
   
}
//   confirmOrNot(confirmation): void {
//     if (this.resumeForm.valid) {
//       var securityQues = this.securityQuesObject();
//         this.dialogRef.close({ confirmation: confirmation , securityQues: securityQues,appStatus: this.appStatus, arnNumber: this.arnNumber});
//     }
//     else {
//         this.submitted = true;
//     }
// }

continue(){
  this._route.navigate(['/auth/dashboard']);
}

// openDialog( arnNumber, appStatus){
  openDialog( arnNumber, appStatus){
  let that = this;
  const dialogRef = that.dialog.open(SecurityOverlay, {
    width: '60vw',
    disableClose: true,
    data: {arnNumber: arnNumber, appStatus: appStatus},
    autoFocus: false
  });
}
securityQuesObject()
{
   var securityQues = {};
   securityQues={
    number: this.resumeForm.value.number,
    houseno: this.resumeForm.value.houseno,
    city: this.resumeForm.value.city
   }
   return securityQues;
}
 
}
