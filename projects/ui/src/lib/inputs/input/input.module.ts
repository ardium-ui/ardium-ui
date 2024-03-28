import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumClickOutsideEventModule } from '@ardium-ui/devkit';
import { ArdiumDropdownPanelModule } from '../../dropdown-panel/dropdown-panel.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumInputComponent } from './input.component';
import {
  ArdInputLoadingTemplateDirective,
  ArdInputPlaceholderTemplateDirective,
  ArdInputPrefixTemplateDirective,
  ArdInputSuffixTemplateDirective,
  ArdSuggestionTemplateDirective,
} from './input.directives';

@NgModule({
  declarations: [
    ArdiumInputComponent,
    ArdSuggestionTemplateDirective,
    ArdInputPlaceholderTemplateDirective,
    ArdInputLoadingTemplateDirective,
    ArdInputPrefixTemplateDirective,
    ArdInputSuffixTemplateDirective,
  ],
  imports: [CommonModule, ArdiumFormFieldFrameModule, _ClearButtonModule, ArdiumDropdownPanelModule, ArdiumClickOutsideEventModule],
  exports: [
    ArdiumInputComponent,
    ArdSuggestionTemplateDirective,
    ArdInputPlaceholderTemplateDirective,
    ArdInputLoadingTemplateDirective,
    ArdInputPrefixTemplateDirective,
    ArdInputSuffixTemplateDirective,
  ],
})
export class ArdiumInputModule {}
