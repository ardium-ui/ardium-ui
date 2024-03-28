import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StateboxPage } from './statebox.page';
import { ArdiumStateboxModule } from '@ardium-ui/ui';

@NgModule({
  declarations: [StateboxPage],
  imports: [CommonModule, ArdiumStateboxModule],
})
export class StateboxModule {}
