import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStarModule } from '../star.module';
import { ArdiumStarDisplayComponent } from './star-display.component';
import { ArdStarDisplayStarTemplateDirective } from './star-display.directives';

@NgModule({
  declarations: [ArdiumStarDisplayComponent, ArdStarDisplayStarTemplateDirective],
  imports: [CommonModule, ArdiumStarModule],
  exports: [ArdiumStarDisplayComponent, ArdStarDisplayStarTemplateDirective],
})
export class ArdiumStarDisplayModule {}
