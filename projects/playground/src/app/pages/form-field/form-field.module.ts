import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ArdiumDigitInputModule, ArdiumFormFieldModule, ArdiumSelectModule, ArdiumSimpleInputModule } from '@ardium-ui/ui';
import { FormFieldPage } from './form-field.page';

@NgModule({
  declarations: [FormFieldPage],
  imports: [CommonModule, ReactiveFormsModule, ArdiumFormFieldModule, ArdiumSimpleInputModule, ArdiumSelectModule, ArdiumDigitInputModule],
})
export class FormFieldModule {}
