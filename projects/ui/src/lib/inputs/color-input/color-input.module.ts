import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumColorInputComponent } from './color-input.component';
import { ArdColorInputPlaceholderTemplateDirective,
    ArdColorInputPrefixTemplateDirective,
    ArdColorInputSuffixTemplateDirective } from './color-input.directives';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumColorPickerModule } from '../../color/color-picker/color-picker.module';
import { ArdiumColorDisplayModule } from '../../color/color-display/color-display.module';



@NgModule({
    declarations: [
        ArdiumColorInputComponent,
        ArdColorInputPlaceholderTemplateDirective,
        ArdColorInputPrefixTemplateDirective,
        ArdColorInputSuffixTemplateDirective,
    ],
    imports: [
        CommonModule,
        ArdiumFormFieldFrameModule,
        _ClearButtonModule,
        ArdiumColorPickerModule,
        ArdiumColorDisplayModule,
    ],
    exports: [
        ArdiumColorInputComponent,
        ArdColorInputPlaceholderTemplateDirective,
        ArdColorInputPrefixTemplateDirective,
        ArdColorInputSuffixTemplateDirective,
    ]
})
export class ArdiumColorInputModule { }
