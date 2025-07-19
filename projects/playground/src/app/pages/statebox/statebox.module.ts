import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumStateboxModule } from 'projects/ui/src/public-api';
import { StateboxPage } from './statebox.page';

@NgModule({
  declarations: [StateboxPage],
  imports: [CommonModule, ArdiumStateboxModule],
})
export class StateboxModule {}
