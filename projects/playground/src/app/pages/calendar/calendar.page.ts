import { Component } from '@angular/core';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {
  selectedDate: Date = new Date();

  eventsCalendarDate: Date | null = null;

  constructor(private LoggerService: Logger) {}
  log = this.LoggerService.log;

  minDate = new Date(new Date().getFullYear() - 3, 2, 8);
  maxDate = new Date(new Date().getFullYear() + 3, 9, 15);

  filterFn = (date: Date) => date.getDay() === 0 || date.getDay() === 6;
}
