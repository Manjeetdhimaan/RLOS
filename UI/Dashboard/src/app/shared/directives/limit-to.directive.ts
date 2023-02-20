import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[limitTo]'
})
export class limitToDirective {
    private specialKeys: Array<string> = ['Control', 'Backspace', 'Tab', 'End', 'Home', '-'];
    @Input('limitTo') limitTo: any;

    constructor(private el: ElementRef) {
    }
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }
        let current: string = this.el.nativeElement.value;
        if (current.length >= this.limitTo) {
            event.preventDefault();
        }
    }
}