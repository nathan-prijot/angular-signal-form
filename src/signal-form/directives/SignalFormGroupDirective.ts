import { Directive, forwardRef, input } from '@angular/core';
import { NgSignalFormGroup } from './NgSignalFormGroup';
import { SignalFormGroup } from '../controls/SignalFormGroup';

@Directive({
  selector: '[signalFormGroup]',
  providers: [
    {
      provide: NgSignalFormGroup,
      useExisting: forwardRef(() => SignalFormGroupDirective),
    },
  ],
})
export class SignalFormGroupDirective extends NgSignalFormGroup {
  readonly signalFormGroup = input.required<SignalFormGroup>();
}
