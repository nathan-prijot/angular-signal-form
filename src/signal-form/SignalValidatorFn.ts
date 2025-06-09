import { ValidationErrors } from '@angular/forms';
import { SignalAbstractControl } from './SignalAbstractControl';

export interface SignalValidatorFn {
  (control: SignalAbstractControl): ValidationErrors | null;
}
