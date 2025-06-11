import { computed, Signal, signal, WritableSignal } from '@angular/core';
import {
  SignalAbstractControl,
  SignalAbstractControlOptions,
} from './SignalAbstractControl';

export interface SignalFormControlOptions<TValue = unknown, TMetadata = unknown>
  extends SignalAbstractControlOptions<TValue, TMetadata> {
  updateOn?: 'change' | 'blur';
}

export class SignalFormControl<
  TValue = unknown,
  TMetadata = unknown
> extends SignalAbstractControl<TValue, TMetadata> {
  private readonly _defaultValue: TValue;
  private readonly _value: WritableSignal<TValue>;
  private readonly _touched = signal(false);
  private readonly _dirty = signal(false);

  override readonly rawValue: Signal<TValue>;
  override readonly value: Signal<TValue | undefined>;
  override readonly invalid = computed(
    () => !!this.errors() && this.enabled() && this.visible()
  );
  override readonly valid = computed(() => !this.invalid());
  override readonly touched: Signal<boolean>;
  override readonly untouched: Signal<boolean>;
  override readonly dirty: Signal<boolean>;
  override readonly pristine: Signal<boolean>;
  readonly updateOn: 'change' | 'blur';

  constructor(
    defaultValue: TValue,
    options?: SignalFormControlOptions<TValue, TMetadata>
  ) {
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

  protected override _setValue(value: TValue): void {
    this._value.set(value);
  }

  protected override _reset(value?: TValue): void {
    this._value.set(value !== undefined ? value : this._defaultValue);
  }

  override setTouched(touched: boolean): void {
    this._touched.set(touched);
  }

  override setDirty(dirty: boolean): void {
    this._dirty.set(dirty);
  }
}
