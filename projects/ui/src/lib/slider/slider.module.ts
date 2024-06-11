import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumSliderComponent } from './slider.component';
import { ArdSliderTooltipDirective } from './slider.directive';

@NgModule({
  declarations: [ArdiumSliderComponent, ArdSliderTooltipDirective],
  imports: [CommonModule, OverlayModule],
  exports: [ArdiumSliderComponent, ArdSliderTooltipDirective],
})
export class ArdiumSliderModule {}
