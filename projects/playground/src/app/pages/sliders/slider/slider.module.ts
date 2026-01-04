import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconModule, ArdiumSliderModule } from 'projects/ui/src/public-api';
import { SliderPage } from './slider.page';

@NgModule({
  declarations: [SliderPage],
  imports: [CommonModule, ArdiumSliderModule, ArdiumIconModule],
  exports: [SliderPage],
})
export class SliderModule {}
