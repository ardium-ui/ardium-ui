import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumColorPickerComponent } from './color-picker.component';
import { ArdColorPickerColorWindowTemplateDirective, ArdColorPickerHueIndicatorTemplateDirective, ArdColorPickerShadeIndicatorTemplateDirective } from './color-picker.directives';



@NgModule({
    declarations: [
        ArdiumColorPickerComponent,
        ArdColorPickerHueIndicatorTemplateDirective,
        ArdColorPickerShadeIndicatorTemplateDirective,
        ArdColorPickerColorWindowTemplateDirective,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumColorPickerComponent,
        ArdColorPickerHueIndicatorTemplateDirective,
        ArdColorPickerShadeIndicatorTemplateDirective,
        ArdColorPickerColorWindowTemplateDirective,
    ]
})
export class ArdiumColorPickerModule { }
