import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumPasswordInputComponent } from './password-input.component';
import { ArdPasswordInputPlaceholderTemplateDirective, ArdPasswordInputPrefixTemplateDirective, ArdPasswordInputRevealButtonTemplateDirective, ArdPasswordInputSuffixTemplateDirective } from './password-input.directives';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { ArdiumIconModule } from '../../icon/icon.module';



@NgModule({
    declarations: [
        ArdiumPasswordInputComponent,
        ArdPasswordInputPlaceholderTemplateDirective,
        ArdPasswordInputPrefixTemplateDirective,
        ArdPasswordInputSuffixTemplateDirective,
        ArdPasswordInputRevealButtonTemplateDirective,
    ],
    imports: [
        CommonModule,
        ArdiumFormFieldFrameModule,
        ArdiumIconModule,
    ],
    exports: [
        ArdiumPasswordInputComponent,
        ArdPasswordInputPlaceholderTemplateDirective,
        ArdPasswordInputPrefixTemplateDirective,
        ArdPasswordInputSuffixTemplateDirective,
        ArdPasswordInputRevealButtonTemplateDirective,
    ]
})
export class ArdiumPasswordInputModule { }
