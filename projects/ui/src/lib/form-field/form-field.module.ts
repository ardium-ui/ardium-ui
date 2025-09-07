import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumErrorComponent } from './error/error.component';
import { ArdiumErrorDirective } from './error/error.directive';
import { ArdiumFormFieldNativeInputAdapterDirective } from './form-field-native-inputs';
import { ArdiumFormFieldComponent } from './form-field.component';
import { ArdiumHintComponent } from './hint/hint.component';
import { ArdiumHintDirective } from './hint/hint.directive';
import { ArdiumHorizontalFormFieldComponent } from './horizontal-form-field.component';
import { ArdiumLabelComponent } from './label/label.component';

@NgModule({
  declarations: [
    ArdiumFormFieldComponent,
    ArdiumHorizontalFormFieldComponent,
    ArdiumFormFieldNativeInputAdapterDirective,
    ArdiumLabelComponent,
    ArdiumHintComponent,
    ArdiumErrorComponent,
  ],
  imports: [CommonModule, ArdiumHintDirective, ArdiumErrorDirective],
  exports: [
    ArdiumFormFieldComponent,
    ArdiumHorizontalFormFieldComponent,
    ArdiumFormFieldNativeInputAdapterDirective,
    ArdiumLabelComponent,
    ArdiumHintComponent,
    ArdiumErrorComponent,
  ],
})
export class ArdiumFormFieldModule {}
