import {
  computed,
  contentChild,
  Directive,
  effect,
  HostListener,
  input,
  linkedSignal,
  model,
  ModelSignal,
  OnChanges,
  output,
  Signal,
  signal,
  SimpleChanges
} from '@angular/core';
import { BooleanLike, coerceBooleanProperty, coerceDateProperty, coerceNumberProperty, NumberLike } from '@ardium-ui/devkit';
import { roundFromZero, roundToMultiple } from 'more-rounding';
import { isDefined, isNull } from 'simple-bool';
import { _FormFieldComponentBase } from '../_internal/form-field-component';
import { getUTCDate } from '../_internal/utils/date.utils';
import { ComponentColor } from '../types/colors.types';
import { ArdCalendarDefaults } from './calendar.defaults';
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
import { _CalendarTemplateRepositoryDirective } from './calendar.internal-directives';
import { ArdCalendarFilterFn, ArdCalendarView, ArdMultiCalendarLocation } from './calendar.types';
import { isDayOutOfRange } from './views/days-view/days-view.helpers';
import { isMonthOutOfRange } from './views/months-view/months-view.helpers';
import { isYearOutOfRange } from './views/years-view/years-view.helpers';

@Directive({})
export abstract class _AbstractCalendar<T> extends _FormFieldComponentBase implements OnChanges {
  abstract readonly componentId: string;
  abstract readonly componentName: string;

  abstract readonly isRangeSelector: boolean;

  protected override readonly _DEFAULTS!: ArdCalendarDefaults;
  constructor(defaults: ArdCalendarDefaults) {
    super(defaults);

    effect(() => {
      const value = this.valueInternalStart();
      if (isDefined(value)) {
        if (this._isHoursSetInDate(value)) {
          console.warn(
            `ARD-W${this.componentId}5: <ard-${this.componentName}> value contains time information (HH:MM:SS.ms). This will be ignored and only the date part will be used.`
          );
          this.valueInternalStart.set(this._createDate(value.getFullYear(), value.getMonth(), value.getDate()));
        }
      }
    });
  }

  readonly TODAY = computed<Date>(() => this._createDate(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()));

  //! appearance
  readonly color = input<ComponentColor>(this._DEFAULTS.color);

  readonly ngClasses = computed((): string => [`ard-color-${this.color()}`].join(' '));

  //! active view
  readonly activeView = model<ArdCalendarView>(this._DEFAULTS.activeView);
  readonly activeYear = model<number>(this._DEFAULTS.activeYear);
  readonly activeMonth = model<number>(this._DEFAULTS.activeMonth);

  readonly firstWeekday = input<number, NumberLike>(this._DEFAULTS.firstWeekday, {
    transform: v => {
      const value = coerceNumberProperty(v, this._DEFAULTS.firstWeekday);
      if (!Number.isInteger(value)) {
        console.error(
          new Error(
            `ARD-NF${this.componentId}1A: [firstWeekday] must be a positive integer, got "${value}". Using default value instead.`
          )
        );
        return this._DEFAULTS.firstWeekday;
      }
      if (value < 0 || value > 6) {
        console.error(
          new Error(
            `ARD-NF${this.componentId}1B: [firstWeekday] must be between 0 and 6, got "${value}". Using modulo operator to adjust the value.`
          )
        );
      }
      return value % 7;
    },
  });

  readonly multipleYearPageChangeModifier = input<number, NumberLike>(this._DEFAULTS.multipleYearPageChangeModifier, {
    transform: v => {
      const value = coerceNumberProperty(v, this._DEFAULTS.multipleYearPageChangeModifier);
      if (!Number.isInteger(value) || value < 1) {
        console.error(
          new Error(
            `ARD-NF${this.componentId}2: [multipleYearPageChangeModifier] must be a positive integer, got "${value}". Using default value instead.`
          )
        );
        return this._DEFAULTS.multipleYearPageChangeModifier;
      }
      return value;
    },
  });

  readonly multiCalendarLocation = input<ArdMultiCalendarLocation>(this._DEFAULTS.multiCalendarLocation);

  readonly autoFocus = input<boolean, BooleanLike>(this._DEFAULTS.autoFocus, { transform: v => coerceBooleanProperty(v) });
  readonly staticHeight = input<boolean, BooleanLike>(false, { transform: v => coerceBooleanProperty(v) });

  readonly onlyDaySelection = input<boolean, BooleanLike>(this._DEFAULTS.onlyDaySelection, { transform: v => coerceBooleanProperty(v) });

  onTriggerOpenDaysView(): void {
    this.activeView.set(ArdCalendarView.Days);
  }
  onTriggerOpenMonthsView(): void {
    if (this.onlyDaySelection()) {
      this.activeView.set(ArdCalendarView.Days);
    }
    this.activeView.set(ArdCalendarView.Months);
  }
  onTriggerOpenYearsView(): void {
    if (this.onlyDaySelection()) {
      this.activeView.set(ArdCalendarView.Days);
    }
    this.activeView.set(ArdCalendarView.Years);
  }

  //! value
  readonly valueInternalStart = signal<Date | null>(null);
  readonly valueInternalEnd = signal<Date | null>(null);

  abstract readonly endDate: Signal<Date | null>;

  abstract readonly value: ModelSignal<T | null>;

  readonly yearSelect = output<number>();
  readonly monthSelect = output<number>();

  readonly min = input<Date | null, any>(this._DEFAULTS.min, {
    transform: v => (v === null ? null : coerceDateProperty(v, this._DEFAULTS.min)),
  });
  readonly max = input<Date | null, any>(this._DEFAULTS.max, {
    transform: v => (v === null ? null : coerceDateProperty(v, this._DEFAULTS.max)),
  });

  readonly UTC = input<boolean, BooleanLike>(this._DEFAULTS.UTC, { transform: v => coerceBooleanProperty(v) });
  private readonly _UTCAfterInit = signal<boolean>(this._DEFAULTS.UTC);

  readonly filter = input<ArdCalendarFilterFn | null>(this._DEFAULTS.filter);

  abstract override writeValue(v: any): void;

  protected override _emitChange(): void {
    this._onChangeRegistered?.(this.value());
  }

  private _isHoursSetInDate(date: Date | null): boolean {
    if (!isDefined(date)) return false;
    if (this.UTC()) {
      return (
        date.getUTCHours() !== 0 || date.getUTCMinutes() !== 0 || date.getUTCSeconds() !== 0 || date.getUTCMilliseconds() !== 0
      );
    }
    return date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['UTC']) {
      if (changes['UTC'].firstChange) {
        this._UTCAfterInit.set(changes['UTC'].currentValue);
      } else {
        console.error(
          `ARD-NF${this.componentId}4: <ard-${this.componentName}>'s [UTC] attribute should not be changed dynamically. This change will be ignored.`
        );
      }
    }
    if (changes['value']) {
      this.writeValue(changes['value'].currentValue);
    }
  }

  //! selecting days
  isDayOutOfRange(day: number, month: number = this.activeMonth(), year: number = this.activeYear()): number {
    const dayDate = new Date(year, month, day);
    return isDayOutOfRange(dayDate, this.min(), this.max());
  }
  readonly isDayFilteredOut = computed(() => {
    return (day: number, month: number = this.activeMonth(), year: number = this.activeYear()): boolean => {
      return this.filter()?.(this._createDate(year, month, day)) ?? false;
    };
  });
  selectDay(day: number | Date | null): void {
    const startValue = this.valueInternalStart();
    // reset selection
    if (isNull(day)) {
      if (!isDefined(startValue)) return;

      this.valueInternalStart.set(null);
      this.valueInternalEnd.set(null);
      return;
    }

    if (day instanceof Date) day = day.getDate();
    // check if day is out of range or filtered out
    if ((day && this.isDayOutOfRange(day)) || this.isDayFilteredOut()(day)) return;

    // range selection logic
    const endValue = this.valueInternalEnd();
    const newDate = this._createDate(this.activeYear(), this.activeMonth(), day);
    if (this.isRangeSelector) {
      // select end date
      if (isDefined(startValue) && !isDefined(endValue) && newDate > startValue) {
        this.valueInternalEnd.set(newDate);
        return;
      }
      // reset end date and start a new selection
      this.valueInternalEnd.set(null);
    }
    // avoid setting the same date again
    if (
      startValue &&
      startValue.getFullYear() === this.activeYear() &&
      startValue.getMonth() === this.activeMonth() &&
      startValue.getDate() === day
    ) {
      return;
    }
    this.valueInternalStart.set(newDate);
  }
  selectCurrentlyHighlightedDay(): void {
    if (!isDefined(this.highlightedDay())) return;

    this.selectDay(this.highlightedDay());
  }

  //! highlighting days
  private readonly __highlightedDay = signal<number | null>(null);
  readonly highlightedDay = this.__highlightedDay.asReadonly();

  setHighlightedDay(day: number | null, month: number = this.activeMonth(), year: number = this.activeYear()): void {
    if (isNull(day)) {
      this.__highlightedDay.update(() => day);
      return;
    }
    const date = this._createDate(year, month, day);
    const outOfRange = this.isDayOutOfRange(day, month, year);

    if (outOfRange === -1) {
      this._highlightMinDay();
      return;
    }
    if (outOfRange === 1) {
      this._highlightMaxDay();
      return;
    }

    this.__highlightedDay.update(() => date.getDate());

    if (date.getFullYear() !== this.activeYear()) {
      this.activeYear.set(date.getFullYear());
    }
    if (date.getMonth() !== this.activeMonth()) {
      this.activeMonth.set(date.getMonth());
    }
  }

  private _highlightMinDay(): void {
    const min = this.min();
    if (!isDefined(min)) return;

    this.activeYear.set(min.getFullYear());
    this.activeMonth.set(min.getMonth());
    this.__highlightedDay.set(min.getDate());
  }
  private _highlightMaxDay(): void {
    const max = this.max();
    if (!isDefined(max)) return;

    this.activeYear.set(max.getFullYear());
    this.activeMonth.set(max.getMonth());
    this.__highlightedDay.set(max.getDate());
  }

  highlightNextDay(offset = 1): void {
    const currentDay = this.highlightedDay();
    const newDay = isDefined(currentDay) ? currentDay + offset : 1;
    this.setHighlightedDay(newDay);
  }
  highlightPreviousDay(offset = 1): void {
    this.highlightNextDay(offset * -1);
  }
  highlightFirstDay(): void {
    this.setHighlightedDay(1);
  }
  highlightLastDay(): void {
    const daysInMonth = this._createDate(this.activeYear(), this.activeMonth() + 1, 0).getDate();
    this.setHighlightedDay(daysInMonth);
  }
  highlightSameDayNextMonth(): void {
    const month = this.activeMonth();
    const year = this.activeYear();
    const newMonth = month + 1;
    const newYear = year + Math.floor(newMonth / 12);
    this.setHighlightedDay(this.highlightedDay(), newMonth % 12, newYear);
  }
  highlightSameDayPreviousMonth(): void {
    const month = this.activeMonth();
    const year = this.activeYear();
    const newMonth = month - 1;
    const newYear = year + Math.floor(newMonth / 12);
    this.setHighlightedDay(this.highlightedDay(), newMonth % 12, newYear);
  }
  highlightSameDayNextYear(): void {
    this.setHighlightedDay(this.highlightedDay(), this.activeMonth(), this.activeYear() + 1);
  }
  highlightSameDayPreviousYear(): void {
    this.setHighlightedDay(this.highlightedDay(), this.activeMonth(), this.activeYear() - 1);
  }

  //! selecting months
  isMonthSelected(month: number | Date): boolean {
    if (month instanceof Date) month = month.getMonth();
    return (
      this.valueInternalStart() !== null &&
      this.activeYear() === this.valueInternalStart()?.getFullYear() &&
      month === this.valueInternalStart()?.getMonth()
    );
  }
  isMonthOutOfRange(month: number, year: number = this.activeYear()): number {
    return isMonthOutOfRange(month, year, this.min(), this.max());
  }
  changeMonth(newMonth: number | null): boolean {
    if (isNull(newMonth)) {
      this.activeMonth.set(this.TODAY().getMonth());
      return true;
    }

    if (this.isMonthOutOfRange(newMonth)) return false;

    if (newMonth > 11) {
      this.activeMonth.set(0);
      this.activeYear.update(v => v + 1);
    } else if (newMonth < 0) {
      this.activeMonth.set(11);
      this.activeYear.update(v => v - 1);
    } else {
      this.activeMonth.set(newMonth);
    }

    return true;
  }
  selectMonth(newMonth: number | null): void {
    if (isNull(newMonth) || this.isMonthOutOfRange(newMonth)) return;

    const wasSuccessful = this.changeMonth(newMonth);
    if (!wasSuccessful) return;

    this.activeView.set(ArdCalendarView.Days);
    this.monthSelect.emit(newMonth);
  }
  selectCurrentlyHighlightedMonth(): void {
    if (!isDefined(this.highlightedMonth())) return;

    this.selectMonth(this.highlightedMonth()!);
  }

  //! highlighting months
  private readonly __highlightedMonth = signal<number | null>(null);
  readonly highlightedMonth = this.__highlightedMonth.asReadonly();

  setHighlightedMonth(month: number | null, year: number = this.activeYear()): void {
    if (isNull(month)) {
      this.__highlightedMonth.update(() => month);
      return;
    }
    const date = this._createDate(year, month, 15);
    const outOfRange = this.isMonthOutOfRange(month, year);

    if (outOfRange === -1) {
      this._highlightMinMonth();
      return;
    }
    if (outOfRange === 1) {
      this._highlightMaxMonth();
      return;
    }

    this.__highlightedMonth.update(() => date.getMonth());

    if (date.getFullYear() !== this.activeYear()) {
      this.activeYear.set(date.getFullYear());
    }
  }

  private _highlightMinMonth(): void {
    const min = this.min();
    if (!isDefined(min)) return;

    this.activeYear.set(min.getFullYear());
    this.__highlightedMonth.set(min.getMonth());
  }
  private _highlightMaxMonth(): void {
    const max = this.max();
    if (!isDefined(max)) return;

    this.activeYear.set(max.getFullYear());
    this.__highlightedMonth.set(max.getMonth());
  }

  highlightNextMonth(offset = 1): void {
    const currentMonth = this.highlightedMonth();
    const newMonth = isDefined(currentMonth) ? currentMonth + offset : 0;
    this.setHighlightedMonth(newMonth);
  }
  highlightPreviousMonth(offset = 1): void {
    this.highlightNextMonth(offset * -1);
  }
  highlightFirstMonth(): void {
    this.setHighlightedMonth(0);
  }
  highlightLastMonth(): void {
    this.setHighlightedMonth(11);
  }
  highlightSameMonthNextYear(multiple: boolean): void {
    this.setHighlightedMonth(this.highlightedMonth(), this.activeYear() + (multiple ? 10 : 1));
  }
  highlightSameMonthPreviousYear(multiple: boolean): void {
    this.setHighlightedMonth(this.highlightedMonth(), this.activeYear() - (multiple ? 10 : 1));
  }

  //! selecting years
  isYearSelected(year: number | Date): boolean {
    if (year instanceof Date) year = year.getFullYear();
    return this.valueInternalStart() !== null && year === this.valueInternalStart()?.getFullYear();
  }
  isYearOutOfRange(year: number): number {
    return isYearOutOfRange(year, this.min(), this.max());
  }
  changeYear(year: number | null): boolean {
    if (isNull(year)) {
      this.activeYear.set(this.TODAY().getFullYear());
      return true;
    }

    if (this.isYearOutOfRange(year)) return false;

    this.activeYear.set(year);

    return true;
  }
  selectYear(year: number | Date | null): void {
    if (isNull(year)) return;
    if (year instanceof Date) year = year.getFullYear();

    const wasSuccessful = this.changeYear(year);
    if (!wasSuccessful) return;

    this.activeView.set(ArdCalendarView.Months);
    this.yearSelect.emit(year);
  }
  selectCurrentlyHighlightedYear(): void {
    if (!isDefined(this.highlightedYear())) return;

    this.selectYear(this.highlightedYear()!);
  }

  //! highlighting years
  private readonly __highlightedYear = signal<number | null>(null);
  readonly highlightedYear = this.__highlightedYear.asReadonly();

  readonly currentYearRangeStart = linkedSignal<number>(() => {
    const rangeStartForCurrentYear = this.TODAY().getFullYear() - (this.TODAY().getFullYear() % 4) - 8; // current year always in 3rd row

    const activeYear = this.activeYear();

    const offset = roundToMultiple(activeYear - rangeStartForCurrentYear + 1, 24, 'up') - 24; // check how many 24-year pages need to be turned

    return rangeStartForCurrentYear + offset;
  });

  setHighlightedYear(year: number | null): void {
    if (isNull(year)) {
      this.__highlightedYear.update(() => year);
      return;
    }
    const date = this._createDate(year, 0, 1);
    const outOfRange = this.isYearOutOfRange(year);

    if (outOfRange === -1) {
      this._highlightMinYear();
      return;
    }
    if (outOfRange === 1) {
      this._highlightMaxYear();
      return;
    }

    const newYear = date.getFullYear();
    this.__highlightedYear.update(() => newYear);

    if (newYear < this.currentYearRangeStart() || newYear >= this.currentYearRangeStart() + 24) {
      // round the offset away from zero: 0.1 -> 1, -0.1 -> -1
      // this is to ensure the range start is always shifted by 24 years
      const offset = roundFromZero((newYear - this.currentYearRangeStart()) / 24);
      this.currentYearRangeStart.update(v => v + offset * 24);
    }
  }

  changeYearsViewPage(offset: number): void {
    const newYearRangeStart = this.currentYearRangeStart() + offset * 24;
    this.currentYearRangeStart.set(newYearRangeStart);
  }

  private _highlightMinYear(): void {
    const min = this.min();
    if (!isDefined(min)) return;

    this.__highlightedYear.set(min.getFullYear());
  }
  private _highlightMaxYear(): void {
    const max = this.max();
    if (!isDefined(max)) return;

    this.__highlightedYear.set(max.getFullYear());
  }

  highlightNextYear(offset = 1): void {
    const currentYear = this.highlightedYear();
    const newYear = isDefined(currentYear) ? currentYear + offset : null;
    this.setHighlightedYear(newYear);
  }
  highlightPreviousYear(offset = 1): void {
    this.highlightNextYear(offset * -1);
  }
  highlightFirstYear(): void {
    this.setHighlightedYear(this.currentYearRangeStart());
  }
  highlightLastYear(): void {
    this.setHighlightedYear(this.currentYearRangeStart() + 23); // 24 years per page
  }
  highlightSameYearNextPage(multiple: boolean): void {
    const year = this.highlightedYear() ?? this.currentYearRangeStart();
    this.setHighlightedYear(year + (multiple ? 60 : 24));
  }
  highlightSameYearPreviousPage(multiple: boolean): void {
    const year = this.highlightedYear() ?? this.currentYearRangeStart();
    this.setHighlightedYear(year - (multiple ? 60 : 24));
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

  private _createDate(year: number, monthIndex: number, day: number): Date {
    if (this._UTCAfterInit()) {
      return getUTCDate(year, monthIndex, day);
    }
    return new Date(year, monthIndex, day);
  }

  //! templates
  readonly templateRepository = contentChild(_CalendarTemplateRepositoryDirective);

  readonly yearsViewHeaderTemplate = contentChild(ArdCalendarYearsViewHeaderTemplateDirective);
  readonly monthsViewHeaderTemplate = contentChild(ArdCalendarMonthsViewHeaderTemplateDirective);
  readonly daysViewHeaderTemplate = contentChild(ArdCalendarDaysViewHeaderTemplateDirective);
  readonly floatingMonthTemplate = contentChild(ArdCalendarFloatingMonthTemplateDirective);
  readonly yearTemplate = contentChild(ArdCalendarYearTemplateDirective);
  readonly monthTemplate = contentChild(ArdCalendarMonthTemplateDirective);
  readonly dayTemplate = contentChild(ArdCalendarDayTemplateDirective);
  readonly weekdayTemplate = contentChild(ArdCalendarWeekdayTemplateDirective);
}
