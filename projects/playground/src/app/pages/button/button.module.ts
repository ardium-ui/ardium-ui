import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ArdiumButtonModule,
  ArdiumCheckboxModule,
  ArdiumRadioModule,
  ArdiumSelectModule,
  ArdiumSimpleInputModule,
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
    ArdiumSimpleInputModule,
  ],
})
export class ButtonModule {}
