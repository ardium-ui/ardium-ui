import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SegmentPage } from './segment.page';
import { ArdiumSegmentModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [SegmentPage],
  imports: [CommonModule, ArdiumSegmentModule],
})
export class SegmentModule {}
