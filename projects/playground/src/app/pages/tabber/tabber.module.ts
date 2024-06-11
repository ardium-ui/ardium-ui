import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabberPage } from './tabber.page';
import { ArdiumTabberModule } from 'projects/ui/src/public-api';

@NgModule({
  declarations: [TabberPage],
  imports: [CommonModule, ArdiumTabberModule],
})
export class TabberModule {}
