import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarPage } from './calendar.page';
// import { ArdiumCalendarModule } from '@ardium-ui/ui';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CalendarPage],
  imports: [CommonModule, FormsModule, /* ArdiumCalendarModule */],
})
export class CalendarModule {}
