import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumFormFieldModule, ArdiumSimpleInputModule } from '@ardium-ui/ui';
import { FormFieldPage } from './form-field.page';

@NgModule({
  declarations: [FormFieldPage],
  imports: [CommonModule, ArdiumFormFieldModule, ArdiumSimpleInputModule],
})
export class FormFieldModule {}
