import { Component, OnInit, NgModule } from '@angular/core';
// import { SchedularComponent } from 'src/app/journey/common/overlays/schedular/schedular.component';
import { SchedulerComponent } from 'src/app/shared/common/overlays/scheduler/scheduler.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOMHelperService, MessageService } from 'src/app/shared';
import { Router, NavigationExtras } from '@angular/router';
import { from, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { PersistanceService } from 'src/app/core/services';
import { filter, pluck } from 'rxjs/operators';
import { LoanCalculatorDialog } from '../../../../auth/common/overlays';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog, private _route: Router, private _dom: DOMHelperService, private messageService: MessageService,
    private persistanceService: PersistanceService, private _snackBar: MatSnackBar) { }

  workItemNumber$: Observable<string>;

  ngOnInit() {
    try {
      let appData = this.persistanceService.getFromStorage("APP");
      if (appData && appData.arn) {
        this.setMessage(appData.arn);
      }
      this.workItemNumber$ = this.persistanceService.storageChange$.pipe(
        filter(({ storageArea }) => storageArea === "sessionStorage"),
        filter(({ key }) => key === "JMMB.ARN"),
        pluck("value")
      );
    } catch (exception) {
      console.log(exception.message);
    }
  }

  //to set arn in session storage and detect change
  setMessage(value: string): void {
    try {
      this.persistanceService.setStorageItem({
        key: "JMMB.ARN",
        value,
        storageArea: "sessionStorage"
      });
    } catch (exception) {
      console.log(exception.message);
    }
  }

  resumeContinue() {
    this.goToLink(environment.DASHBOARD_URL);
  }

  goToLink(url: string) {
    window.open(url, "_blank");
  }

  openSchedular() {
    const dialogRefAppExist = this.dialog.open(SchedulerComponent, {
      width: '500px',
      disableClose: true
    })
    dialogRefAppExist.afterClosed().subscribe(result => {
      if (result === 0) {
        this.showSnackBar("Email for Appointment is sent successfully");
      } else if (result === 1) {
        this.showSnackBar("Your Appointment has already been scheduled with the bank");
      }
    });
  }

  showSnackBar(message) {
    this._snackBar.open(message, "Close", {
      data: '',
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
      panelClass: ['success-dialog']
    });
  }

//Added by Hemlata for Loan Calculator overlay on 14 Oct 2022
  openCalculator(){
    const dialogRefAppExist = this.dialog.open(LoanCalculatorDialog, {
       width: '50%'
    })
    try {
      dialogRefAppExist.afterClosed().subscribe(result => {
        // if (result === "Resume") {
        //   // this.persistanceService.setConfig({ state: { context: "JOURNEY" } })
        //   this._route.navigate(['auth/resume']);
        // }
        // else if (result === "Reset") {
        //   this.setFieldsValidity(this.personalForm, false);
        //   this.resetForm();
        // }
      });
    }
    catch (exception) {
      console.log(exception.message)
    }
  }

}
