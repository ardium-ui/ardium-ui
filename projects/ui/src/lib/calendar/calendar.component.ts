import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  HostListener,
  Inject,
  input,
  model,
  signal,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { coerceNumberProperty } from '@ardium-ui/devkit';
import { isDefined } from 'simple-bool';
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

    effect(() => {
      this.selected(); // trigger effect
      this._emitChange();
    })
  }

  //! appearance
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly ngClasses = computed((): string => [`ard-color-${this.color()}`].join(' '));

  //! active view
  readonly activeView = model<ArdCalendarView>(this._DEFAULTS.activeView);
  readonly activeYear = model<number>(this._DEFAULTS.activeYear);
  readonly activeMonth = model<number>(this._DEFAULTS.activeMonth);

  readonly firstWeekday = input<number, any>(this._DEFAULTS.firstWeekday, {
    transform: v => {
      const value = coerceNumberProperty(v, this._DEFAULTS.firstWeekday);
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

  readonly multipleYearPageChangeModifier = input<number, any>(this._DEFAULTS.multipleYearPageChangeModifier, {
    transform: v => {
      const value = coerceNumberProperty(v, this._DEFAULTS.multipleYearPageChangeModifier);
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
    if (v instanceof Date) {
      this.selected.set(v);
    } else if (!isDefined(v)) {
      this.selected.set(null);
    } else {
      console.error(new Error(`ARD-NF2003: <ard-calendar> [writeValue] expected a Date or null, got "${v}".`));
    }
  }

  protected override _emitChange(): void {
    this._onChangeRegistered?.(this.selected());
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
