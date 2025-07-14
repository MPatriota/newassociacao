import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export function notBlankValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (control.value === null || control.value === undefined) {
      return null;
    }

    const isBlank = typeof control.value === 'string' && control.value.trim().length === 0;

    return isBlank ? { 'notBlank': true } : null;
  };
}

export function notBeforeToday(data: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    if (control.value === null || control.value === undefined) {
      return null;
    }

    const isBeforeToday = moment(control.value).isBefore(moment(data), "date");

    return isBeforeToday ? { 'beforeToday': true } : null;
  };
}
