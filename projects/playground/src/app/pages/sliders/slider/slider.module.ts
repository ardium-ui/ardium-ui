import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Field } from '@angular/forms/signals';
import { ArdiumSliderModule } from 'projects/ui/src/public-api';
import { SliderPage } from './slider.page';

@NgModule({
  declarations: [SliderPage],
  imports: [CommonModule, ArdiumSliderModule, ReactiveFormsModule, Field],
  exports: [SliderPage],
})
export class SliderModule {}
