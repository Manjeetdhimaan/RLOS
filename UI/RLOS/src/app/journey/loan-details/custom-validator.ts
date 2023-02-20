import { ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
    constructor() { }


    numberRangeValidator(min: number, max: number): ValidatorFn {
        return (control: AbstractControl): { [key: string]: boolean } | null => {
            if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
                return { 'numberRange': true };
            }
            return null;
        };
    }
}