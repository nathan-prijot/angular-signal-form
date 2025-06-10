import { SignalAbstractControl } from './SignalAbstractControl';
import { SignalValidationErrors } from './SignalValidationErrors';
import { Observable } from 'rxjs';

export interface SignalAsyncValidatorFn {
  (control: SignalAbstractControl):
    | Promise<SignalValidationErrors | null>
    | Observable<SignalValidationErrors | null>;
}
