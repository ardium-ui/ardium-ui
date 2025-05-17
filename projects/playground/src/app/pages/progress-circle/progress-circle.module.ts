import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumProgressCircleModule } from 'projects/ui/src/public-api';
import { ProgressCirclePage } from './progress-circle.page';

@NgModule({
  declarations: [ProgressCirclePage],
  imports: [CommonModule, ArdiumProgressCircleModule],
})
export class ProgressCircleModule {}
