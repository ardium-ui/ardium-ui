import { ChangeDetectionStrategy, Component, forwardRef, Inject, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { _SimpleInputComponentBase } from '../_simple-input-base';
import { ARD_SIMPLE_INPUT_DEFAULTS, ArdSimpleInputDefaults } from './simple-input.defaults';

@Component({
  selector: 'ard-simple-input',
  templateUrl: './simple-input.component.html',
  styleUrls: ['./simple-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumSimpleInputComponent),
      multi: true,
    },
  ],
})
export class ArdiumSimpleInputComponent extends _SimpleInputComponentBase {
  protected override readonly _DEFAULTS!: ArdSimpleInputDefaults;
  constructor(@Inject(ARD_SIMPLE_INPUT_DEFAULTS) defaults: ArdSimpleInputDefaults) {
    super(defaults);
  }
}
