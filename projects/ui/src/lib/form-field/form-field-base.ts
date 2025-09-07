import { computed, contentChild, contentChildren, Directive, inject, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { isFunction } from 'simple-bool';
import { SimpleOneAxisAlignment } from '../types/alignment.types';
import { ArdiumErrorDirective } from './error/error.directive';
import { ARD_FORM_FIELD_CONTROL, ArdFormFieldControl } from './form-field-child.token';
import { ARD_FORM_FIELD_DEFAULTS } from './form-field.defaults';
import { ArdiumHintDirective } from './hint/hint.directive';
import { ArdiumLabelComponent } from './label/label.component';

@Directive()
export abstract class _FormFieldBase {
  protected readonly _DEFAULTS = inject(ARD_FORM_FIELD_DEFAULTS);

  public readonly alignHintToLeftByDefault = this._DEFAULTS.defaultHintAlign === SimpleOneAxisAlignment.Left;

  readonly control = contentChild<ArdFormFieldControl>(ARD_FORM_FIELD_CONTROL);

  get controlHasError() {
    const fnOrValue = this.control()?.hasError;
    return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  }
  get controlIsSuccess() {
    const fnOrValue = this.control()?.isSuccess;
    return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  }
  get controlDisabled() {
    const fnOrValue = this.control()?.disabled;
    return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  }
  get controlHtmlId() {
    const fnOrValue = this.control()?.htmlId;
    return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  }
  // get controlRequired() {
  //   const fnOrValue = this.control()?.required;
  //   return isFunction(fnOrValue) ? fnOrValue() : fnOrValue;
  // }

  readonly label = contentChild<ArdiumLabelComponent>(ArdiumLabelComponent);

  readonly hints = contentChildren<ArdiumHintDirective>(ArdiumHintDirective);
  readonly errors = contentChildren<ArdiumErrorDirective>(ArdiumErrorDirective);
  readonly hasAnyError = computed<boolean>(() => this.errors()?.length > 0);
  readonly reserveHintLine = input<boolean, any>(this._DEFAULTS.reserveHintLine, { transform: v => coerceBooleanProperty(v) });

  ngOnInit(): void {
    if (!this.control()) {
      throw new Error(
        `ARD-FT5110: Form field component requires any control (input) to be present within the element. Found none.`
      );
    }
  }
}
