import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  Inject,
  input,
  model,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ComponentColor } from '../types/colors.types';
import { ARD_CALENDAR_DEFAULTS, ArdCalendarDefaults } from './calendar.defaults';
import {
  ArdCalendarView,
  CalendarDayContext,
  CalendarDaysViewHeaderContext,
  CalendarFloatingMonthContext,
  CalendarMonthContext,
  CalendarMonthsViewHeaderContext,
  CalendarWeekdayContext,
  CalendarYearContext,
  CalendarYearsViewHeaderContext,
} from './calendar.types';

@Component({
  selector: 'ard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCalendarComponent extends _NgModelComponentBase {
  protected override readonly _DEFAULTS!: ArdCalendarDefaults;
  constructor(@Inject(ARD_CALENDAR_DEFAULTS) defaults: ArdCalendarDefaults) {
    super(defaults);
  }

  //! appearance
  readonly color = input<ComponentColor>(ComponentColor.Primary);

  readonly ngClasses = computed((): string => [`ard-color-${this.color()}`].join(' '));

  //! active view
  readonly activeView = model<ArdCalendarView>(ArdCalendarView.Days);
  readonly activeYear = model<number>(new Date().getFullYear());
  readonly activeMonth = model<number>(new Date().getMonth());

  readonly firstWeekday = input<number, number>(1, { transform: v => v % 7 });

  onTriggerOpenMonthsView(): void {
    this.activeView.set(ArdCalendarView.Months);
  }
  onTriggerOpenYearsView(): void {
    this.activeView.set(ArdCalendarView.Years);
  }

  //! value
  readonly selected = model<Date | null>(null);

  override writeValue(v: any): void {
    // TODO
  }

  protected override _emitChange(): void {
    // TODO
  }

  //! templates
  readonly yearsViewHeaderTemplate = contentChild<TemplateRef<CalendarYearsViewHeaderContext>>(TemplateRef);
  readonly monthsViewHeaderTemplate = contentChild<TemplateRef<CalendarMonthsViewHeaderContext>>(TemplateRef);
  readonly daysViewHeaderTemplate = contentChild<TemplateRef<CalendarDaysViewHeaderContext>>(TemplateRef);
  readonly floatingMonthTemplate = contentChild<TemplateRef<CalendarFloatingMonthContext>>(TemplateRef);
  readonly yearTemplate = contentChild<TemplateRef<CalendarYearContext>>(TemplateRef);
  readonly monthTemplate = contentChild<TemplateRef<CalendarMonthContext>>(TemplateRef);
  readonly dayTemplate = contentChild<TemplateRef<CalendarDayContext>>(TemplateRef);
  readonly weekdayTemplate = contentChild<TemplateRef<CalendarWeekdayContext>>(TemplateRef);
}
