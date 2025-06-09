import { computed, Signal, signal, WritableSignal } from '@angular/core';
import {
  SignalAbstractControl,
  SignalAbstractControlOptions,
} from './SignalAbstractControl';

export interface SignalFormControlOptions extends SignalAbstractControlOptions {
  updateOn?: 'change' | 'blur';
}

export class SignalFormControl<T = unknown> extends SignalAbstractControl<T> {
  private readonly _defaultValue: T;
  private readonly _value: WritableSignal<T>;
  private readonly _touched = signal(false);
  private readonly _dirty = signal(false);

  override readonly rawValue: Signal<T>;
  override readonly value: Signal<T | undefined>;
  override readonly invalid = computed(
    () => !!this.errors() && this.enabled() && this.visible()
  );
  override readonly valid = computed(() => !this.invalid());
  override readonly touched: Signal<boolean>;
  override readonly untouched: Signal<boolean>;
  override readonly dirty: Signal<boolean>;
  override readonly pristine: Signal<boolean>;
  readonly updateOn: 'change' | 'blur';

  constructor(defaultValue: T, options?: SignalFormControlOptions) {
    super(options);
    this.updateOn = options?.updateOn ?? 'change';
    this._defaultValue = defaultValue;
    this._value = signal(defaultValue);
    this.rawValue = this._value.asReadonly();
    this.value = computed(() =>
      this.enabled() && this.visible() ? this._value() : undefined
    );
    this.touched = this._touched.asReadonly();
    this.untouched = computed(() => !this.touched());
    this.dirty = this._dirty.asReadonly();
    this.pristine = computed(() => !this.dirty());
    this._validate();
  }

  protected override _setValue(value: T): void {
    this._value.set(value);
  }

  protected override _reset(value?: T): void {
    this._value.set(value !== undefined ? value : this._defaultValue);
  }

  override setTouched(touched: boolean): void {
    this._touched.set(touched);
  }

  override setDirty(dirty: boolean): void {
    this._dirty.set(dirty);
  }
}
