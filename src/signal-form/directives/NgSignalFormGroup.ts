import { Signal } from '@angular/core';
import { SignalFormGroup } from '../controls/SignalFormGroup';

export abstract class NgSignalFormGroup {
  abstract readonly signalFormGroup: Signal<SignalFormGroup>;
}
