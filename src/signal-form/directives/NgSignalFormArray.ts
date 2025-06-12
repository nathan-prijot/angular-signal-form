import { Signal } from '@angular/core';
import { SignalFormArray } from '../controls';

export abstract class NgSignalFormArray {
  abstract readonly signalFormArray: Signal<SignalFormArray>;
}
