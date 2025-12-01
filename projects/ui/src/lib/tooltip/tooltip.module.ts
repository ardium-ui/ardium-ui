import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumTooltipDirective } from './tooltip.directive';

@NgModule({
  declarations: [ArdiumTooltipDirective],
  imports: [CommonModule],
  exports: [ArdiumTooltipDirective],
})
export class ArdiumTooltipModule {}
