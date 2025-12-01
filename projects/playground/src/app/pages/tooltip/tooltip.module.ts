import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumTooltipModule } from 'projects/ui/src/lib/tooltip/tooltip.module';
import { TooltipPage } from './tooltip.page';

@NgModule({
  declarations: [TooltipPage],
  imports: [CommonModule, ArdiumTooltipModule],
})
export class TooltipModule {}
