import { Component, inject, input } from '@angular/core';
import { NgSignalFormControl } from '../../../signal-form';

@Component({
  selector: 'app-sub-control-input',
  templateUrl: './sub-control-input.component.html',
})
export class SubControlInputComponent {
  private readonly _ngControl = inject(NgSignalFormControl);
  protected readonly control = this._ngControl.signalFormControl;
  readonly label = input.required<string>();
}
