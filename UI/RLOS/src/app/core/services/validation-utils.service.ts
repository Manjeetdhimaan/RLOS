import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormArrayName, ValidatorFn, AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationUtilsService {
  allowedValue;
  constructor() { }

  composeValidators(validations) {

    let validators: any = [];
    if (validations) {
      let that = this;
      validations.forEach(function (validation) {
        switch (validation.type) {
          case 'required': validators.push(Validators.required);
            break;
          case 'minlength': validators.push(Validators.minLength(validation.value));
            break;
          case 'maxlength': validators.push(Validators.maxLength(validation.value));
            break;
          case 'pattern': validators.push(Validators.pattern(validation.value));
            break;
          case 'block-pattern':
            break;
          // case 'numberRange':
          //   validators.push(that.numberRangeValidator(validation.minValue, validation.maxValue));
          //   break;
        }
      });
    }
    return validators;
  }

  public blockInvalidInput(group: FormGroup | FormArray, validationValues, suppValidationValues?): void {
    let that = this;
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.controls[key];
      let validationVal = validationValues;
      let suppValidationVal = suppValidationValues ? suppValidationValues : null;
      if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray) {
        that.blockInvalidInput(abstractControl, validationValues);
      } else {
        abstractControl.valueChanges.subscribe(function (value) {
          if (suppValidationVal) {
            that.resetInvalidValue(abstractControl, value, key, validationVal[key], suppValidationVal[key]);
          }
          else {
            that.resetInvalidValue(abstractControl, value, key, validationVal[key]);
          }
        });
      }
    });
  }

  resetInvalidValue(formControl, value, ctrlName, validationValues, suppValidationValues?) {
    if (validationValues) {
      if (validationValues.length > 0) {
        this.allowedValue = value;
        validationValues.forEach(element => {
          if (this.allowedValue && this.allowedValue.length > 0) {
            this.allowedValue = this.allowedValue.replace(/^\s+/, function (m) { return m.replace(/\s/g, ''); })
            switch (element.type) {
              case "maxlength":
                if (this.allowedValue.length > +element.value) {
                  formControl.patchValue(this.allowedValue.substr(0, +element.value), { emitEvent: false });
                }
                break;
              // case "pattern":
              //   if (!(new RegExp(element.value, 'gi')).test(this.allowedValue) && !((ctrlName === "email") || (ctrlName === "confirmEmail"))) {
              //     let invalidChars = this.getInvalidChars(element.name, this.allowedValue);
              //     invalidChars.forEach(invalidChar => {
              //       this.allowedValue = this.allowedValue.replace(invalidChar, '');
              //     });
              //     formControl.patchValue(this.allowedValue, { emitEvent: false });
              //   }
              //   else if (this.allowedValue === "") {
              //     formControl.patchValue(this.allowedValue, { emitEvent: false });
              //   }
              //   break;
              case "block-pattern":
                if (new RegExp(element.value, 'gi').test(this.allowedValue) && !((ctrlName === "email") || (ctrlName === "confirmEmail"))) {
                  let invalidChars = value.match(element.value, 'gi');
                  invalidChars.forEach(invalidChar => {
                    this.allowedValue = this.allowedValue.replace(invalidChar, '');
                  });
                  formControl.patchValue(this.allowedValue, { emitEvent: false });
                }
                else if (this.allowedValue === "") {
                  formControl.patchValue(this.allowedValue, { emitEvent: false });
                }
                break;
              case "required":
                formControl.patchValue(this.allowedValue, { emitEvent: false });
                break;
              case "minlength":
                formControl.patchValue(this.allowedValue, { emitEvent: false });
                break;
            }
          }
        });
      }
    }
    else if (suppValidationValues) {
      if (suppValidationValues.length > 0) {
        this.allowedValue = value;
        suppValidationValues.forEach(element => {
          if (this.allowedValue && this.allowedValue.length > 0) {
            this.allowedValue = this.allowedValue.replace(/^\s+/, function (m) { return m.replace(/\s/g, ''); })
            switch (element.type) {
              case "maxlength":
                if (this.allowedValue.length > +element.value) {
                  formControl.patchValue(this.allowedValue.substr(0, +element.value), { emitEvent: false });
                }
                break;
              // case "pattern":
              //   if (!(new RegExp(element.value, 'gi')).test(this.allowedValue) && !((ctrlName === "email") || (ctrlName === "confirmEmail"))) {
              //     let invalidChars = this.getInvalidChars(element.name, this.allowedValue);
              //     invalidChars.forEach(invalidChar => {
              //       this.allowedValue = this.allowedValue.replace(invalidChar, '');
              //     });
              //     formControl.patchValue(this.allowedValue, { emitEvent: false });
              //   }
              //   break;
              case "block-pattern":
                if (new RegExp(element.value, 'gi').test(this.allowedValue) && !((ctrlName === "email") || (ctrlName === "confirmEmail"))) {
                  let invalidChars = value.match(element.value, 'gi');
                  invalidChars.forEach(invalidChar => {
                    this.allowedValue = this.allowedValue.replace(invalidChar, '');
                  });
                  formControl.patchValue(this.allowedValue, { emitEvent: false });
                }
                else if (this.allowedValue === "") {
                  formControl.patchValue(this.allowedValue, { emitEvent: false });
                }
                break;
              case "required":
                formControl.patchValue(this.allowedValue, { emitEvent: false });
                break;
              case "minlength":
                formControl.patchValue(this.allowedValue, { emitEvent: false });
                break;
            }
          }
        });
      }
    }
  }

  // getInvalidChars(name, value) {
  //   let invalidChars = [];
  //   let invalidChar = [];
  //   switch (name) {
  //     case "number":
  //       invalidChar = value.match(/[^1-9]*|[^0-9]/g);
  //       if (invalidChar && invalidChar.length > 0) {
  //         invalidChars = invalidChar;
  //       }
  //       break;
  //     case "alpha":
  //       invalidChars = value.match(/[^a-zA-Z]/g);
  //       break;
  //     case "double":
  //       invalidChar = value.match(/[^1-9]*|[^0-9]\.{1}?[0-9]{0,2}/g);
  //       let arr = [];
  //       if (invalidChar && invalidChar.length > 0) {
  //         if (invalidChar.indexOf('.') > -1) {
  //           let flag = 0;
  //           for (let i = 0; i < invalidChar.length; i++) {
  //             if (invalidChar[i] === "." && flag < 1) {
  //               flag++;
  //               arr.push(invalidChar[i])
  //             }
  //             else if (invalidChar[i] !== ".") {
  //               arr.push(invalidChar[i])
  //             }
  //           }
  //         }
  //         else {
  //           arr = invalidChar;
  //         }
  //         invalidChars = arr;
  //       }
  //       break;
  //     case "alpha-numeric":
  //       invalidChars = value.match(/[^A-Za-z0-9]/g);
  //       break;
  //     case "alpha-numeric-name":
  //       invalidChar = value.match(/[^a-zA-Z0-9]*|[^a-zA-Z0-9']/g);
  //       if (invalidChar && invalidChar.length > 0) {
  //         invalidChars = invalidChar;
  //       }
  //       break;
  //     case "alpha-numeric-space":
  //       invalidChar = value.match(/[^a-zA-Z0-9]*|[^a-zA-Z0-9 ]/g);
  //       if (invalidChar && invalidChar.length > 0) {
  //         invalidChars = invalidChar;
  //       }
  //       break;
  //     case "alpha-space":
  //       invalidChar = value.match(/[^a-zA-Z]*|[^a-zA-Z ]/g);
  //       if (invalidChar && invalidChar.length > 0) {
  //         invalidChars = invalidChar;
  //       }
  //       break;
  //   }
  //   return invalidChars;
  // }

  markFormGroupTouched(formGroup: FormGroup) {    
    if (formGroup) {
      Object.keys(formGroup.controls).map(control => {
        formGroup.controls[control].markAsTouched();
        if (formGroup.controls[control]['controls']) {
          this.markFormGroupTouched(formGroup[control]);
        }
      });
    }

    // (<any>Object).values(formGroup.controls).forEach(control => {
    //   control.markAsTouched();

    //   if (control.controls) {
    //     this.markFormGroupTouched(control);
    //   }
    // });
  }

  markFormGroupUntouched(formGroup: FormGroup) {
    
    if (formGroup) {
      Object.keys(formGroup.controls).map(control => {
        formGroup.controls[control].markAsUntouched();
        if (formGroup.controls[control]['controls']) {
          this.markFormGroupUntouched(formGroup[control]);
        }
        else {
          formGroup[control].setErrors(null);
        }
      });
    }
    // (<any>Object).values(formGroup.controls).forEach(control => {
    //   control.markAsUntouched();
    //   if (control.controls) {
    //     this.markFormGroupUntouched(control);
    //   }
    //   else {
    //     control.setErrors(null);
    //   }
    // });
  }

  // numberRangeValidator(min: number, max: number): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: boolean } | null => {
  //     if (control.value !== undefined && (isNaN(control.value) || control.value < min || control.value > max)) {
  //       return { 'numberRange': true };
  //     }
  //     return null;
  //   };
  // }

}
