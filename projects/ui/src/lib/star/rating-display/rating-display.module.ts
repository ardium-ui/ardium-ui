import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStarModule } from '../star.module';
import { ArdiumRatingDisplayComponent } from './rating-display.component';
import { ArdRatingDisplayStarTemplateDirective } from './rating-display.directives';

@NgModule({
  declarations: [ArdiumRatingDisplayComponent, ArdRatingDisplayStarTemplateDirective],
  imports: [CommonModule, ArdiumStarModule],
  exports: [ArdiumRatingDisplayComponent, ArdRatingDisplayStarTemplateDirective],
})
export class ArdiumRatingDisplayModule {}
