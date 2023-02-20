import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { CustomerAcceptanceService } from './../_root/customer-acceptance.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  model;
  notSpecified;
  constructor(private _router: Router, private customerAcceptanceService: CustomerAcceptanceService) { }

  ngOnInit() {
    window.scroll(0, 0);
    this.notSpecified = "Not Specified";
    this.model = {
      "loanSubType": null,
      "loanAmount": null,
      "interestRate": null,
      "monthlyPayment": null,
      "loanTerms": null
    }
  }

  ngAfterViewInit() {
    this.customerAcceptanceService.getLoanData().subscribe((response) => {
      this.model = response;
      this.model.interestRate = (this.model.interestRate) ? this.model.interestRate + ' %' : this.model.interestRate
    })
  }

  setDropDownData(appData) {
    if (appData.collateralDetails) {
      this.customerAcceptanceService.getLoanProductType().forEach((element) => {
        if (element.code === appData.collateralDetails.loanProductType) {
          appData.collateralDetails.loanProductType = element.label;
        }
      });
    }
    return appData;
  }

  continueToAccept() {
    this._router.navigate(['customer-acceptance/accept']);
  }

  continueToDecline() {
    // let navigationExtras: NavigationExtras = {
    //   queryParams: { 'status': 'decline' }
    // };
    // this._router.navigate(['customer-acceptance/complete'], navigationExtras);

    this.customerAcceptanceService.submitCustomerAcceptance({}, "NOT_ACCEPT").subscribe((response) => {
      let navigationExtras: NavigationExtras = {
        queryParams: { 'status': 'decline' }
      };
      this._router.navigate(['customer-acceptance/complete'], navigationExtras);
    })
  }

}
