import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DigitInputPage } from './digit-input.page';
import { ArdiumDigitInputModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [DigitInputPage],
  imports: [CommonModule, ArdiumDigitInputModule],
})
export class DigitInputModule {}
