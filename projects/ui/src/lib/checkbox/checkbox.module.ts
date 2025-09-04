import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconModule } from "../icon";
import { ArdiumCheckboxComponent } from './checkbox.component';
import { ArdCheckboxTemplateDirective } from './checkbox.directives';

@NgModule({
  declarations: [ArdiumCheckboxComponent, ArdCheckboxTemplateDirective],
  imports: [CommonModule, ArdiumIconModule],
  exports: [ArdiumCheckboxComponent, ArdCheckboxTemplateDirective],
})
export class ArdiumCheckboxModule {}
