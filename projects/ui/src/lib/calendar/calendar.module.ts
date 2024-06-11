import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumButtonModule } from '../buttons/button/button.module';
import { ArdiumIconButtonModule } from '../buttons/icon-button/icon-button.module';
import { ArdiumIconModule } from './../icon/icon.module';
import { ArdiumCalendarComponent } from './calendar.component';

@NgModule({
  declarations: [ArdiumCalendarComponent],
  imports: [CommonModule, ArdiumButtonModule, ArdiumIconButtonModule, ArdiumIconModule],
  exports: [ArdiumCalendarComponent],
})
export class ArdiumCalendarModule {}
