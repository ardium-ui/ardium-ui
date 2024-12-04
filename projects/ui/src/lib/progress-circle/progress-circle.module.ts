import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumProgressCircleComponent } from './progress-circle.component';
import { ArdProgressCircleValueTemplateDirective } from './progress-circle.directive';

@NgModule({
  declarations: [ArdiumProgressCircleComponent, ArdProgressCircleValueTemplateDirective],
  imports: [CommonModule, DecimalPipe],
  exports: [ArdiumProgressCircleComponent, ArdProgressCircleValueTemplateDirective],
})
export class ArdiumProgressCircleModule {}
