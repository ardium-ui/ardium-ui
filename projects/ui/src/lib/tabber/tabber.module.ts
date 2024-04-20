import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumTabberComponent } from './tabber.component';
import { ArdiumTabComponent } from './tab/tab.component';

@NgModule({
  declarations: [ArdiumTabberComponent, ArdiumTabComponent],
  imports: [CommonModule],
  exports: [ArdiumTabberComponent, ArdiumTabComponent],
})
export class ArdiumTabberModule {}
