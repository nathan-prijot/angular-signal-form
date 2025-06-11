import { ValidationErrors } from '@angular/forms';
import { SignalAbstractControl } from '../controls/SignalAbstractControl';

export interface SignalValidatorFn {
  (control: SignalAbstractControl): ValidationErrors | null;
}
