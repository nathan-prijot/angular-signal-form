import { computed, Signal, signal, WritableSignal } from '@angular/core';
import {
  SignalAbstractControl,
  SignalAbstractControlOptions,
} from './SignalAbstractControl';

type SignalFormGroupRawValue<
  TControl extends { [K in keyof TControl]: SignalAbstractControl }
> = {
  [K in keyof TControl]: ReturnType<TControl[K]['rawValue']>;
};

type SignalFormGroupValue<
  TControl extends { [K in keyof TControl]: SignalAbstractControl }
> = { [K in keyof TControl]: ReturnType<TControl[K]['value']> } | undefined;

type SignalFormGroupControls<
  TControl extends { [K in keyof TControl]: SignalAbstractControl }
> = {
  [K in keyof TControl]: TControl[K];
};

export class SignalFormGroup<
  TControl extends { [K in keyof TControl]: SignalAbstractControl } = object,
  TMetadata = unknown
> extends SignalAbstractControl<SignalFormGroupValue<TControl>, TMetadata> {
  private readonly _controls: WritableSignal<SignalFormGroupControls<TControl>>;

  readonly controls: Signal<SignalFormGroupControls<TControl>>;
  override readonly rawValue: Signal<SignalFormGroupRawValue<TControl>>;
  override readonly value: Signal<SignalFormGroupValue<TControl>>;
  override readonly invalid: Signal<boolean>;
  override readonly valid: Signal<boolean>;
  override readonly touched: Signal<boolean>;
  override readonly untouched: Signal<boolean>;
  override readonly dirty: Signal<boolean>;
  override readonly pristine: Signal<boolean>;

  constructor(
    controls:
      | SignalFormGroupControls<TControl>
      | ((
          control: SignalFormGroup<TControl>
        ) => SignalFormGroupControls<TControl>),
    options?: SignalAbstractControlOptions<
      SignalFormGroupValue<TControl>,
      TMetadata
    >
  ) {
    super(options);
    this._controls = signal(
      typeof controls === 'function' ? controls(this) : controls
    );
    this.controls = this._controls.asReadonly();
    this._applyToControls((control) => {
      control.setParent(this);
    });
    this.rawValue = computed(() => this._getRawValue());
    this.value = computed(() => this._getValue());
    this.invalid = computed(() => this._getInvalid());
    this.valid = computed(() => !this.invalid());
    this.touched = computed(() => this._getTouched());
    this.untouched = computed(() => !this.touched());
    this.dirty = computed(() => this._getDirty());
    this.pristine = computed(() => !this.dirty());
    this._validate();
  }

  private _applyToControls(
    method: (control: SignalAbstractControl) => void
  ): void {
    const controls = this._controls();
    for (const key in controls)
      if (controls.hasOwnProperty(key)) method(controls[key]);
  }

  private _getRawValue(): SignalFormGroupRawValue<TControl> {
    const controls = this._controls();
    const rawValue: Record<string, unknown> = {};

    for (const key in controls)
      if (controls.hasOwnProperty(key))
        rawValue[key] = controls[key].rawValue();

    return rawValue as SignalFormGroupRawValue<TControl>;
  }

  private _getValue(): SignalFormGroupValue<TControl> {
    if (this.disabled() || this.hidden()) return undefined;
    const controls = this._controls();
    const value: Record<string, unknown> = {};

    for (const key in controls)
      if (controls.hasOwnProperty(key) && controls[key].enabled())
        value[key] = controls[key].value();

    return value as SignalFormGroupValue<TControl>;
  }

  private _getInvalid(): boolean {
    if (this.disabled() || this.hidden()) return false;
    if (this.errors()) return true;
    const controls = this._controls();
    for (const key in controls)
      if (controls.hasOwnProperty(key) && controls[key].invalid()) return true;
    return false;
  }

  private _getTouched(): boolean {
    const controls = this._controls();
    for (const key in controls)
      if (controls.hasOwnProperty(key) && controls[key].touched()) return true;
    return false;
  }

  private _getDirty(): boolean {
    const controls = this._controls();
    for (const key in controls)
      if (controls.hasOwnProperty(key) && controls[key].dirty()) return true;
    return false;
  }

  protected override _setValue(value: SignalFormGroupRawValue<TControl>): void {
    for (const key in value)
      if (value.hasOwnProperty(key) && this._controls()[key])
        this._controls()[key].setValue(value[key]);
  }

  protected override _reset(value?: SignalFormGroupValue<TControl>): void {
    const controls = this._controls();
    for (const key in controls)
      if (controls.hasOwnProperty(key))
        controls[key].reset(value ? value[key] : undefined);
  }

  override setTouched(touched: boolean): void {
    const controls = this._controls();
    for (const key in controls)
      if (controls.hasOwnProperty(key)) controls[key].setTouched(touched);
  }

  override setDirty(dirty: boolean): void {
    const controls = this._controls();
    for (const key in controls)
      if (controls.hasOwnProperty(key)) controls[key].setDirty(dirty);
  }
}
