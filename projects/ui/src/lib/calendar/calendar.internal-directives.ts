import { Directive, input, TemplateRef } from '@angular/core';
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

@Directive({ standalone: true, selector: 'ard-calendar > ng-template[_ard-tmp-repository]' })
export class _CalendarTemplateRepositoryDirective {
  constructor(public template: TemplateRef<undefined>) {}

  readonly daysViewHeaderTmp = input<ArdCalendarDaysViewHeaderTemplateDirective | undefined>(undefined);
  readonly yearsViewHeaderTmp = input<ArdCalendarYearsViewHeaderTemplateDirective | undefined>(undefined);
  readonly monthsViewHeaderTmp = input<ArdCalendarMonthsViewHeaderTemplateDirective | undefined>(undefined);
  readonly weekdayTmp = input<ArdCalendarWeekdayTemplateDirective | undefined>(undefined);
  readonly floatingMonthTmp = input<ArdCalendarFloatingMonthTemplateDirective | undefined>(undefined);
  readonly yearTmp = input<ArdCalendarYearTemplateDirective | undefined>(undefined);
  readonly monthTmp = input<ArdCalendarMonthTemplateDirective | undefined>(undefined);
  readonly dayTmp = input<ArdCalendarDayTemplateDirective | undefined>(undefined);
}
