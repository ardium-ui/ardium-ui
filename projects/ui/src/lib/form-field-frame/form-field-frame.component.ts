import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    TemplateRef,
    ViewEncapsulation,
    computed,
    contentChild,
    input,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { FormElementAppearance, FormElementVariant } from '../types/theming.types';
import { Nullable } from '../types/utility.types';
import { ARD_FORM_FIELD_FRAME_DEFAULTS, ArdFormFieldFrameDefaults } from './form-field-frame.defaults';
import { ArdFormFieldPrefixTemplateDirective, ArdFormFieldSuffixTemplateDirective } from './form-field-frame.directives';

@Component({
  standalone: false,
  selector: 'ard-form-field-frame',
  templateUrl: './form-field-frame.component.html',
  styleUrls: ['./form-field-frame.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumFormFieldFrameComponent extends _FocusableComponentBase {
  protected override readonly _DEFAULTS!: ArdFormFieldFrameDefaults;
  constructor(@Inject(ARD_FORM_FIELD_FRAME_DEFAULTS) defaults: ArdFormFieldFrameDefaults) {
    super(defaults);
  }

  readonly hasError = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly isSuccess = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! focused state
  @Input({ alias: 'isFocused' })
  set _setIsFocused(v: boolean) {
    this.isFocused.set(v);
  }

  //! appearance
  /**
   * The appearance of the component, aka the styling.
   */
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Outlined);
  /**
   * The variant of the component, aka the shape.
   */
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);

  /**
   * Whether to use the compact styling or not.
   */
  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed<string>(() =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      this.compact() ? 'ard-compact' : '',
      this.hasError() ? 'ard-has-error' : '',
      this.isSuccess() ? 'ard-is-success' : '',
      this.isFocused() ? 'ard-focused' : 'ard-unfocused',
    ].join(' ')
  );

  //! prefix & suffix
  readonly prefixTemplateInput = input<Nullable<TemplateRef<any>>>(undefined, { alias: 'prefixTemplate' });
  readonly suffixTemplateInput = input<Nullable<TemplateRef<any>>>(undefined, { alias: 'suffixTemplate' });
  readonly prefixTemplate = contentChild(ArdFormFieldPrefixTemplateDirective);
  readonly suffixTemplate = contentChild(ArdFormFieldSuffixTemplateDirective);
}
