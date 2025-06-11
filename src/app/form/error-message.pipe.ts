import { Pipe, PipeTransform } from '@angular/core';
import { SignalValidationErrors } from '../../signal-form';

@Pipe({
  name: 'errorMessage',
})
export class ErrorMessagePipe implements PipeTransform {
  transform(validationErrors: SignalValidationErrors): string {
    if (typeof validationErrors['custom'] === 'string')
      return validationErrors['custom'];
    if (validationErrors['required']) return 'This field is required.';
    if (validationErrors['minLength'])
      return `Minimum length is ${validationErrors['minLength'].requiredLength}.`;
    if (validationErrors['maxLength'])
      return `Maximum length is ${validationErrors['maxLength'].requiredLength}.`;
    return 'Invalid input.';
  }
}
