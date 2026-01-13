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
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-header-tmp]',
})
export class ArdRangeCalendarDaysViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarDaysViewHeaderContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-year-picker-header-tmp]',
})
export class ArdRangeCalendarYearsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearsViewHeaderContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-month-picker-header-tmp]',
})
export class ArdRangeCalendarMonthsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthsViewHeaderContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-weekday-tmp]',
})
export class ArdRangeCalendarWeekdayTemplateDirective {
  constructor(public template: TemplateRef<CalendarWeekdayContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-floating-month-tmp]',
})
export class ArdRangeCalendarFloatingMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarFloatingMonthContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-year-tmp]',
})
export class ArdRangeCalendarYearTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-month-tmp]',
})
export class ArdRangeCalendarMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-range-calendar > ng-template[ard-day-tmp]',
})
export class ArdRangeCalendarDayTemplateDirective {
  constructor(public template: TemplateRef<CalendarDayContext>) {}
}
