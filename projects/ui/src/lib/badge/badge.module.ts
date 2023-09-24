import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumBadgeDirective } from './badge.directive';



@NgModule({
  declarations: [
    ArdiumBadgeDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ArdiumBadgeDirective
  ]
})
export class ArdiumBadgeModule { }
