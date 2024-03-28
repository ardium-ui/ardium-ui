import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumStarDisplayComponent } from './star-display.component';
import { ArdiumStarModule } from '../star.module';

@NgModule({
  declarations: [ArdiumStarDisplayComponent],
  imports: [CommonModule, ArdiumStarModule],
  exports: [ArdiumStarDisplayComponent],
})
export class ArdiumStarDisplayModule {}
