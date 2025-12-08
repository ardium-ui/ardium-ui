import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumTabComponent } from './tab/tab.component';
import { ArdiumTabberComponent } from './tabber.component';
import { ArdTabberLabelTemplateDirective } from './tabber.directives';

@NgModule({
  declarations: [ArdiumTabberComponent, ArdiumTabComponent, ArdTabberLabelTemplateDirective],
  imports: [CommonModule],
  exports: [ArdiumTabberComponent, ArdiumTabComponent, ArdTabberLabelTemplateDirective],
})
export class ArdiumTabberModule {}
