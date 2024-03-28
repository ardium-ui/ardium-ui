import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RangeSliderModule } from './range-slider/range-slider.module';
import { SliderModule } from './slider/slider.module';
import { SlidersHomeModule } from './sliders-home/sliders-home.module';
import { SlidersRoutingModule } from './sliders-routing.module';
import { SlidersPage } from './sliders.page';

@NgModule({
  declarations: [SlidersPage],
  imports: [CommonModule, SlidersRoutingModule, SlidersHomeModule, SliderModule, RangeSliderModule],
  exports: [SlidersPage],
})
export class SlidersModule {}
