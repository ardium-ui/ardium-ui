import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { _FormFieldBase } from './form-field-base';

@Component({
  selector: 'ard-horizontal-form-field',
  templateUrl: './horizontal-form-field.component.html',
  styleUrl: './horizontal-form-field.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumHorizontalFormFieldComponent extends _FormFieldBase implements OnInit {}
