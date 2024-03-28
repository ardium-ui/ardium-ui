import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSegmentComponent } from './segment.component';
import { ArdSegmentOptionTemplateDirective } from './segment.directives';

@NgModule({
  declarations: [ArdiumSegmentComponent, ArdSegmentOptionTemplateDirective],
  imports: [CommonModule],
  exports: [ArdiumSegmentComponent, ArdSegmentOptionTemplateDirective],
})
export class ArdiumSegmentModule {}
