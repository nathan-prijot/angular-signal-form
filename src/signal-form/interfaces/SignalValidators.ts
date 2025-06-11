import { ValidationErrors } from '@angular/forms';
import { SignalAbstractControl } from '../controls/SignalAbstractControl';

export class SignalValidators {
  static required(control: SignalAbstractControl): ValidationErrors | null {
    const value = control.rawValue();
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    )
      return { required: true };
    return null;
  }

  static minLength(min: number) {
    return (control: SignalAbstractControl): ValidationErrors | null => {
      const value = control.rawValue();
      if (
        (typeof value === 'string' || Array.isArray(value)) &&
        value.length < min
      )
        return {
          minLength: { requiredLength: min, actualLength: value.length },
        };

      return null;
    };
  }

  static maxLength(max: number) {
    return (control: SignalAbstractControl): ValidationErrors | null => {
      const value = control.rawValue();
      if (
        (typeof value === 'string' || Array.isArray(value)) &&
        value.length > max
      )
        return {
          maxLength: { requiredLength: max, actualLength: value.length },
        };
      return null;
    };
  }
}
