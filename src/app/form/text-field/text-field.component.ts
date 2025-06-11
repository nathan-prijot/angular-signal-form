import { Component, input } from '@angular/core';
import {
  SignalFormControl,
  SignalFormControlDirective,
} from '../../../signal-form';
import { ErrorMessagePipe } from '../error-message.pipe';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  imports: [SignalFormControlDirective, ErrorMessagePipe],
})
export class TextFieldComponent {
  readonly inputId = input.required<string>();
  readonly label = input<string>();
  readonly control = input.required<SignalFormControl>();
}
