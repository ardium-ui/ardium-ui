import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumIconModule, ArdiumOptionModule, ArdiumSelectModule } from '@ardium-ui/ui';
import { SelectPage } from './select.page';

@NgModule({
  declarations: [SelectPage],
  imports: [CommonModule, ArdiumSelectModule, ArdiumOptionModule, ArdiumIconModule],
})
export class SelectModule {}
