import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
@Component({
    selector: 'app-loan-product',
    templateUrl: './loan-product.component.html',
    styleUrls: ['./loan-product.component.scss']
})
export class LoanProductOverlay implements OnInit {
    productForm: FormGroup;
    private formControls;
    classic_card: boolean = false;
    gold_card: boolean = false;
    loan;
    submitted;
    loanTypeList;
    _loanTypeList;
    purposeTypeList;
    loanPurposeList;
    buyTypeList;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<LoanProductOverlay, any>, private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.productForm = this.formBuilder.group({
            'rateType': null,
            'mortgageType': null,
            'loanType': null,
            "buyType": null,
            "purposeType": null
            // "previousAddresses": this.formBuilder.array([this.createItem()])
        })
        this.formControls = this.productForm.controls;
        this.loan = this.data.loan;
        this.loanTypeList = this.data.mdm.loanTypeList.filter((loanType) => {
            return loanType.code != 'TP'
        });
        this._loanTypeList = this.data.mdm.loanTypeList;
        this.loanPurposeList = ["Cash Crunch", "Renovation", "Other", "Line of Credit"];
        this.buyTypeList = this.data.mdm.buyTypeList;
        this.purposeTypeList = this.data.mdm.purposeTypeList;
        // this.setValidations();
    }

    setValidations() {
        var rateType = this.productForm.controls['rateType'];
        var mortgageType = this.productForm.controls['mortgageType'];
        var loanType = this.productForm.controls['loanType'];
        var buyType = this.productForm.controls['buyType'];
        var purposeType = this.productForm.controls['purposeType'];
        rateType.clearValidators();
        mortgageType.clearValidators();
        loanType.clearValidators();
        buyType.clearValidators();
        switch (this.loan.type) {
            case 'auto':
                //rateType.setValidators(Validators.required);
                //buyType.setValidators(Validators.required);
                break;
            case 'mortgage':
                //rateType.setValidators(Validators.required);
                //mortgageType.setValidators(Validators.required);
                break;
            case 'debt_consolidation':
            case 'credit_cards':
            case 'home_equity':
            case 'overdraft':
                break;
            case 'personal':
                //rateType.setValidators(Validators.required);
                purposeType.setValidators(Validators.required);
                break;
        }
        rateType.updateValueAndValidity({ emitEvent: false });
        mortgageType.updateValueAndValidity({ emitEvent: false });
        loanType.updateValueAndValidity({ emitEvent: false });
        buyType.updateValueAndValidity({ emitEvent: false });
    }

    confirmOrNot(confirmation): void {
        if (this.productForm.valid) {
            var product = this.createProductObject();
            this.dialogRef.close({ confirmation: confirmation, product: product });
        }
        else {
            this.submitted = true;
        }
    }

    createProductObject() {
        var product = {};
        switch (this.loan.type) {
            case 'personal':
                product = {
                    loanProduct: "PL"
                }
                break;
            case 'auto':
                product = {
                    loanProduct: "AL"
                }
                break;
            case 'home_equity':
                product = {
                    loanProduct: "HEL"
                }
                break;
            case 'overdraft':
                product = {
                    loanProduct: "OVF"
                }
                break;
            case 'mortgage':
                product = {
                    loanProduct: "RM"
                }
                break;
            case 'debt_consolidation':
                product = {
                    loanProduct: "DC"
                }
                break;
            case 'credit_cards':
                product = {
                    loanProduct: "CC"
                }
                break;
        }

        return product;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    selectLoan(value) {
        if (value === 'gold_card') {
            this.classic_card = true;
        }
        else
            this.gold_card = true;
    }
}