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
}
