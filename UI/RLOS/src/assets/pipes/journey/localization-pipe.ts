import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | Localization:exponent
 * Example:
 *   {{ 2 | Localization:10 }}
 *   formats to: 1024
*/
@Pipe({ name: 'translateValidation' })
export class LocalizationPipe implements PipeTransform {
    translatedValue;
    constructor(private translate: TranslateService) {

    }

    transform(value: string, constraint: any): string {
        let path = value + "." + constraint.type;
        this.translate.get(path, { value: constraint.value }).subscribe((text: string) => {
            this.translatedValue = text;
        });
        return this.translatedValue;
    }
}