import { computed, Directive, forwardRef, inject, input } from '@angular/core';
import { SignalFormControl } from '../controls';
import { NgSignalFormControl } from './NgSignalFormControl';
import { NgSignalFormGroup } from './NgSignalFormGroup';

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
  private readonly _ngFormGroup = inject(NgSignalFormGroup, {
    optional: true,
  });

  readonly signalFormControlName = input.required<string>();
  readonly signalFormControl = computed(() => this._getControl());

  private _getControl(): SignalFormControl {
    if (!this._ngFormGroup)
      throw new Error(
        'No parent form group found. Ensure this directive is used within a signal form group.'
      );
    const controls = this._ngFormGroup.signalFormGroup().controls() as Record<
      string,
      SignalFormControl
    >;
    const control = controls[this.signalFormControlName()];
    if (!control || !(control instanceof SignalFormControl))
      throw new Error(
        `No form control found with name '${this.signalFormControlName()}'.`
      );
    return controls[this.signalFormControlName()];
  }
}
