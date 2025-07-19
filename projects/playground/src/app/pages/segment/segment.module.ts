import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumSegmentModule } from 'projects/ui/src/public-api';
import { SegmentPage } from './segment.page';

@NgModule({
  declarations: [SegmentPage],
  imports: [CommonModule, ArdiumSegmentModule],
})
export class SegmentModule {}
