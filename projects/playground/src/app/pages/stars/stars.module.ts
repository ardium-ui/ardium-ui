import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStarButtonModule, ArdiumStarDisplayModule, ArdiumStarInputModule, ArdiumStarModule } from 'projects/ui/src/public-api';
import { StarsPage } from './stars.page';

@NgModule({
  declarations: [StarsPage],
  imports: [CommonModule, ArdiumStarModule, ArdiumStarButtonModule, ArdiumStarDisplayModule, ArdiumStarInputModule],
})
export class StarsModule {}
