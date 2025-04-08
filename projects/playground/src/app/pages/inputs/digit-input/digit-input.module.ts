import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ArdiumDigitInputModule } from '@ardium-ui/ui';
import { DigitInputPage } from './digit-input.page';

@NgModule({
  declarations: [DigitInputPage],
  imports: [CommonModule, ArdiumDigitInputModule, ReactiveFormsModule],
})
export class DigitInputModule {}
