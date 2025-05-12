import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ArdiumCalendarModule } from 'projects/ui/src/public-api';
import { CalendarPage } from './calendar.page';

@NgModule({
  declarations: [CalendarPage],
  imports: [CommonModule, FormsModule, ArdiumCalendarModule],
})
export class CalendarModule {}
