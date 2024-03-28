import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumHexInputModule } from '../../inputs/hex-input/hex-input.module';
import { ArdiumNumberInputModule } from '../../inputs/number-input/number-input.module';
import { ArdiumOptionModule } from '../../option/option.module';
import { ArdiumSelectModule } from '../../select/select.module';
import { ArdiumColorPickerComponent } from './color-picker.component';
import {
  ArdColorPickerColorReferenceTemplateDirective,
  ArdColorPickerHueIndicatorTemplateDirective,
  ArdColorPickerOpacityIndicatorTemplateDirective,
  ArdColorPickerShadeIndicatorTemplateDirective,
} from './color-picker.directives';

@NgModule({
  declarations: [
    ArdiumColorPickerComponent,
    ArdColorPickerHueIndicatorTemplateDirective,
    ArdColorPickerShadeIndicatorTemplateDirective,
    ArdColorPickerColorReferenceTemplateDirective,
    ArdColorPickerOpacityIndicatorTemplateDirective,
  ],
  imports: [CommonModule, ArdiumSelectModule, ArdiumOptionModule, ArdiumNumberInputModule, ArdiumHexInputModule],
  exports: [
    ArdiumColorPickerComponent,
    ArdColorPickerHueIndicatorTemplateDirective,
    ArdColorPickerShadeIndicatorTemplateDirective,
    ArdColorPickerColorReferenceTemplateDirective,
    ArdColorPickerOpacityIndicatorTemplateDirective,
  ],
})
export class ArdiumColorPickerModule {}
