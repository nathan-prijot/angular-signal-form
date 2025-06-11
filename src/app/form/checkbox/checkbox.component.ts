import { Component, input } from '@angular/core';
import {
  SignalFormControl,
  SignalFormControlDirective,
} from '../../../signal-form';
import { ErrorMessagePipe } from '../error-message.pipe';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  imports: [SignalFormControlDirective, ErrorMessagePipe],
})
export class CheckboxComponent {
  readonly inputId = input.required<string>();
  readonly label = input.required<string>();
  readonly control = input.required<SignalFormControl>();
}
