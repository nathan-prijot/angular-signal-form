import { Signal } from '@angular/core';
import { SignalFormControl } from './SignalFormControl';

export abstract class NgSignalFormControl {
  abstract readonly signalFormControl: Signal<SignalFormControl>;
}
