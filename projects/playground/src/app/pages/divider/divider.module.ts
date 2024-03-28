import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerPage } from './divider.page';
import { ArdiumDividerModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [DividerPage],
  imports: [CommonModule, ArdiumDividerModule],
})
export class DividerModule {}
