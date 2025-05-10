import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumCalendarComponent } from './calendar.component';

@NgModule({
  declarations: [ArdiumCalendarComponent],
  imports: [CommonModule],
  exports: [ArdiumCalendarComponent],
})
export class ArdiumCalendarModule {}
