import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSliderComponent } from './slider.component';
import { ArdSliderLabelDirective } from './slider.directive';
import { Overlay, OverlayModule } from "@angular/cdk/overlay";


@NgModule({
    declarations: [
        ArdiumSliderComponent,
        ArdSliderLabelDirective
    ],
    imports: [
        CommonModule,
        OverlayModule,
    ],
    exports: [
        ArdiumSliderComponent,
        ArdSliderLabelDirective
    ],
})
export class ArdiumSliderModule { }
