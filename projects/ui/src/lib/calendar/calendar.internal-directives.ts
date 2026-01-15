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

  readonly daysViewHeaderTmp = input<ArdCalendarDaysViewHeaderTemplateDirective | { template: TemplateRef<any> } | undefined>(
    undefined
  );
  readonly yearsViewHeaderTmp = input<ArdCalendarYearsViewHeaderTemplateDirective | { template: TemplateRef<any> } | undefined>(
    undefined
  );
  readonly monthsViewHeaderTmp = input<ArdCalendarMonthsViewHeaderTemplateDirective | { template: TemplateRef<any> } | undefined>(
    undefined
  );
  readonly weekdayTmp = input<ArdCalendarWeekdayTemplateDirective | { template: TemplateRef<any> } | undefined>(undefined);
  readonly floatingMonthTmp = input<ArdCalendarFloatingMonthTemplateDirective | { template: TemplateRef<any> } | undefined>(
    undefined
  );
  readonly yearTmp = input<ArdCalendarYearTemplateDirective | { template: TemplateRef<any> } | undefined>(undefined);
  readonly monthTmp = input<ArdCalendarMonthTemplateDirective | { template: TemplateRef<any> } | undefined>(undefined);
  readonly dayTmp = input<ArdCalendarDayTemplateDirective | { template: TemplateRef<any> } | undefined>(undefined);
}
