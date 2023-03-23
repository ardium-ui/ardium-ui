import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonPage } from './button.page';
import { ArdiumButtonModule } from '@ardium-ui/ui';



@NgModule({
  declarations: [
    ButtonPage
  ],
  imports: [
      CommonModule,
      ArdiumButtonModule,
  ]
})
export class ButtonModule { }
