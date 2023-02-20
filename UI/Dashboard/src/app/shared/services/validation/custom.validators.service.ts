import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable()
export class CustomValidatorsService {
  constructor() { }


  composeCustomValidators(validations) {

    let validators: any = [];
    if (validations) {
      let that = this;
      validations.forEach(function (validation) {
        switch (validation.type) {
          case 'numberRange':
            validators.push(that.numberRangeValidator(validation.minValue, validation.maxValue));
            break;
        }
      });
    }
    return validators;
  }

  numberRangeValidator(min: number, max: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
        return { 'numberRange': true };
      }
      return null;
    };
  }

}