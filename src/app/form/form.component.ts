import { JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { SignalAbstractControl } from '../../signal-form/SignalAbstractControl';
import { SignalFormArray } from '../../signal-form/SignalFormArray';
import { SignalFormControl } from '../../signal-form/SignalFormControl';
import { SignalFormGroup } from '../../signal-form/SignalFormGroup';
import { SignalValidationErrors } from '../../signal-form/SignalValidationErrors';
import { SignalValidators } from '../../signal-form/SignalValidators';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ControlControlPanelComponent } from './control-control-panel/control-control-panel.component';
import { MultiTextFieldComponent } from './multi-text-field/multi-text-field.component';
import { TextFieldComponent } from './text-field/text-field.component';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  imports: [
    JsonPipe,
    TextFieldComponent,
    MultiTextFieldComponent,
    ControlControlPanelComponent,
    CheckboxComponent,
  ],
})
export class FormComponent {
  protected readonly formGroup = new SignalFormGroup(() => {
    const hide = new SignalFormGroup<{
      disableName: SignalFormControl<boolean>;
      disableLines: SignalFormControl<boolean>;
    }>((control) => {
      return {
        disableName: new SignalFormControl(false, {
          disabled: () => !!control.controls().disableLines.rawValue(),
        }),
        disableLines: new SignalFormControl(false, {
          disabled: () => !!control.controls().disableName.rawValue(),
        }),
      };
    });
    const name = new SignalFormGroup(
      {
        firstName: new SignalFormControl('John', {
          validators: [
            SignalValidators.required,
            SignalValidators.minLength(2),
          ],
        }),
        lastName: new SignalFormControl('Doe', {
          validators: [
            SignalValidators.required,
            SignalValidators.minLength(2),
          ],
        }),
      },
      {
        validators: [this._nameValidator],
        disabled: () => !!hide.controls().disableName.value(),
      }
    );
    const search = new SignalFormControl('', {
      validators: [SignalValidators.required],
      asyncValidators: [this._searchValidator.bind(this)],
      //updateOn: 'blur',
    });
    const lines = new SignalFormArray<SignalFormControl<string>>([], {
      disabled: () => name.invalid() || !!hide.controls().disableLines.value(),
    });
    return { hide, name, search, lines };
  });

  private _nameValidator(
    control: SignalAbstractControl
  ): SignalValidationErrors | null {
    const value = control.value() as ReturnType<
      ReturnType<typeof this.formGroup.controls>['name']['value']
    >;
    if (
      value &&
      value.firstName &&
      value.lastName &&
      value.firstName === value.lastName
    )
      return { custom: 'First name and last name cannot be the same.' };
    return null;
  }

  private _getRandomInt(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }

  private _searchValidator(
    control: SignalAbstractControl
  ): Promise<SignalValidationErrors | null> {
    const value = control.value() as string;
    if (!value) return Promise.resolve(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!['apple', 'banana', 'cherry'].includes(value))
          resolve({ custom: `Search term '${value}' does not exist.` });
        else resolve(null);
      }, this._getRandomInt(500, 2000));
    });
  }

  protected resetForm(): void {
    this.formGroup.reset();
  }
}
