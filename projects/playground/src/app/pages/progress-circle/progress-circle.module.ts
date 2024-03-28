import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressCirclePage } from './progress-circle.page';
import { ArdiumProgressCircleModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [ProgressCirclePage],
  imports: [CommonModule, ArdiumProgressCircleModule],
})
export class ProgressCircleModule {}
