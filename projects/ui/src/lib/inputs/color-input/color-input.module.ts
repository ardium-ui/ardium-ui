import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumClickOutsideEventModule } from '@ardium-ui/devkit';
import { ArdiumButtonModule } from '../../buttons/button/button.module';
import { ArdiumCardModule } from '../../card/card.module';
import { ArdiumColorDisplayModule } from '../../color/color-display/color-display.module';
import { ArdiumColorPickerModule } from '../../color/color-picker/color-picker.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumColorInputComponent } from './color-input.component';
import {
    ArdColorInputActionButtonsTemplateDirective,
    ArdColorInputColorReferenceTemplateDirective,
    ArdColorInputHueIndicatorTemplateDirective,
    ArdColorInputOpacityIndicatorTemplateDirective,
    ArdColorInputPlaceholderTemplateDirective,
    ArdColorInputPrefixTemplateDirective,
    ArdColorInputShadeIndicatorTemplateDirective,
    ArdColorInputSuffixTemplateDirective
} from './color-input.directives';



@NgModule({
    declarations: [
        ArdiumColorInputComponent,
        ArdColorInputPlaceholderTemplateDirective,
        ArdColorInputPrefixTemplateDirective,
        ArdColorInputSuffixTemplateDirective,
        ArdColorInputShadeIndicatorTemplateDirective,
        ArdColorInputHueIndicatorTemplateDirective,
        ArdColorInputOpacityIndicatorTemplateDirective,
        ArdColorInputColorReferenceTemplateDirective,
        ArdColorInputActionButtonsTemplateDirective,
    ],
    imports: [
    CommonModule,
        ArdiumFormFieldFrameModule,
        _ClearButtonModule,
        ArdiumColorPickerModule,
        ArdiumColorDisplayModule,
        ArdiumCardModule,
        ArdiumClickOutsideEventModule,
        ArdiumButtonModule,
    ],
    exports: [
        ArdiumColorInputComponent,
        ArdColorInputPlaceholderTemplateDirective,
        ArdColorInputPrefixTemplateDirective,
        ArdColorInputSuffixTemplateDirective,
        ArdColorInputShadeIndicatorTemplateDirective,
        ArdColorInputHueIndicatorTemplateDirective,
        ArdColorInputOpacityIndicatorTemplateDirective,
        ArdColorInputColorReferenceTemplateDirective,
        ArdColorInputActionButtonsTemplateDirective,
    ]
})
export class ArdiumColorInputModule { }
