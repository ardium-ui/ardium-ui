import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSliderComponent } from './slider.component';
import { ArdSliderTooltipDirective } from './slider.directive';
import { Overlay, OverlayModule } from "@angular/cdk/overlay";


@NgModule({
    declarations: [
        ArdiumSliderComponent,
        ArdSliderTooltipDirective
    ],
    imports: [
        CommonModule,
        OverlayModule,
    ],
    exports: [
        ArdiumSliderComponent,
        ArdSliderTooltipDirective
    ],
})
export class ArdiumSliderModule { }
