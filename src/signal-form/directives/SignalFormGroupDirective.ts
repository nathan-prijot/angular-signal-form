import { Directive, forwardRef, input } from '@angular/core';
import { SignalFormGroup } from '../controls';
import { NgSignalFormGroup } from './NgSignalFormGroup';

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
