import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumSliderModule } from 'projects/ui/src/public-api';
import { SliderPage } from './slider.page';

@NgModule({
  declarations: [SliderPage],
  imports: [CommonModule, ArdiumSliderModule],
  exports: [SliderPage],
})
export class SliderModule {}
