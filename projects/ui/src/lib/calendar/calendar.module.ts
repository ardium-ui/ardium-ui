import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumCalendarComponent } from './calendar.component';
import {
  ArdCalendarDaysViewHeaderTemplateDirective,
  ArdCalendarDayTemplateDirective,
  ArdCalendarFloatingMonthTemplateDirective,
  ArdCalendarMonthsViewHeaderTemplateDirective,
  ArdCalendarMonthTemplateDirective,
  ArdCalendarWeekdayTemplateDirective,
  ArdCalendarYearsViewHeaderTemplateDirective,
  ArdCalendarYearTemplateDirective,
} from './calendar.directives';
import { _CalendarViewsModule } from './views/calendar-views.module';

@NgModule({
  declarations: [
    ArdiumCalendarComponent,
    // template directives
    ArdCalendarDaysViewHeaderTemplateDirective,
    ArdCalendarYearsViewHeaderTemplateDirective,
    ArdCalendarMonthsViewHeaderTemplateDirective,
    ArdCalendarWeekdayTemplateDirective,
    ArdCalendarFloatingMonthTemplateDirective,
    ArdCalendarYearTemplateDirective,
    ArdCalendarMonthTemplateDirective,
    ArdCalendarDayTemplateDirective,
  ],
  imports: [CommonModule, _CalendarViewsModule],
  exports: [
    ArdiumCalendarComponent,
    // template directives
    ArdCalendarDaysViewHeaderTemplateDirective,
    ArdCalendarYearsViewHeaderTemplateDirective,
    ArdCalendarMonthsViewHeaderTemplateDirective,
    ArdCalendarWeekdayTemplateDirective,
    ArdCalendarFloatingMonthTemplateDirective,
    ArdCalendarYearTemplateDirective,
    ArdCalendarMonthTemplateDirective,
    ArdCalendarDayTemplateDirective,
  ],
  providers: [
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: '+0000' } },
  ],
})
export class ArdiumCalendarModule {}
