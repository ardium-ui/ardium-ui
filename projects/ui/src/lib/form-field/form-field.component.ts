import { Component, computed, contentChild, contentChildren, effect, inject } from '@angular/core';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { SimpleOneAxisAlignment } from './../types/alignment.types';
import { ArdiumErrorDirective } from './error/error.directive';
import { ARD_FORM_FIELD_DEFAULTS } from './form-field.defaults';
import { ArdiumHintDirective } from './hint/hint.directive';
import { ArdiumLabelComponent } from './label/label.component';

@Component({
  selector: 'ard-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class ArdiumFormFieldComponent {
  protected readonly _DEFAULTS = inject(ARD_FORM_FIELD_DEFAULTS);

  public readonly alignLabelToLeftByDefault = this._DEFAULTS.defaultHintAlign === SimpleOneAxisAlignment.Left;

  readonly control = contentChild<_NgModelComponentBase>(_NgModelComponentBase);

  fhjdf = effect(() => {
    console.log(this.control(), this.label());
  });

  readonly label = contentChild<ArdiumLabelComponent>(ArdiumLabelComponent);

  readonly hints = contentChildren<ArdiumHintDirective>(ArdiumHintDirective);
  // readonly leftHints = computed<ArdiumHintDirective[]>(() => this.hints().filter(v => v.left() && !v.right()));
  // readonly rightHints = computed<ArdiumHintDirective[]>(() => this.hints().filter(v => !v.left() && v.right()));

  readonly errors = contentChildren<ArdiumErrorDirective>(ArdiumErrorDirective);
  // readonly leftErrors = computed<ArdiumErrorDirective[]>(() => this.errors().filter(v => v.left() && !v.right()));
  // readonly rightErrors = computed<ArdiumErrorDirective[]>(() => this.errors().filter(v => !v.left() && v.right()));

  readonly hasAnyError = computed<boolean>(() => this.errors()?.length > 0);
}
