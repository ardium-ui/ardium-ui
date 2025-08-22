import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FormFieldComponentBase } from '../_internal/form-field-component';
import { SimpleOneAxisAlignment } from './../types/alignment.types';
import { ArdiumErrorDirective } from './error/error.directive';
import { ARD_FORM_FIELD_DEFAULTS } from './form-field.defaults';
import { ArdiumHintDirective } from './hint/hint.directive';
import { ArdiumLabelComponent } from './label/label.component';

@Component({
  selector: 'ard-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumFormFieldComponent implements OnInit {
  protected readonly _DEFAULTS = inject(ARD_FORM_FIELD_DEFAULTS);

  public readonly alignHintToLeftByDefault = this._DEFAULTS.defaultHintAlign === SimpleOneAxisAlignment.Left;

  readonly control = contentChild<_FormFieldComponentBase>(_FormFieldComponentBase);

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
