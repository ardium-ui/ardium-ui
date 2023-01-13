import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumCheckboxComponent } from './checkbox.component';



@NgModule({
  declarations: [
    ArdiumCheckboxComponent
  ],
  imports: [
    CommonModule
    ],
    exports: [
      ArdiumCheckboxComponent
  ]
})
export class ArdiumCheckboxModule { }
