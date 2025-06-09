import { computed, Signal, signal } from '@angular/core';
import { SignalValidatorFn } from './SignalValidatorFn';
import { SignalAsyncValidatorFn } from './SignalAsyncValidatorFn';
import { SignalValidationErrors } from './SignalValidationErrors';
import { lastValueFrom, Observable } from 'rxjs';

export interface SignalAbstractControlOptions<T = unknown> {
  validators?: SignalValidatorFn[];
  asyncValidators?: SignalAsyncValidatorFn[];
  disabled?: (control: SignalAbstractControl<T>) => boolean;
  hidden?: (control: SignalAbstractControl<T>) => boolean;
  readOnly?: (control: SignalAbstractControl<T>) => boolean;
}

export abstract class SignalAbstractControl<T = unknown> {
  private readonly _pending = signal(false);
  private readonly _validators = signal<SignalValidatorFn[]>([]);
  private readonly _asyncValidators = signal<SignalAsyncValidatorFn[]>([]);
  private readonly _errors = signal<SignalValidationErrors | null>(null);
  private readonly _disabled = signal(false);
  private readonly _hidden = signal(false);
  private readonly _readOnly = signal(false);

  private _clearPreviousAsyncValidation: (() => void) | undefined;

  protected readonly _parent = signal<SignalAbstractControl | undefined>(
    undefined
  );

  abstract readonly rawValue: Signal<T>;
  abstract readonly value: Signal<T | undefined>;
  abstract readonly invalid: Signal<boolean>;
  abstract readonly valid: Signal<boolean>;
  readonly disabled: Signal<boolean>;
  readonly enabled: Signal<boolean>;
  abstract readonly dirty: Signal<boolean>;
  abstract readonly pristine: Signal<boolean>;
  abstract readonly touched: Signal<boolean>;
  abstract readonly untouched: Signal<boolean>;
  readonly hidden: Signal<boolean>;
  readonly visible: Signal<boolean>;
  readonly readOnly: Signal<boolean>;
  readonly writable: Signal<boolean>;
  readonly pending = this._pending.asReadonly();
  readonly validator = computed(() => this._getValidator());
  readonly asyncValidator = computed(() => this._getAsyncValidator());
  readonly errors = this._errors.asReadonly();
  readonly parent = this._parent.asReadonly();
  readonly root = computed(() => this._getRoot());

  constructor(options?: SignalAbstractControlOptions) {
    if (options?.validators) this._validators.set(options.validators);
    if (options?.asyncValidators)
      this._asyncValidators.set(options.asyncValidators);

    const disabled = options?.disabled;
    if (disabled)
      this.disabled = computed(
        () => this._disabled() || disabled(this) || !!this.parent()?.disabled()
      );
    else this.disabled = this._disabled.asReadonly();
    this.enabled = computed(() => !this.disabled());
    const hidden = options?.hidden;
    if (hidden)
      this.hidden = computed(
        () => this._hidden() || hidden(this) || !!this.parent()?.hidden()
      );
    else this.hidden = this._hidden.asReadonly();
    this.visible = computed(() => !this.hidden());
    const readOnly = options?.readOnly;
    if (readOnly)
      this.readOnly = computed(
        () => this._readOnly() || readOnly(this) || !!this.parent()?.readOnly()
      );
    else this.readOnly = this._readOnly.asReadonly();
    this.writable = computed(() => !this.readOnly());
  }

  private _getValidator(): SignalValidatorFn | null {
    const validators = this._validators();
    if (validators.length === 0) return null;
    return (control: SignalAbstractControl) => {
      let errors: SignalValidationErrors | null = null;
      for (const validator of validators) {
        const result = validator(control);
        if (result) errors = { ...(errors ?? {}), ...result };
      }
      return errors;
    };
  }

  private _getAsyncValidator(): SignalAsyncValidatorFn | null {
    const asyncValidators = this._asyncValidators();
    if (asyncValidators.length === 0) return null;
    return (control: SignalAbstractControl) => {
      return Promise.all(
        asyncValidators.map((validator) => validator(control))
      ).then((results) => {
        let errors: SignalValidationErrors | null = null;
        for (const result of results)
          if (result) errors = { ...(errors ?? {}), ...result };
        return errors;
      });
    };
  }

  private _getRoot(): SignalAbstractControl {
    return this._parent()?.root() ?? this;
  }

  protected _validate(): void {
    const validator = this.validator();
    const asyncValidator = this.asyncValidator();

    let errors: SignalValidationErrors | null = null;
    if (validator) errors = validator(this);
    this._errors.set(errors);

    if (errors || !asyncValidator) return;

    this._clearPreviousAsyncValidation?.();
    let compete = true;
    this._clearPreviousAsyncValidation = () => {
      compete = false;
    };
    this._pending.set(true);
    const promiseOrObservable = asyncValidator(this);
    const promise =
      promiseOrObservable instanceof Observable
        ? lastValueFrom(promiseOrObservable)
        : promiseOrObservable;
    promise.then((asyncErrors) => {
      if (!compete) return;
      this._pending.set(false);
      this._errors.set(asyncErrors);
    });
  }

  protected abstract _setValue(value: T): void;

  setValue(value: T): void {
    this._setValue(value);
    this._validate();
  }

  protected abstract _reset(value?: T): void;

  reset(value?: T): void {
    this._reset(value);
    this.setDirty(false);
    this.setTouched(false);
    this._validate();
  }

  setParent(parent: SignalAbstractControl): void {
    this._parent.set(parent);
  }

  setDisabled(disabled: boolean): void {
    this._disabled.set(disabled);
  }

  abstract setDirty(dirty: boolean): void;

  abstract setTouched(touched: boolean): void;

  setHidden(hidden: boolean): void {
    this._hidden.set(hidden);
  }

  setReadOnly(readOnly: boolean): void {
    this._readOnly.set(readOnly);
  }

  addValidators(validators: SignalValidatorFn[]): void {
    this._validators.set([...this._validators(), ...validators]);
    this._validate();
  }

  addAsyncValidators(asyncValidators: SignalAsyncValidatorFn[]): void {
    this._asyncValidators.set([...this._asyncValidators(), ...asyncValidators]);
    this._validate();
  }

  removeValidators(validators: SignalValidatorFn[]): void {
    this._validators.set(
      this._validators().filter((v) => !validators.includes(v))
    );
    this._validate();
  }

  removeAsyncValidators(asyncValidators: SignalAsyncValidatorFn[]): void {
    this._asyncValidators.set(
      this._asyncValidators().filter((v) => !asyncValidators.includes(v))
    );
    this._validate();
  }

  clearValidators(): void {
    this._validators.set([]);
    this._validate();
  }

  clearAsyncValidators(): void {
    this._asyncValidators.set([]);
    this._validate();
  }

  hasValidator(validator: SignalValidatorFn): boolean {
    return this._validators().includes(validator);
  }

  hasAsyncValidator(asyncValidator: SignalAsyncValidatorFn): boolean {
    return this._asyncValidators().includes(asyncValidator);
  }
}
