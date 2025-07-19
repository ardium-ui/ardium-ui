import { CdkAutofill } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumDigitInputComponent } from './digit-input.component';

@NgModule({
  declarations: [ArdiumDigitInputComponent],
  imports: [CommonModule, CdkAutofill],
  exports: [ArdiumDigitInputComponent],
})
export class ArdiumDigitInputModule {}
