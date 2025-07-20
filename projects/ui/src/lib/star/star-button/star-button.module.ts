import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdStarIconTemplateDirective } from '../star.directives';
import { ArdiumStarModule } from '../star.module';
import { ArdiumStarButtonComponent } from './star-button.component';

@NgModule({
  declarations: [ArdiumStarButtonComponent, ArdStarIconTemplateDirective],
  imports: [CommonModule, ArdiumStarModule],
  exports: [ArdiumStarButtonComponent, ArdStarIconTemplateDirective],
})
export class ArdiumStarButtonModule {}
