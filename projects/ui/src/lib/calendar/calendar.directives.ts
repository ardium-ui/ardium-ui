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
  selector: 'ard-calendar > ng-template[ard-header-tmp]',
})
export class ArdCalendarDaysViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarDaysViewHeaderContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-calendar > ng-template[ard-year-picker-header-tmp]',
})
export class ArdCalendarYearsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearsViewHeaderContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-calendar > ng-template[ard-month-picker-header-tmp]',
})
export class ArdCalendarMonthsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthsViewHeaderContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-calendar > ng-template[ard-weekday-tmp]',
})
export class ArdCalendarWeekdayTemplateDirective {
  constructor(public template: TemplateRef<CalendarWeekdayContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-calendar > ng-template[ard-floating-month-tmp]',
})
export class ArdCalendarFloatingMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarFloatingMonthContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-calendar > ng-template[ard-year-tmp]',
})
export class ArdCalendarYearTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-calendar > ng-template[ard-month-tmp]',
})
export class ArdCalendarMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthContext>) {}
}

@Directive({
  standalone: false,
  selector: 'ard-calendar > ng-template[ard-day-tmp]',
})
export class ArdCalendarDayTemplateDirective {
  constructor(public template: TemplateRef<CalendarDayContext>) {}
}
