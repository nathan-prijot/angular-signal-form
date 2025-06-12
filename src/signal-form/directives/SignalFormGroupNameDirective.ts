import { computed, Directive, forwardRef, inject, input } from '@angular/core';
import { NgSignalFormGroup } from './NgSignalFormGroup';
import { SignalFormGroup } from '../controls';

@Directive({
  selector: '[signalFormGroupName]',
  providers: [
    {
      provide: NgSignalFormGroup,
      useExisting: forwardRef(() => SignalFormGroupNameDirective),
    },
  ],
})
export class SignalFormGroupNameDirective extends NgSignalFormGroup {
  private readonly _ngFormGroup = inject(NgSignalFormGroup, {
    optional: true,
  });

  readonly signalFormGroupName = input.required<string>();
  readonly signalFormGroup = computed(() => this._getControl());

  private _getControl(): SignalFormGroup {
    if (!this._ngFormGroup)
      throw new Error(
        'No parent form group found. Ensure this directive is used within a signal form group.'
      );
    const controls = this._ngFormGroup.signalFormGroup().controls() as Record<
      string,
      SignalFormGroup
    >;
    const control = controls[this.signalFormGroupName()];
    if (!control || !(control instanceof SignalFormGroup))
      throw new Error(
        `No form group found with name '${this.signalFormGroupName()}'.`
      );
    return controls[this.signalFormGroupName()];
  }
}
