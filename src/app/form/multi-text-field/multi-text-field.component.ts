import { Component, input } from '@angular/core';
import {
  SignalFormArray,
  SignalFormControl,
  SignalValidators,
} from '../../../signal-form';
import { TextFieldComponent } from '../text-field/text-field.component';

@Component({
  selector: 'app-multi-text-field',
  templateUrl: './multi-text-field.component.html',
  imports: [TextFieldComponent],
})
export class MultiTextFieldComponent {
  readonly inputId = input.required<string>();
  readonly label = input<string>();
  readonly control =
    input.required<SignalFormArray<SignalFormControl<string, number>>>();

  addLine(): void {
    this.control().push(
      new SignalFormControl<string, number>('', {
        validators: [SignalValidators.required, SignalValidators.minLength(2)],
        metadata: Math.random(),
      })
    );
  }

  removeLine(index: number): void {
    this.control().removeAt(index);
  }
}
