import { Component } from '@angular/core';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss']
})
export class CalendarPage {

    selectedDate: Date = new Date(2024, 0, 1);

    constructor(private LoggerService: Logger) {}
    log = this.LoggerService.log;
}
