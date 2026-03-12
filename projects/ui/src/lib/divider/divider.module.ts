import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumDividerComponent } from './divider.component';
import { ArdiumDividerDirective } from './divider.directive';

@NgModule({
  declarations: [ArdiumDividerComponent, ArdiumDividerDirective],
  imports: [CommonModule],
  exports: [ArdiumDividerComponent, ArdiumDividerDirective],
})
export class ArdiumDividerModule {}
