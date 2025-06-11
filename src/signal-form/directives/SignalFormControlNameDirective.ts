import {
  computed,
  Directive,
  forwardRef,
  inject,
  input,
  Signal,
} from '@angular/core';
import { NgSignalFormControl } from './NgSignalFormControl';
import { NgSignalFormGroup } from './NgSignalFormGroup';
import { SignalFormControl } from '../controls/SignalFormControl';

@Directive({
  selector: '[signalFormControlName]',
  providers: [
    {
      provide: NgSignalFormControl,
      useExisting: forwardRef(() => SignalFormControlNameDirective),
    },
  ],
})
export class SignalFormControlNameDirective extends NgSignalFormControl {
  private readonly _ngFormGroup = inject(NgSignalFormGroup);

  readonly signalFormControlName = input.required<string>();
  readonly signalFormControl = computed(() => this._getControl());

  private _getControl(): SignalFormControl {
    const controls = this._ngFormGroup.signalFormGroup().controls() as Record<
      string,
      SignalFormControl
    >;
    const control = controls[this.signalFormControlName()];
    if (!control)
      throw new Error(
        `No control found with name '${this.signalFormControlName()}'.`
      );
    return controls[this.signalFormControlName()];
  }
}
