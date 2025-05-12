import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumCalendarComponent } from './calendar.component';
import { DaysViewComponent } from './views/days-view/days-view.component';

@NgModule({
  declarations: [ArdiumCalendarComponent],
  imports: [CommonModule, DaysViewComponent],
  exports: [ArdiumCalendarComponent],
})
export class ArdiumCalendarModule {}
