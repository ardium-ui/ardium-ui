import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    ArdiumBadgeModule,
    ArdiumButtonModule,
    ArdiumCheckboxModule,
    ArdiumRadioModule,
    ArdiumSegmentModule,
    ArdiumSelectModule,
    ArdiumSimpleInputModule,
} from 'projects/ui/src/public-api';
import { BadgePage } from './badge.page';

@NgModule({
  declarations: [BadgePage],
  imports: [
    CommonModule,
    ArdiumBadgeModule,
    ArdiumButtonModule,
    ArdiumSelectModule,
    ArdiumSegmentModule,
    ArdiumSimpleInputModule,
    ArdiumCheckboxModule,
    ArdiumRadioModule,
  ],
})
export class BadgeModule {}
