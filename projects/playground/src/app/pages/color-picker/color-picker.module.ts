import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// import { ArdiumColorPickerModule } from 'projects/ui/src/public-api';
import { ColorPickerPage } from './color-picker.page';

@NgModule({
  declarations: [ColorPickerPage],
  imports: [CommonModule /* ArdiumColorPickerModule */],
})
export class ColorPickerModule {}
