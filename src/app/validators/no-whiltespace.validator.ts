import { AbstractControl, ValidationErrors } from "@angular/forms";

export function noWhiteSpaceValidator(control: AbstractControl):ValidationErrors | null {
    const isWhiteSpace =  (control.value || '').trim().length === 0;
    return isWhiteSpace ? {'whitespace': true} : null;
}