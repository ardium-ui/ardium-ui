import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumClickOutsideModule } from '@ardium-ui/devkit';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumDropdownPanelModule } from '../../dropdown-panel/dropdown-panel.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { ArdiumInputComponent } from './input.component';
import {
  ArdInputLoadingTemplateDirective,
  ArdInputPlaceholderTemplateDirective,
  ArdInputPrefixTemplateDirective,
  ArdInputSuffixTemplateDirective,
  ArdInputSuggestionTemplateDirective,
} from './input.directives';

@NgModule({
  declarations: [
    ArdiumInputComponent,
    ArdInputSuggestionTemplateDirective,
    ArdInputPlaceholderTemplateDirective,
    ArdInputLoadingTemplateDirective,
    ArdInputPrefixTemplateDirective,
    ArdInputSuffixTemplateDirective,
  ],
  imports: [
    CommonModule,
    ArdiumFormFieldFrameModule,
    _ClearButtonModule,
    ArdiumDropdownPanelModule,
    ArdiumClickOutsideModule,
  ],
  exports: [
    ArdiumInputComponent,
    ArdInputSuggestionTemplateDirective,
    ArdInputPlaceholderTemplateDirective,
    ArdInputLoadingTemplateDirective,
    ArdInputPrefixTemplateDirective,
    ArdInputSuffixTemplateDirective,
  ],
})
export class ArdiumInputModule {}
