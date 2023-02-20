import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
// import { PersistanceService } from '../core/services';
import { MatDialog, MatDialogRef , MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { LoanProductOverlay } from './overlay/loan-product.component';
import { ProductService } from './product.service';
import { DOMHelperService } from 'src/app/shared';
import { AuthService } from 'src/app/auth/auth.service';
import { PersistanceService } from 'src/app/core/services';
import { JourneyService } from './../_root/journey.service';
// import { DOMHelperService } from '../shared';
// import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  showAlert;
  stateList;
  collateralTypeList;
  loanProductList;
  alert: {};

  constructor(private _router: Router, private translate: TranslateService, private persistenceService: PersistanceService, public dialog: MatDialog,
    private productService: ProductService, private dom: DOMHelperService, private authService: AuthService, private journeyService: JourneyService) {
    translate.setDefaultLang('en');
    this.showAlert = false;
  }

  ngOnInit() {
    // this.persistenceService.removeAllConfigData();
    // let appData = this.persistanceService.getFromJourneyStorage();
    // if (appData && appData.arn)
    //   this._router.navigate(['/auth/resume']);
    // else
    //   this._router.navigate(['/auth/home']);
    const self = this;
    if (this.dom.isEmpty(self.authService.getLookupFromStorage())) {
      self.authService.getLookupData('RLOS')
        .subscribe(resp => {
          self.stateList = self.authService.getState();
          self.collateralTypeList = self.authService.getCollateralType();
          self.loanProductList = self.authService.getLoanProduct();
          self.authService.setLookupInStorage(resp);
        }, error => {
          const alertObj = {
            type: 'error',
            message: 'Some error occured, please contact support',
            showAlert: true,
            stackTrace: {}
          };
          self.showAlert = true;
          window.scroll(0, 0);
          self.alert = alertObj;
        });
    }
  }

  selectLoan(value) {
    var loan = {};
    switch (value) {
      case 'personal':
        loan = {
          title: "Personal Loan",
          type: value,
          // message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          //benefits: ["The interest rate will not increase during your loan tenure", "Minimal documentation and hassle-free application makes loan approval and disbursement a breeze", "Choose your tenure from 12 to 60 months"],
          funds: ["Purchase vacant land", "Take a Vacation"],
          terms: ["Low down payment", "Competitive interest rates tied to CB Prime rate", "Up to seven years to repay"],
          documents: ["Your passport for identification", "Your TRN", "Utility Bill to confirm your residential address", "A letter from your employer and your most recent salary slip", "Copies of recent bank statements (if you are a self-employed customer)"]
        }
        break;
      case 'mortgage':
        loan = {
          title: "Mortgage Loan",
          type: value,
          terms: ["Up to 95% financing for home purchase or home construction", "Up to 30 years to repay", "Up to 80% financing for vacant residential land purchase"],
          documents: ["Passport or voter’s card for identification", "Telephone, water, or electricity bill to confirm your residential address", "A letter from your employer and your most recent salary slip",
            "Copies of recent bank statements or a bank reference from your banker (if you are a self employed customer)", "An agreement for sale: if you are buying a property; this would be a letter from the person selling the property",
            "Approved construction plans along with a construction estimate if you plan to build. The estimate should show the costs for the various stages of construction.", "An appraisal of the property is required whether you are buying or building a home."]
          //message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          // benefits: ["Attractive floating and fixed interest rates options", "Higher Loan Eligibility", "Longer tenure and lower EMI", "Simplified documentation"]
        }
        break;
      case 'debt_consolidation':
        loan = {
          title: "Property Loan",
          type: value,
          // message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          // benefits: ["Seamless remittance to international institutes", "Collateral free loan up to 40 Thousand for select institutes/ courses", "Quick and hassle-free process for timely disbursement of loans", "Flexible repayment and tenure options to suit your requirement", "Competitive simple interest on your loan"]
          consolidation: ["Mortgage payments", "Credit Card debt", "Auto Loans", "Tuition Loans"],
          terms: ["Competitive interest rates", "Up to 7 years* to repay", "Salary deduction available", "Prepaid Visa Card", "Free Online Banking", "No payment for 30 days"]
        }
        break;
      case 'credit_cards':
        loan = {
          title: "Credit Cards",
          type: value,
          //message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          //benefits: ["Great rate", "Flexible repayment", "No fees, no service charges", "Quick approval"]
          classic_card: ["CB VISA Classic card is our basic credit card with a lower credit limit.", "Individuals with conservative spending habits but wanting the flexibility to make purchases when needed.", "Annual Rate:$5,000"],
          gold_card: ["CB VISA Gold card is our premium credit card with the highest credit limit.", "Individuals needing the benefits and convenience of having a higher credit limit.", "Annual Rate:$25,000"]
        }
        break;
      case 'home_equity':
        loan = {
          title: "Equity Loan",
          type: value,
          // message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          // benefits: ["Loan up to 100% of on road price", "Loan tenure up to 7 years", "Pre-approved and pre-qualified car loans for existing customers"]
          consideration: ["home renovations", "a child’s college tuition", "purchasing property", "a major medical emergency", "When you can comfortably meet the payments"],
          terms: ["Competitive interest rates", "Up to 25 years to repay"],
          documents: ["Passport or voter’s card for identification", "Telephone, water, or electricity bill to confirm your residential address", "A letter from your employer and your most recent salary slip",
            "Copies of recent bank statements or a bank reference from your banker (if you are a self-employed customer)", "A printout of your existing mortgage", "An invoice for the expense that you intend to fund"]
        }
        break;
      case 'auto':
        loan = {
          title: "Auto Loan",
          type: value,
          // message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          //benefits: ["Loan up to 100% of on road price", "Loan tenure up to 7 years", "Pre-approved and pre-qualified car loans for existing customers"]
          terms: ["15 down payment for new vehicles", "Competitive Interest Rates", "Up to 7 years* to repay for new vehicles"],
          documents: ["Passport or voter’s card for identification", "Telephone, water, or electricity bill to confirm your residential address", "A letter from your employer and your most recent salary slip",
            "Copies of recent bank statements or a bank reference from your banker (if you are a self-employed customer)", "An invoice for the cost of the vehicle"]
        }
        break;
      case 'overdraft':
        loan = {
          title: "Personal Overdraft ",
          type: value,
          //message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          //benefits: ["Loan up to 100% of on road price", "Loan tenure up to 7 years", "Pre-approved and pre-qualified car loans for existing customers"]
          criterias: ["a history of steady employment", "an excellent credit rating", "a fixed deposit with CB", "a chequing account with CB"],
          documents: ["Passport or voter’s card for identification", "Telephone, water, or electricity bill to confirm your residential address", "A letter from your employer and your most recent salary slip",
            "Copies of recent bank statements or a bank reference from your banker (if you are a new customer or self-employed)"]
        }
        break;
    }
    var mdm = {
      purposeTypeList: this.productService.getPurposeType(),
      loanTypeList: this.productService.getLoanType(),
      buyTypeList: this.productService.getBuyType()
    }
    this.openDialog(loan, mdm);
  }


  openDialog(loan, mdm) {
    let that = this;
    const dialogRef = that.dialog.open(LoanProductOverlay, {
      width: '100vw',
      disableClose: true,
      data: { loan: loan, mdm: mdm },
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.confirmation === "YES") {
        var appData = this.journeyService.getFromStorage() || { applicants: [{ type: 'PRIMARY' }] };
        appData.preferences = null;
        appData.loanDetails = {
          loanProduct: result.product.loanProduct,
          collateralTypeDetails: {
            loanProduct: result.product.loanProduct,
          }
        }
        that.persistenceService.setInStorage('APP', appData);
        that._router.navigate(['journey/pre-screen']);
      }
    });
  }
}