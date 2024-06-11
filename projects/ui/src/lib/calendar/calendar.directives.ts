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
  selector: 'ard-calendar > ng-template[ard-header-tmp], ard-datepicker > ng-template[ard-header-tmp]',
})
export class ArdDaysViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarDaysViewHeaderContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-year-picker-header-tmp], ard-datepicker > ng-template[ard-year-picker-header-tmp]',
})
export class ArdYearsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearsViewHeaderContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-month-picker-header-tmp], ard-datepicker > ng-template[ard-month-picker-header-tmp]',
})
export class ArdMonthsViewHeaderTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthsViewHeaderContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-weekday-tmp], ard-datepicker > ng-template[ard-weekday-tmp]',
})
export class ArdWeekdayTemplateDirective {
  constructor(public template: TemplateRef<CalendarWeekdayContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-floating-month-tmp], ard-datepicker > ng-template[ard-floating-month-tmp]',
})
export class ArdFloatingMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarFloatingMonthContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-year-tmp], ard-datepicker > ng-template[ard-year-tmp]',
})
export class ArdYearTemplateDirective {
  constructor(public template: TemplateRef<CalendarYearContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-month-tmp], ard-datepicker > ng-template[ard-month-tmp]',
})
export class ArdMonthTemplateDirective {
  constructor(public template: TemplateRef<CalendarMonthContext>) {}
}

@Directive({
  selector: 'ard-calendar > ng-template[ard-day-tmp], ard-datepicker > ng-template[ard-day-tmp]',
})
export class ArdDayTemplateDirective {
  constructor(public template: TemplateRef<CalendarDayContext>) {}
}
