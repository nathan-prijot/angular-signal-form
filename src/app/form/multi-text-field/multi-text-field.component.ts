import { Component, input } from '@angular/core';
import { SignalFormArray } from '../../../signal-form/SignalFormArray';
import { SignalFormControl } from '../../../signal-form/SignalFormControl';
import { SignalValidators } from '../../../signal-form/SignalValidators';
import { TextFieldComponent } from "../text-field/text-field.component";

@Component({
  selector: 'app-multi-text-field',
  templateUrl: './multi-text-field.component.html',
  imports: [TextFieldComponent],
})
export class MultiTextFieldComponent {
  readonly inputId = input.required<string>();
  readonly label = input<string>();
  readonly control =
    input.required<SignalFormArray<SignalFormControl<string>>>();

  addLine(): void {
    this.control().push(
      new SignalFormControl<string>('', {
        validators: [SignalValidators.required, SignalValidators.minLength(2)],
      })
    );
  }

  removeLine(index: number): void {
    this.control().removeAt(index);
  }
}
