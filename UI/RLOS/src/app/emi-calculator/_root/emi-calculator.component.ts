import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { EmiCalculatorService } from './emi-calculator.service';

@Component({
  selector: 'app-emi-calculator',
  templateUrl: './emi-calculator.component.html',
  styleUrls: ['./emi-calculator.component.scss']
})
export class EmiCalculatorComponent implements OnInit {
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
    loanAmountMax: null, loanAmountMin: null, loanAmountStep: null, interestRateMax: null, loanTermMax: null, loanTermMin: null, loanTermStep: null, interestRateMin: null, interestRateStep: null
  };

  constructor(private formBuilder: FormBuilder,
    private emiCalculatorService: EmiCalculatorService) { }

  ngOnInit() {
    this.createForm();
    this.initModel();
    this.getEMICalcData();
    this.calculateMonthlyPayment();
  }

  createForm() {
    this.emiCalculatorForm = this.formBuilder.group({
      'loanAmount': [null],
      'loanTenure': [null],
      'interestRate': [null],
      'estimatedMonthlyPayment': [null],
    })
    this.formControls = this.emiCalculatorForm.controls;
  }

  initModel() {
    this.emiCalculatorForm.patchValue(this.model);
  }

  changeInputField(state) {
    this.model[state] = this.emiCalculatorForm.get(state).value;
    this.calculateMonthlyPayment();
  }

  changeSlider(state) {
    this.emiCalculatorForm.get(state).setValue(this.model[state]);
    this.calculateMonthlyPayment();
  }

  calculateMonthlyPayment() {
    var monthlyInterestRatio = (this.model.interestRate / 100) / 12;
    var top = Math.pow((1 + monthlyInterestRatio), this.model.loanTenure);
    var bottom = top - 1;
    var sp = top / bottom;
    var emi = ((this.model.loanAmount * monthlyInterestRatio) * sp);
    this.model.estimatedMonthlyPayment = parseFloat(emi.toFixed(2));
    var totalPayment = this.model.loanTenure * emi;
    this.model.totalPayment = parseFloat(totalPayment.toFixed(2));
    var totalInterestPayable = this.model.totalPayment - this.model.loanAmount;
    this.model.totalInterestPayable = parseFloat(totalInterestPayable.toFixed(2));
  }

  formatLabel(value: number | null) {
    if (!value) {
      return 0;
    }
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  getEMICalcData() {
    this.emiCalculatorService.getEMICalcData().subscribe(emiCalcData => {
      this.emiCalcData = emiCalcData;
    }, error => {
      var alertObj = {
        type: "error",
        message: error.message,
        showAlert: true,
        stackTrace: {}
      }
      this.alert = alertObj;
    });;
  }
}
