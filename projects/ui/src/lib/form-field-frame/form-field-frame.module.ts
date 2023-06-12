import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldFrameComponent } from './form-field-frame.component';
import { ArdFormFieldPrefixTemplateDirective, ArdFormFieldSuffixTemplateDirective } from './form-field-frame.directives';



@NgModule({
    declarations: [
        FormFieldFrameComponent,
        ArdFormFieldPrefixTemplateDirective,
        ArdFormFieldSuffixTemplateDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        FormFieldFrameComponent,
        ArdFormFieldPrefixTemplateDirective,
        ArdFormFieldSuffixTemplateDirective,
    ]
})
export class FormFieldFrameModule { }
