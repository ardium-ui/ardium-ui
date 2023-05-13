import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumHexInputModule } from '../../inputs/hex-input/hex-input.module';
import { ArdiumNumberInputModule } from '../../inputs/number-input/number-input.module';
import { ArdiumOptionModule } from '../../option/option.module';
import { ArdiumSelectModule } from '../../select/select.module';
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
        CommonModule,
        ArdiumSelectModule,
        ArdiumOptionModule,
        ArdiumNumberInputModule,
        ArdiumHexInputModule,
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
