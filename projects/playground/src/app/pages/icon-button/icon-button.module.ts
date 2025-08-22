import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  ArdiumCheckboxModule,
  ArdiumIconButtonModule,
  ArdiumIconModule,
  ArdiumSelectModule,
  ArdiumSimpleInputModule,
} from 'projects/ui/src/public-api';
import { IconButtonPage } from './icon-button.page';

@NgModule({
  declarations: [IconButtonPage],
  imports: [
    CommonModule,
    ArdiumIconButtonModule,
    ArdiumSelectModule,
    ArdiumSimpleInputModule,
    ArdiumCheckboxModule,
    ArdiumIconModule,
  ],
})
export class IconButtonModule {}
