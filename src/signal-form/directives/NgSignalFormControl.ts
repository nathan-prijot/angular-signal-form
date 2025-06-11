import { Signal } from '@angular/core';
import { SignalFormControl } from '../controls/SignalFormControl';

export abstract class NgSignalFormControl {
  abstract readonly signalFormControl: Signal<SignalFormControl>;
}
