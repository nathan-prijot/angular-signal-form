import { Component, input } from '@angular/core';
import { SignalAbstractControl } from '../../../signal-form';

@Component({
  selector: 'app-control-control-panel',
  templateUrl: './control-control-panel.component.html',
})
export class ControlControlPanelComponent {
  readonly control = input.required<SignalAbstractControl>();
}
