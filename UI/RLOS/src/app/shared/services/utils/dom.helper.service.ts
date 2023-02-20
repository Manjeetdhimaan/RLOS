import { Injectable } from '@angular/core';

@Injectable()
export class DOMHelperService {

  constructor() {
  }

  focusOnInvalid(renderer, formName) {
    var elems = renderer.selectRootElement(document.querySelectorAll(this.getInvalidFieldsSelector(formName)));
    if (elems && elems.length > 0) {
      elems[0].focus();
    }
  }

  getInvalidFieldsSelector(formName) {
    return '[name="' + formName + '"] mat-form-field.ng-invalid input, [name="' + formName + '"] mat-radio-group.ng-invalid input, [name="' + formName + '"] mat-checkbox.ng-invalid input, [name="' + formName + '"] mat-select.ng-invalid';
  }

  formatDate(value) {
    return (value < 10 ? '0' + value : value);
  }

  getDateFormat(date) {
    if (typeof date === 'object') {
      return (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
    } else {
      return date;
    }
  }

  markAsTouched(elementRef) {
    var elems = elementRef.nativeElement.querySelectorAll('.ng-invalid');
    if (elems[0].tagName === "FORM") {
      for (let i = 0; i < elems.length; i++) {
        if (elems[i].hasAttribute('formControlName')) {
          elems[i].setTouched();
        }
      }
    } else {
      elems[0].setTouched();
    }

  }

  moveToInvalidField(elementRef) {
    var elems = elementRef.nativeElement.querySelectorAll('.ng-invalid');
    if (elems[0].tagName === "FORM") {
      // for (let i = 0; i < elems.length; i++) {
      //   elems[i].setTouched();
      // }
      for (let i = 0; i < elems.length; i++) {
        if (elems[i].hasAttribute('formControlName')) {
          elems[i].focus();
          break;
        }
      }
    } else {
      elems[0].focus();
    }
  }
  moveToInvalidCheckBoxField(elementRef) {
    const elems = elementRef.nativeElement.querySelectorAll('.ng-invalid');
    if (elems[0].tagName === 'FORM') {
      for (let i = 0; i < elems.length; i++) {
        if (elems[i].hasAttribute('formControlName')) {
          elems[i].firstChild.focus();
          break;
        }
      }
    } else {
      elems[0].focus();
    }
  }
  isEmpty(val) {
    // test results
    //---------------
    // []        true, empty array
    // {}        true, empty object
    // null      true
    // undefined true
    // ""        true, empty string
    // ''        true, empty string
    // 0         false, number
    // true      false, boolean
    // false     false, boolean
    // Date      false
    // function  false

    if (val === undefined)
      return true;

    if (typeof (val) == 'function' || typeof (val) == 'number' || typeof (val) == 'boolean' || Object.prototype.toString.call(val) === '[object Date]')
      return false;

    if (val == null || val.length === 0 || (typeof (val) == 'string' && val.trim() === "")) // null or 0 length array
      return true;

    if (typeof (val) == "object") {
      // empty object
      var r = true;
      for (var f in val)
        r = false;
      return r;
    }
    return false;
  };

  isNestedObject(formControlObject) {
    switch (formControlObject) {
      case "currentAddress":
        return true;
      case "mailingAddress":
        return true;
      case "previousAddress":
        return true;
    }
    return false;
  }

  /*
    validateAllFormFields(formGroup: FormGroup) {         //{1}
      Object.keys(formGroup.controls).forEach(field => {  //{2}
        let control = formGroup.get(field);             //{3}
        if (control instanceof FormControl && control.invalid) {
          //control.focus();
          //control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {        //{5}
          this.validateAllFormFields(control);            //{6}
        }
      });
    }
  */
  /*
     Returns an array of invalid control/group names, or a zero-length array if
     no invalid controls/groups where found
  */
  /*
    findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
      var invalidControls: string[] = [];
      let recursiveFunc = (form: FormGroup | FormArray) => {
        Object.keys(form.controls).forEach(field => {

          const control = form.get(field);

          if (control instanceof FormGroup) {
            recursiveFunc(control);
          } else if (control instanceof FormArray) {
            recursiveFunc(control);
          }
          else if (control.invalid) {
            let ctrl =  control as FormControl;
            ctrl.focus();
            return false;
            //invalidControls.push(field);
          }


        });
      }
      recursiveFunc(formToInvestigate);
      return invalidControls;
    }
  */
}

