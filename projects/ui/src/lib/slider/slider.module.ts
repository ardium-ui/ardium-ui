import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSliderComponent } from './slider.component';
import { ArdSliderLabelDirective } from './slider.directive';



@NgModule({
    declarations: [
        ArdiumSliderComponent,
        ArdSliderLabelDirective
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumSliderComponent,
        ArdSliderLabelDirective
    ],
})
export class ArdiumSliderModule { }
