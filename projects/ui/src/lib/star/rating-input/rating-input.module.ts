import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStarButtonModule } from '../star-button';
import { ArdiumRatingInputComponent } from './rating-input.component';
import { ArdRatingInputStarButtonTemplateDirective } from './rating-input.directives';

@NgModule({
  declarations: [ArdiumRatingInputComponent, ArdRatingInputStarButtonTemplateDirective],
  imports: [CommonModule, ArdiumStarButtonModule],
  exports: [ArdiumRatingInputComponent, ArdRatingInputStarButtonTemplateDirective],
})
export class ArdiumRatingInputModule {}
