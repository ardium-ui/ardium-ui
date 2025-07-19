import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumColorInputModule } from 'projects/ui/src/public-api';
import { ColorInputPage } from './color-input.page';

@NgModule({
  declarations: [ColorInputPage],
  imports: [CommonModule, ArdiumColorInputModule],
})
export class ColorInputModule {}
