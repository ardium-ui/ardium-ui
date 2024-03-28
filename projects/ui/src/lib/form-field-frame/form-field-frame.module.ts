import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumFormFieldFrameComponent } from './form-field-frame.component';
import { ArdFormFieldPrefixTemplateDirective, ArdFormFieldSuffixTemplateDirective } from './form-field-frame.directives';

@NgModule({
  declarations: [ArdiumFormFieldFrameComponent, ArdFormFieldPrefixTemplateDirective, ArdFormFieldSuffixTemplateDirective],
  imports: [CommonModule],
  exports: [ArdiumFormFieldFrameComponent, ArdFormFieldPrefixTemplateDirective, ArdFormFieldSuffixTemplateDirective],
})
export class ArdiumFormFieldFrameModule {}
