import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ArdiumButtonModule,
    ArdiumCheckboxModule,
    ArdiumInputModule,
    ArdiumRadioModule,
    ArdiumSelectModule,
} from 'projects/ui/src/public-api';
import { ButtonPage } from './button.page';

@NgModule({
  declarations: [ButtonPage],
  imports: [
    CommonModule,
    ArdiumButtonModule,
    ArdiumRadioModule,
    ArdiumCheckboxModule,
    ArdiumSelectModule,
    ArdiumInputModule,
  ],
})
export class ButtonModule {}
