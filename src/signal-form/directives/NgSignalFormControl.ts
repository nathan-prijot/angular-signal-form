import { Signal } from '@angular/core';
import { SignalFormControl } from '../controls';

export abstract class NgSignalFormControl {
  abstract readonly signalFormControl: Signal<SignalFormControl>;
}
