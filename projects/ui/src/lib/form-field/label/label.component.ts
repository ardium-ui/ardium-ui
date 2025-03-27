import { Component, effect, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'ard-label',
  templateUrl: './label.component.html',
})
export class ArdiumLabelComponent {
  readonly required = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly optional = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  constructor() {
    effect(() => {
      if (this.required() && this.optional()) {
        console.error(`ARD-NF5110: Cannot set a form field label to be both required and optional.`);
      }
    });
  }
}
