import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Field } from "@angular/forms/signals";
import { TestSliderComponent } from 'projects/ui/src/lib/slider/test-slider';
import { ArdiumSliderModule } from 'projects/ui/src/public-api';
import { SliderPage } from './slider.page';

@NgModule({
  declarations: [SliderPage],
  imports: [CommonModule, ArdiumSliderModule, ReactiveFormsModule, Field, TestSliderComponent],
  exports: [SliderPage],
})
export class SliderModule {}
