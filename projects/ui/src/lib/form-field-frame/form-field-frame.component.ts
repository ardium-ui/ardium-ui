import { ChangeDetectionStrategy, Component, ViewEncapsulation, ContentChild, TemplateRef, Input, HostBinding, input, computed } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance, FormElementVariant } from '../types/theming.types';
import { _DisablableComponentBase } from '../_internal/disablable-component';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { ArdFormFieldPrefixTemplateDirective, ArdFormFieldSuffixTemplateDirective } from './form-field-frame.directives';
import { Nullable } from '../types/utility.types';

@Component({
  selector: 'ard-form-field-frame',
  templateUrl: './form-field-frame.component.html',
  styleUrls: ['./form-field-frame.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumFormFieldFrameComponent extends _FocusableComponentBase {
  //! focused state
  @Input() override isFocused: boolean = false;

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
      this.isFocused() ? 'ard-focused' : 'ard-unfocused',
    ].join(' ')
  );

  //! prefix & suffix
  readonly prefixTemplateInput = input<Nullable<TemplateRef<any>>>(undefined, { alias: 'prefixTemplate' });
  readonly suffixTemplateInput = input<Nullable<TemplateRef<any>>>(undefined, { alias: 'suffixTemplate' });
  @ContentChild(ArdFormFieldPrefixTemplateDirective)
  prefixTemplate: TemplateRef<any> | null = null;
  @ContentChild(ArdFormFieldSuffixTemplateDirective)
  suffixTemplate: TemplateRef<any> | null = null;
}
