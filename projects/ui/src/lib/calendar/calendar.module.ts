import { CommonModule } from '@angular/common';
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
})
export class ArdiumCalendarModule {}
