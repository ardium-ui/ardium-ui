import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconModule } from '../icon';
import { ArdiumStarComponent } from './star.component';
import { ArdStarIconTemplateDirective } from './star.directives';

@NgModule({
  declarations: [ArdiumStarComponent, ArdStarIconTemplateDirective],
  imports: [CommonModule, ArdiumIconModule],
exports: [ArdiumStarComponent, ArdStarIconTemplateDirective],
})
export class ArdiumStarModule {}
