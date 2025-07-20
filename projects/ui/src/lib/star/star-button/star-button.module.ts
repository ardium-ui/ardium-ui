import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStarModule } from '../star.module';
import { ArdiumStarButtonComponent } from './star-button.component';
import { ArdStarButtonStarTemplateDirective } from './star-button.directives';

@NgModule({
  declarations: [ArdiumStarButtonComponent, ArdStarButtonStarTemplateDirective],
  imports: [CommonModule, ArdiumStarModule],
  exports: [ArdiumStarButtonComponent, ArdStarButtonStarTemplateDirective],
})
export class ArdiumStarButtonModule {}
