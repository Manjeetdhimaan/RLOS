import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[inputType]'
})
export class InputTypeDirective {
    @Input('inputType') inputType: any;
    // Allow decimal numbers and negative values
    regex: any;
    // var regex = /^[0-9]*(?:\.\d{1,2})?$/; 
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight'];

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        let regex = this.getRegex(this.inputType);
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        let current: string = this.el.nativeElement.value;
        let next: string = current.concat(event.key);
        if (!regex.test(next)) {
            event.preventDefault();
        }
    }

    getRegex(inputType) {
        let regex;
        switch (inputType) {
            case 'number':
                regex = /^[0-9]*(?:\.\d{1,2})?$/;
                break;
            case 'ssn':
                regex = /^[0-9-]*$/;
                break;
            case 'phonenumber':
                regex = /^[1-9(][0-9)-]*$/;
                break;
            case 'alpha-space':
                regex = /^[a-zA-Z ]*$/;
                break;
            case 'amount':
                regex = /^[1-9][0-9]*$/;
                break;
            default:
                regex = /^[0-9]*(?:\.\d{1,2})?$/;
                break;
        }
        return regex;
    }
}