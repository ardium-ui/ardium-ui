import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumHexInputComponent } from './hex-input.component';
import { ArdHexInputPlaceholderTemplateDirective, ArdHexInputPrefixTemplateDirective, ArdHexInputSuffixTemplateDirective } from './hex-input.directives';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';

@NgModule({
    declarations: [ArdiumHexInputComponent, ArdHexInputPlaceholderTemplateDirective, ArdHexInputPrefixTemplateDirective, ArdHexInputSuffixTemplateDirective],
    imports: [CommonModule, ArdiumFormFieldFrameModule, _ClearButtonModule],
    exports: [ArdiumHexInputComponent, ArdHexInputPlaceholderTemplateDirective, ArdHexInputPrefixTemplateDirective, ArdHexInputSuffixTemplateDirective],
})
export class ArdiumHexInputModule {}
