import { computed, signal, Signal, WritableSignal } from '@angular/core';
import {
  SignalAbstractControl,
  SignalAbstractControlOptions,
} from './SignalAbstractControl';

type SignalFormArrayRawValue<TControl extends SignalAbstractControl> =
  ReturnType<TControl['rawValue']>[];

type SignalFormArrayValue<TControl extends SignalAbstractControl> =
  | ReturnType<TControl['value']>[]
  | undefined;

export class SignalFormArray<
  TControl extends SignalAbstractControl = SignalAbstractControl,
  TMetadata = unknown
> extends SignalAbstractControl<SignalFormArrayValue<TControl>, TMetadata> {
  private readonly _controls: WritableSignal<TControl[]>;

  readonly controls: Signal<TControl[]>;
  override readonly rawValue: Signal<SignalFormArrayValue<TControl>>;
  override readonly value: Signal<SignalFormArrayValue<TControl>>;
  override readonly invalid: Signal<boolean>;
  override readonly valid: Signal<boolean>;
  override readonly touched: Signal<boolean>;
  override readonly untouched: Signal<boolean>;
  override readonly dirty: Signal<boolean>;
  override readonly pristine: Signal<boolean>;

  constructor(
    controls: TControl[] | ((control: SignalFormArray<TControl>) => TControl[]),
    options?: SignalAbstractControlOptions<
      SignalFormArrayValue<TControl>,
      TMetadata
    >
  ) {
    super(options);
    this._controls = signal(
      typeof controls === 'function' ? controls(this) : controls
    );
    this.controls = this._controls.asReadonly();
    this.controls().forEach((control) => {
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

  private _getRawValue(): SignalFormArrayRawValue<TControl> {
    const controls = this._controls();
    return controls.map((control) =>
      control.rawValue()
    ) as SignalFormArrayRawValue<TControl>;
  }

  private _getValue(): SignalFormArrayValue<TControl> {
    if (this.disabled() || this.hidden()) return undefined;
    const controls = this._controls();
    return controls.map((control) =>
      control.value()
    ) as SignalFormArrayValue<TControl>;
  }

  private _getInvalid(): boolean {
    if (this.disabled() || this.hidden()) return false;
    if (this.errors()) return true;
    const controls = this._controls();
    return controls.some((control) => control.invalid());
  }

  private _getTouched(): boolean {
    const controls = this._controls();
    return controls.some((control) => control.touched());
  }

  private _getDirty(): boolean {
    const controls = this._controls();
    return controls.some((control) => control.dirty());
  }

  protected override _setValue(value: SignalFormArrayRawValue<TControl>): void {
    const controls = this._controls();
    if (value.length !== controls.length)
      throw new Error('Value length does not match controls length.');
    for (let i = 0; i < controls.length; i++) controls[i].setValue(value[i]);
  }

  protected override _reset(value?: SignalFormArrayValue<TControl>): void {
    const controls = this._controls();
    if (value && value.length !== controls.length)
      throw new Error('Reset value length does not match controls length.');
    for (let i = 0; i < controls.length; i++)
      controls[i].reset(value ? value[i] : undefined);
  }

  override setTouched(touched: boolean): void {
    const controls = this._controls();
    for (const control of controls) control.setTouched(touched);
  }

  override setDirty(dirty: boolean): void {
    const controls = this._controls();
    for (const control of controls) control.setDirty(dirty);
  }

  push(control: TControl): void {
    const controls = this._controls();
    this._controls.set([...controls, control]);
    this._validate();
  }

  removeAt(index: number): void {
    const controls = this._controls();
    if (index < 0 || index >= controls.length)
      throw new Error('Index out of bounds.');
    const newControls = [...controls];
    newControls.splice(index, 1);
    this._controls.set([...newControls]);
    this._validate();
  }
}
