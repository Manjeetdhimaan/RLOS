import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
declare var require: any;

@Injectable()
export class EnumsService {
    constructor() { }

    getYesNoList() {
        return ["Yes", "No"];
    }

    getIncomeTypesList() {
        return ["Wages, Salaries, Tips", "TaxableInterest/Dividend", "Military Income", "Social Security Benefits Child Support, Alimony or Separate Maintenance", "Retirement Income"];
    };

    getIncomeFrequencyList() {
        return ["Monthly", "Quarterly", "Half Yearly", "Annually"];
    };

    getAssetTypeList() {
        return ["Stocks and Bonds", "Retirement Accounts", "Cash (Checking,savings)"]
    };

    getFinanceTypeList() {
        return ['Purchase', 'Refinance', 'Pre-Approval'];
    }

    getLoanPurposeList() {
        return ['Debt Consolidation', 'Home Renovation', 'Life Events', 'Medical Expenses', 'Vacation/Travel'];
    }

    getSecurityTypeList() {
        return ['Secured', 'Unsecured'];
    }

    getCollateralTypeList() {
        return ['Life Insurance', 'Investment Accounts', 'Certificate of Deposit', 'Farm Equipment', 'Boat / JetSki'];
    }

    getPayOffTypeList() {
        return ['Internal', 'External'];
    }

    getConditionTypeList() {
        return ['New', 'Used'];
    }


    getTypeOfAccountList() {
        return ['Savings', 'Current'];
    }

    getPurposeTypeList() {
        return ['Lien', 'Private Sale', 'N/A'];
    }
    getBuyType() {
        return [
          {
            "code": "CAR",
            "label": "Car"
          },
          {
            "code": "RV",
            "label": "RV"
          },
          {
            "code": "TRUCK",
            "label": "Heavy Truck"
          }
        ];
      }
      getPurposeType()
      {
        return [
          {
              "code": "PVL",
              "label": "Purchase vacant land"
          },
          {
            "code": "TV",
            "label": "Take a Vacation"
          }
        ];
      }
    
      getLoanType() {
        return [
          {
            "code": "TL",
            "label": "Term Loan"
          },
          {
            "code": "LC",
            "label": "Line of Credit"
          },
          {
            "code": "TP",
            "label": "Top Up"
          },
        ];
      }

}
