import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ArdiumCheckboxModule,
    ArdiumFabModule,
    ArdiumIconModule,
    ArdiumSelectModule,
    ArdiumSimpleInputModule,
} from 'projects/ui/src/public-api';
import { FabPage } from './fab.page';

@NgModule({
  declarations: [FabPage],
  imports: [CommonModule, ArdiumFabModule, ArdiumIconModule, ArdiumSelectModule, ArdiumCheckboxModule, ArdiumSimpleInputModule],
})
export class FabModule {}
