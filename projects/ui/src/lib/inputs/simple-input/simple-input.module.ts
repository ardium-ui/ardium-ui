import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSimpleInputComponent } from './simple-input.component';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdSimpleInputPlaceholderTemplateDirective, ArdSimpleInputPrefixTemplateDirective, ArdSimpleInputSuffixTemplateDirective } from './simple-input.directives';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';



@NgModule({
    declarations: [
        ArdiumSimpleInputComponent,
        ArdSimpleInputPlaceholderTemplateDirective,
        ArdSimpleInputPrefixTemplateDirective,
        ArdSimpleInputSuffixTemplateDirective,
    ],
    imports: [
        CommonModule,
        _ClearButtonModule,
        ArdiumFormFieldFrameModule,
    ],
    exports: [
        ArdiumSimpleInputComponent,
        ArdSimpleInputPlaceholderTemplateDirective,
        ArdSimpleInputPrefixTemplateDirective,
        ArdSimpleInputSuffixTemplateDirective,
    ]
})
export class ArdiumSimpleInputModule { }
