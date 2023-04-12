import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumHoldEventModule } from '@ardium-ui/devkit';
import { ArdiumButtonModule } from '../../buttons/button/button.module';
import { ArdiumNumberInputComponent } from './number-input.component';
import { ArdNumberInputPlaceholderTemplateDirective } from './number-input.directives';



@NgModule({
  declarations: [
    ArdiumNumberInputComponent,
    ArdNumberInputPlaceholderTemplateDirective,
  ],
  imports: [
      CommonModule,
      ArdiumHoldEventModule,
      ArdiumButtonModule,
  ],
  exports: [
    ArdiumNumberInputComponent,
    ArdNumberInputPlaceholderTemplateDirective,
  ]
})
export class ArdiumNumberInputModule { }
