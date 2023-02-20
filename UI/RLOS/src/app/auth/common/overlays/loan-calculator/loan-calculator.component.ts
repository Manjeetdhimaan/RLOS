import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
@Component({
  selector: 'app-loan-calculator',
  templateUrl: './loan-calculator.component.html',
  styleUrls: ['./loan-calculator.component.scss']
})
export class LoanCalculatorDialog {
  submitted: boolean;
  private formControls;
  emiCalculatorForm: FormGroup;
  model = {
    'loanAmount': 60000,
    'loanTenure': 12,
    'interestRate': 10.5,
    'estimatedMonthlyPayment': 0,
    'totalInterestPayable': 0,
    'totalPayment': 0
  };
  alert = {};
  value = 0;
  emiCalcData = {
    loanAmountMax: null,
    loanAmountMin: null,
    loanAmountStep: null,
    interestRateMax: null,
    loanTermMax: null,
    loanTermMin: null,
    loanTermStep: null,
    interestRateMin: null,
    interestRateStep: null
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,private readonly formBuilder: FormBuilder, public dialogRef: MatDialogRef<LoanCalculatorDialog, any>
  ) {
  }

  ngOnInit() {
    try {
      this.createForm();
      this.initModel();
      this.calculateMonthlyPayment();
    } catch (exception) {
      console.log("Exception occured in emi-calculator.component.ts : ngOnInit : ", exception.message)
    }
  }
  createForm() {
    try {
      this.emiCalculatorForm = this.formBuilder.group({
        'loanAmount': [null],
        'loanTenure': [null],
        'interestRate': [null],
        'estimatedMonthlyPayment': [null],
      });
      this.formControls = this.emiCalculatorForm.controls;
    } catch (exception) {
      console.log("Exception occured in emi-calculator.component.ts : createForm : ", exception.message)
    }
  }

  initModel() {
    try {
      this.emiCalculatorForm.patchValue(this.model);
    } catch (exception) {
      console.log("Exception occured in emi-calculator.component.ts : initModel : ", exception.message)
    }
  }

  changeInputField(state) {
    try {
      this.model[state] = this.emiCalculatorForm.get(state).value;
      this.calculateMonthlyPayment();
    } catch (exception) {
      console.log("Exception occured in emi-calculator.component.ts : changeInputField : ", exception.message)
    }
  }

  changeSlider(state) {
    try {
      this.emiCalculatorForm.get(state).setValue(this.model[state]);
      this.calculateMonthlyPayment();
    } catch (exception) {
      console.log("Exception occured in emi-calculator.component.ts : changeSlider : ", exception.message)
    }
  }

  calculateMonthlyPayment() {
    try {
      const monthlyInterestRatio = (this.model.interestRate / 100) / 12;
      const top = Math.pow((1 + monthlyInterestRatio), this.model.loanTenure);
      const bottom = top - 1;
      const sp = top / bottom;
      const emi = ((this.model.loanAmount * monthlyInterestRatio) * sp);
      this.model.estimatedMonthlyPayment = parseFloat(emi.toFixed(2));
      const totalPayment = this.model.loanTenure * emi;
      this.model.totalPayment = parseFloat(totalPayment.toFixed(2));
      const totalInterestPayable = this.model.totalPayment - this.model.loanAmount;
      this.model.totalInterestPayable = parseFloat(totalInterestPayable.toFixed(2));
    } catch (exception) {
      console.log("Exception occured in emi-calculator.component.ts : calculateMonthlyPayment : ", exception.message)
    }
  }

  formatLabel(value: number | null) {
    try {
      if (!value) {
        return 0;
      }
      if (value >= 1000) {
        return Math.round(value / 1000) + 'k';
      }
      return value;
    } catch (exception) {
      console.log("Exception occured in emi-calculator.component.ts : formatLabel : ", exception.message)
    }
  }

  resumeApplication(): void {
    this.dialogRef.close('Resume');
  };

  onNoClick() {
    this.dialogRef.close();
  }


  resetApplication(): void {
    this.dialogRef.close('Reset');
  };

}
