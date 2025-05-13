import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  HostListener,
  Inject,
  input,
  model,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { coerceNumberProperty } from '@ardium-ui/devkit';
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

  readonly firstWeekday = input<number, any>(1, {
    transform: v => {
      const value = coerceNumberProperty(v, 1);
      if (!Number.isInteger(value)) {
        console.error(
          new Error(`ARD-NF2001A: [firstWeekday] must be a positive integer, got "${value}". Using default value instead.`)
        );
        return 1;
      }
      if (value < 0 || value > 6) {
        console.error(
          new Error(
            `ARD-NF2001B: [firstWeekday] must be between 0 and 6, got "${value}". Using modulo operator to adjust the value.`
          )
        );
      }
      return value % 7;
    },
  });

  readonly multipleYearPageChangeModifier = input<number, any>(5, {
    transform: v => {
      const value = coerceNumberProperty(v, 5);
      if (!Number.isInteger(value) || value < 1) {
        console.error(
          new Error(
            `ARD-NF2002: [multipleYearPageChangeModifier] must be a positive integer, got "${value}". Using default value instead.`
          )
        );
        return 5;
      }
      return value;
    },
  });

  onTriggerOpenDaysView(): void {
    this.activeView.set(ArdCalendarView.Days);
  }
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

  //! internals
  readonly _isUsingKeyboard = signal<boolean>(false);
  @HostListener('document:mousemove')
  onDocumentMousemove(): void {
    this._isUsingKeyboard.set(false);
  }
  @HostListener('document:keydown')
  onDocumentKeydown(): void {
    this._isUsingKeyboard.set(true);
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
