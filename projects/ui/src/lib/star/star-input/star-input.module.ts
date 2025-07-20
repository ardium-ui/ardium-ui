import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStarButtonModule } from '../star-button/star-button.module';
import { ArdiumStarInputComponent } from './star-input.component';
import { ArdStarInputStarButtonTemplateDirective } from './star-input.directives';

@NgModule({
  declarations: [ArdiumStarInputComponent, ArdStarInputStarButtonTemplateDirective],
  imports: [CommonModule, ArdiumStarButtonModule],
  exports: [ArdiumStarInputComponent, ArdStarInputStarButtonTemplateDirective],
})
export class ArdiumStarInputModule {}
