import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArdiumRoundedSelectionDirective } from './rounded-selection.directive';

@NgModule({
  declarations: [ArdiumRoundedSelectionDirective],
  imports: [CommonModule],
  exports: [ArdiumRoundedSelectionDirective],
})
export class ArdiumRoundedSelectionModule {}
