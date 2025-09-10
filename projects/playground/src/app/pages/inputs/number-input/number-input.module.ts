import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ArdiumFormFieldModule, ArdiumNumberInputModule } from 'projects/ui/src/public-api';
import { NumberInputPage } from './number-input.page';

@NgModule({
  declarations: [NumberInputPage],
  imports: [CommonModule, FormsModule, ArdiumNumberInputModule, ReactiveFormsModule, ArdiumFormFieldModule],
})
export class NumberInputModule {}
