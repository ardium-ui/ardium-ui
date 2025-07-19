import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumRangeSliderModule } from 'projects/ui/src/public-api';
import { RangeSliderPage } from './range-slider.page';

@NgModule({
  declarations: [RangeSliderPage],
  imports: [CommonModule, ArdiumRangeSliderModule],
})
export class RangeSliderModule {}
