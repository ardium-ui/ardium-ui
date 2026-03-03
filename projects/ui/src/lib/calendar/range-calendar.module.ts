import { CommonModule, DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumRangeCalendarComponent } from './range-calendar.component';
import {
  ArdRangeCalendarDaysViewHeaderTemplateDirective,
  ArdRangeCalendarDayTemplateDirective,
  ArdRangeCalendarFloatingMonthTemplateDirective,
  ArdRangeCalendarMonthsViewHeaderTemplateDirective,
  ArdRangeCalendarMonthTemplateDirective,
  ArdRangeCalendarWeekdayTemplateDirective,
  ArdRangeCalendarYearsViewHeaderTemplateDirective,
  ArdRangeCalendarYearTemplateDirective,
} from './range-calendar.directives';
import { _CalendarViewsModule } from './views/calendar-views.module';

@NgModule({
  declarations: [
    ArdiumRangeCalendarComponent,
    // template directives
    ArdRangeCalendarDaysViewHeaderTemplateDirective,
    ArdRangeCalendarYearsViewHeaderTemplateDirective,
    ArdRangeCalendarMonthsViewHeaderTemplateDirective,
    ArdRangeCalendarWeekdayTemplateDirective,
    ArdRangeCalendarFloatingMonthTemplateDirective,
    ArdRangeCalendarYearTemplateDirective,
    ArdRangeCalendarMonthTemplateDirective,
    ArdRangeCalendarDayTemplateDirective,
  ],
  imports: [CommonModule, _CalendarViewsModule],
  exports: [
    ArdiumRangeCalendarComponent,
    // template directives
    ArdRangeCalendarDaysViewHeaderTemplateDirective,
    ArdRangeCalendarYearsViewHeaderTemplateDirective,
    ArdRangeCalendarMonthsViewHeaderTemplateDirective,
    ArdRangeCalendarWeekdayTemplateDirective,
    ArdRangeCalendarFloatingMonthTemplateDirective,
    ArdRangeCalendarYearTemplateDirective,
    ArdRangeCalendarMonthTemplateDirective,
    ArdRangeCalendarDayTemplateDirective,
  ],
  providers: [
    { provide: DATE_PIPE_DEFAULT_OPTIONS, useValue: { timezone: '+0000' } },
  ],
})
export class ArdiumRangeCalendarModule {}
