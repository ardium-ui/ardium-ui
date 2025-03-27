import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumErrorComponent } from './error/error.component';
import { ArdiumErrorDirective } from './error/error.directive';
import { ArdiumFormFieldComponent } from './form-field.component';
import { ArdiumHintComponent } from './hint/hint.component';
import { ArdiumHintDirective } from './hint/hint.directive';
import { ArdiumLabelComponent } from './label/label.component';

@NgModule({
  declarations: [ArdiumFormFieldComponent, ArdiumLabelComponent, ArdiumHintComponent, ArdiumErrorComponent],
  imports: [CommonModule, ArdiumHintDirective, ArdiumErrorDirective],
  exports: [ArdiumFormFieldComponent, ArdiumLabelComponent, ArdiumHintComponent, ArdiumErrorComponent],
})
export class ArdiumFormFieldModule {}
