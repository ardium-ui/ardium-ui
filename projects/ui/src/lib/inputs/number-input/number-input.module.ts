import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumHoldEventModule } from '@ardium-ui/devkit';
import { ArdiumButtonModule } from '../../buttons/button/button.module';
import { ArdiumNumberInputComponent } from './number-input.component';



@NgModule({
  declarations: [
    ArdiumNumberInputComponent
  ],
  imports: [
      CommonModule,
      ArdiumHoldEventModule,
      ArdiumButtonModule,
  ],
  exports: [
    ArdiumNumberInputComponent
  ]
})
export class ArdiumNumberInputModule { }
