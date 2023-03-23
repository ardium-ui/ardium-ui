import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderPage } from './slider.page';
import { ArdiumRangeSliderModule, ArdiumSliderModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        SliderPage
    ],
    imports: [
        CommonModule,
        ArdiumSliderModule,
        ArdiumRangeSliderModule,
    ],
    exports: [
        SliderPage
    ],
})
export class SliderModule { }
