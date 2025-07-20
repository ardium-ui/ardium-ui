import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconModule } from '../icon';
import { ArdiumStarComponent } from './star.component';

@NgModule({
  declarations: [ArdiumStarComponent],
  imports: [CommonModule, ArdiumIconModule],
  exports: [ArdiumStarComponent],
})
export class ArdiumStarModule {}
