import { Directive, forwardRef, input } from '@angular/core';
import { SignalFormArray } from '../controls';
import { NgSignalFormArray } from './NgSignalFormArray';

@Directive({
  selector: '[signalFormArray]',
  providers: [
    {
      provide: NgSignalFormArray,
      useExisting: forwardRef(() => SignalFormArrayDirective),
    },
  ],
})
export class SignalFormArrayDirective extends NgSignalFormArray {
  readonly signalFormArray = input.required<SignalFormArray>();
}
