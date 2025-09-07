import { ChangeDetectionStrategy, Component, contentChild, forwardRef, Inject, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ARD_FORM_FIELD_CONTROL } from '../../form-field/form-field-child.token';
import { _SimpleInputComponentBase } from '../_simple-input-base';
import { ARD_SIMPLE_INPUT_DEFAULTS, ArdSimpleInputDefaults } from './simple-input.defaults';
import {
  ArdSimpleInputPlaceholderTemplateDirective,
  ArdSimpleInputPrefixTemplateDirective,
  ArdSimpleInputSuffixTemplateDirective,
} from './simple-input.directives';

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
    {
      provide: ARD_FORM_FIELD_CONTROL,
      useExisting: ArdiumSimpleInputComponent,
    },
  ],
})
export class ArdiumSimpleInputComponent extends _SimpleInputComponentBase {
  protected override readonly _DEFAULTS!: ArdSimpleInputDefaults;
  constructor(@Inject(ARD_SIMPLE_INPUT_DEFAULTS) defaults: ArdSimpleInputDefaults) {
    super(defaults);
  }

  //! prefix & suffix
  readonly prefixTemplate = contentChild(ArdSimpleInputPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdSimpleInputSuffixTemplateDirective);

  //! placeholder
  readonly placeholderTemplate = contentChild(ArdSimpleInputPlaceholderTemplateDirective);
}
