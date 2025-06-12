import { Signal } from '@angular/core';
import { SignalFormGroup } from '../controls';

export abstract class NgSignalFormGroup {
  abstract readonly signalFormGroup: Signal<SignalFormGroup>;
}
