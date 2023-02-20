import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[limit]'
})
export class LimitDirective {
     private specialKeys: Array<string> = ['Control', 'Backspace', 'Tab', 'End', 'Home', '-'];
    @Input('limit') maxlength:any;   
    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', ['$event'])

    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        let maxlength = parseInt(this.maxlength);
        if (maxlength===this.el.nativeElement.value.length) {
            event.preventDefault();
        }
    }
}