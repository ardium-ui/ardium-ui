import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStarButtonModule } from '../star-button/star-button.module';
import { ArdiumStarInputComponent } from './star-input.component';

@NgModule({
  declarations: [ArdiumStarInputComponent],
  imports: [CommonModule, ArdiumStarButtonModule],
  exports: [ArdiumStarInputComponent],
})
export class ArdiumStarInputModule {}
