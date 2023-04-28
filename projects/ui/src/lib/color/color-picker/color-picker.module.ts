import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumColorPickerComponent } from './color-picker.component';
import { ArdColorPickerColorWindowTemplateDirective, ArdColorPickerHueIndicatorTemplateDirective, ArdColorPickerOpacityIndicatorTemplateDirective, ArdColorPickerShadeIndicatorTemplateDirective } from './color-picker.directives';



@NgModule({
    declarations: [
        ArdiumColorPickerComponent,
        ArdColorPickerHueIndicatorTemplateDirective,
        ArdColorPickerShadeIndicatorTemplateDirective,
        ArdColorPickerColorWindowTemplateDirective,
        ArdColorPickerOpacityIndicatorTemplateDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumColorPickerComponent,
        ArdColorPickerHueIndicatorTemplateDirective,
        ArdColorPickerShadeIndicatorTemplateDirective,
        ArdColorPickerColorWindowTemplateDirective,
        ArdColorPickerOpacityIndicatorTemplateDirective,
    ]
})
export class ArdiumColorPickerModule { }
