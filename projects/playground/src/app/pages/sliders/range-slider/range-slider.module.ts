import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeSliderPage } from './range-slider.page';
import { ArdiumRangeSliderModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [RangeSliderPage],
  imports: [CommonModule, ArdiumRangeSliderModule],
})
export class RangeSliderModule {}
