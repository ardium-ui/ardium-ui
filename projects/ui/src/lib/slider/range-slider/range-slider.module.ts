import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumRangeSliderComponent } from './range-slider.component';



@NgModule({
    declarations: [
        ArdiumRangeSliderComponent
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        ArdiumRangeSliderComponent
    ]
})
export class ArdiumRangeSliderModule { }
