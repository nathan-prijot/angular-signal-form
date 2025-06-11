import {
  Directive,
  effect,
  ElementRef,
  forwardRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { SignalFormControl } from '../controls/SignalFormControl';
import { NgSignalFormControl } from './NgSignalFormControl';

@Directive({
  selector: '[signalFormControl]',
  providers: [
    {
      provide: NgSignalFormControl,
      useExisting: forwardRef(() => SignalFormControlDirective),
    },
  ],
})
export class SignalFormControlDirective extends NgSignalFormControl {
  private readonly _elementRef: ElementRef<HTMLInputElement> =
    inject(ElementRef);

  readonly signalFormControl = input.required<SignalFormControl>();

  constructor() {
    super();
    effect(() => {
      const value = this.signalFormControl().rawValue();
      const inputElement = this._elementRef.nativeElement;
      if (inputElement.type === 'checkbox')
        inputElement.checked = Boolean(value);
      else inputElement.value = value ? String(value) : '';
    });

    effect(() => {
      const disabled = this.signalFormControl().disabled();
      const inputElement = this._elementRef.nativeElement;
      inputElement.disabled = disabled;
    });

    effect(() => {
      const readOnly = this.signalFormControl().readOnly();
      const inputElement = this._elementRef.nativeElement;
      inputElement.readOnly = readOnly;
    });
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (this.signalFormControl().updateOn === 'change') {
      const inputElement = event.target as HTMLInputElement;
      const value =
        inputElement.type === 'checkbox'
          ? inputElement.checked
          : inputElement.value;
      this.signalFormControl().setValue(value);
    }
    this.signalFormControl().setDirty(true);
  }

  @HostListener('blur', ['$event'])
  onBlur(event: Event): void {
    if (this.signalFormControl().updateOn === 'blur') {
      const inputElement = event.target as HTMLInputElement;
      const value =
        inputElement.type === 'checkbox'
          ? inputElement.checked
          : inputElement.value;
      this.signalFormControl().setValue(value);
    }
    this.signalFormControl().setTouched(true);
  }
}
