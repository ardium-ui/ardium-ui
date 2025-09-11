import { Component, effect, inject, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { ARD_FORM_FIELD_DEFAULTS } from '../form-field.defaults';

@Component({
  standalone: false,
  selector: 'ard-label',
  templateUrl: './label.component.html',
  host: {
    '[class.ard-label]': 'true',
  },
})
export class ArdiumLabelComponent {
  protected readonly _DEFAULTS = inject(ARD_FORM_FIELD_DEFAULTS);

  readonly required = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly optional = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly requiredText = input<string>(this._DEFAULTS.labelRequiredText);
  readonly optionalText = input<string>(this._DEFAULTS.labelOptionalText);

  constructor() {
    effect(() => {
      if (this.required() && this.optional()) {
        console.error(`ARD-NF5110: Cannot set a form field label to be both required and optional.`);
      }
    });
  }
}
