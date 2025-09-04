import { Directive, TemplateRef } from '@angular/core';
import {
  CalendarDayContext,
  CalendarDaysViewHeaderContext,
  CalendarFloatingMonthContext,
  CalendarMonthContext,
  CalendarMonthsViewHeaderContext,
  CalendarWeekdayContext,
  CalendarYearContext,
  CalendarYearsViewHeaderContext,
} from './calendar.types';

@Directive({
  selector: 'ard-calendar > ng-template[ard-header-tmp]',
})
export class ArdCalendarDaysViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarDaysViewHeaderContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-year-picker-header-tmp]',
})
export class ArdCalendarYearsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearsViewHeaderContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-month-picker-header-tmp]',
})
export class ArdCalendarMonthsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthsViewHeaderContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-weekday-tmp]',
})
export class ArdCalendarWeekdayTemplateDirective {
  constructor(public template: TemplateRef<CalendarWeekdayContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-floating-month-tmp]',
})
export class ArdCalendarFloatingMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarFloatingMonthContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-year-tmp]',
})
export class ArdCalendarYearTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-month-tmp]',
})
export class ArdCalendarMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-day-tmp]',
})
export class ArdCalendarDayTemplateDirective {
  constructor(public template: TemplateRef<CalendarDayContext>) {}
}
