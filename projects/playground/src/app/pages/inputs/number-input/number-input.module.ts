import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArdiumNumberInputModule } from 'projects/ui/src/public-api';
import { NumberInputPage } from './number-input.page';

@NgModule({
  declarations: [NumberInputPage],
  imports: [CommonModule, FormsModule, ArdiumNumberInputModule],
})
export class NumberInputModule {}
