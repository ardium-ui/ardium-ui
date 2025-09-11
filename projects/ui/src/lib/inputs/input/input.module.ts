import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { ArdiumInputComponent } from './input.component';
import {
  ArdInputPlaceholderTemplateDirective,
  ArdInputPrefixTemplateDirective,
  ArdInputSuffixTemplateDirective,
} from './input.directives';

@NgModule({
  declarations: [
    ArdiumInputComponent,
    ArdInputPlaceholderTemplateDirective,
    ArdInputPrefixTemplateDirective,
    ArdInputSuffixTemplateDirective,
  ],
  imports: [CommonModule, _ClearButtonModule, ArdiumFormFieldFrameModule],
  exports: [
    ArdiumInputComponent,
    ArdInputPlaceholderTemplateDirective,
    ArdInputPrefixTemplateDirective,
    ArdInputSuffixTemplateDirective,
  ],
})
export class ArdiumInputModule {}
