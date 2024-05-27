import { ThisReceiver } from '@angular/compiler';
import { OnChanges, SimpleChanges, forwardRef } from '@angular/core';
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewEncapsulation,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { roundToMultiple } from 'more-rounding';
import { isDefined, isNull } from 'simple-bool';
import { ComponentColor } from '../types/colors.types';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import {
  ArdDaysViewHeaderTemplateDirective,
  ArdDayTemplateDirective,
  ArdFloatingMonthTemplateDirective,
  ArdMonthsViewHeaderTemplateDirective,
  ArdMonthTemplateDirective,
  ArdWeekdayTemplateDirective,
  ArdYearsViewHeaderTemplateDirective,
  ArdYearTemplateDirective,
} from './calendar.directives';
import { getMonthLayout } from './calendar.helpers';
import {
  CalendarView,
  CalendarDayContext,
  CalendarDaysViewHeaderContext,
  CalendarFloatingMonthContext,
  CalendarMonthContext,
  CalendarMonthsViewHeaderContext,
  CalendarWeekdayContext,
  CalendarYearContext,
  CalendarYearsViewHeaderContext,
  DateRange,
} from './calendar.types';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

function isLeapYear(year: number): boolean {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
}

@Component({
  selector: 'ard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumCalendarComponent),
      multi: true,
    },
  ],
})
export class ArdiumCalendarComponent extends _NgModelComponentBase implements OnInit, OnChanges {
  ngOnInit(): void {
    this._updateCalendarArray();
    this._updateWeekdayArray();
    this._updateDisplayedYearRangeStart();
  }
  private _wasSelectedChecked: boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
    if (this._wasSelectedChecked) return;
    this._wasSelectedChecked = true;

    if (changes['selected']) {
      const v = this.selected;
      if (isNull(v)) return;

      this.activeDate = new Date(v.getFullYear(), v.getMonth(), 1);
    }
  }

  //! determining today state
  todayDate: Date = new Date();

  isDayToday(day: number | null): boolean {
    return this.activeYear == this.todayDate.getFullYear() && this.activeMonth == this.todayDate.getMonth() && day == this.todayDate.getDate();
  }
  isMonthToday(month: number): boolean {
    return this.activeYear == this.todayDate.getFullYear() && month == this.todayDate.getMonth();
  }
  isYearToday(year: number): boolean {
    return year == this.todayDate.getFullYear();
  }

  //! determining if an entry is selected
  isDaySelected(day: number | Date | null): boolean {
    if (day instanceof Date) day = day.getDate();
    return (
      this.selected != null && this.activeYear == this.selected.getFullYear() && this.activeMonth == this.selected.getMonth() && day == this.selected.getDate()
    );
  }
  isMonthSelected(month: number | Date): boolean {
    if (month instanceof Date) month = month.getMonth();
    return this.selected != null && this.activeYear == this.selected.getFullYear() && month == this.selected.getMonth();
  }
  isYearSelected(year: number | Date): boolean {
    if (year instanceof Date) year = year.getFullYear();
    return this.selected != null && year == this.selected.getFullYear();
  }

  //! color & wrapper classes
  @Input() color: ComponentColor = ComponentColor.Primary;

  get ngClasses(): string {
    return [`ard-color-${this.color}`, this.nointeract ? 'ard-calendar-nointeract' : '', this.staticHeight ? 'ard-calendar-static-height' : ''].join(' ');
  }

  //! open year & month setters
  //pick a year range start so that the today date is always in the 3rd row
  private readonly todayYearRangeStart: number = this.todayDate.getFullYear() - (this.todayDate.getFullYear() % 4) - 8;

  displayedYearRangeStart: number = this.todayYearRangeStart;

  private _updateDisplayedYearRangeStart(forcedYear?: number): void {
    if (isDefined(forcedYear)) this.displayedYearRangeStart = forcedYear;

    //add the difference between the active year and the start of the range for the current year
    //rounded to a multiple of 24, towards the number zero
    //the difference may be negative, if the active year is before todayYearRangeStart
    this.displayedYearRangeStart = this.todayYearRangeStart + roundToMultiple(this.activeYear - this.todayYearRangeStart, 24, 'to_zero');
  }

  yearRangeArrayCache: number[] | null = null;
  get yearRangeArray(): number[] {
    if (!this.yearRangeArrayCache) {
      let yearRangeStart = this.displayedYearRangeStart;
      const newArray = new Array(24).map(() => yearRangeStart++);
      this.yearRangeArrayCache = newArray;
    }
    return this.yearRangeArrayCache;
  }

  protected _activeDate: Date = new Date(this.todayDate.getFullYear(), this.todayDate.getMonth(), this.todayDate.getDate());
  set activeDate(v: Date | string | number) {
    const newDate = new Date(v);
    if (this.activeYear != newDate.getFullYear()) this.yearRangeArrayCache = null;
    this._activeDate = newDate;

    this._updateCalendarArray();
  }
  get activeDate(): Date {
    return this._activeDate;
  }

  get activeYear(): number {
    return this._activeDate.getFullYear();
  }
  @Input()
  set activeYear(v: any) {
    const year = coerceNumberProperty(v, new Date().getFullYear());
    this._activeDate.setFullYear(year);
    this.activeDate = new Date(year, this.activeMonth, 1);
    this.yearRangeArrayCache = null;

    this._updateCalendarArray();
  }

  get activeMonth(): number {
    return this._activeDate.getMonth();
  }
  @Input()
  set activeMonth(v: any) {
    const month = coerceNumberProperty(v, new Date().getMonth());
    const oldDateYear = this.activeYear;
    this.activeDate = new Date(this.activeYear, month, 1);
    if (oldDateYear != this.activeYear) this.yearRangeArrayCache = null;

    this._updateCalendarArray();
  }
  //! selection functions
  protected _selected: Date | null = null;
  @Input()
  set selected(v: any) {
    this.writeValue(v);
  }
  get selected(): Date | null {
    return this._selected;
  }

  writeValue(v: any): void {
    if (typeof v == 'string') {
      //try to see if it is an array of numbers separated by a comma
      const vAsArray1 = v.split(',').map(v => Number(v));
      if (vAsArray1.length >= 1 && vAsArray1.length <= 3 && vAsArray1.every(v => !isNaN(v))) {
        v = new Date(vAsArray1[0], vAsArray1[1] ?? 0, vAsArray1[2] ?? 1);
      } else {
        //try to see if it is an array of numbers separated by some whitespace
        const vAsArray2 = v.split(/\s/).map(v => Number(v));
        if (vAsArray2.length >= 1 && vAsArray2.length <= 3 && vAsArray2.every(v => !isNaN(v))) {
          v = new Date(vAsArray2[0], vAsArray2[1] ?? 0, vAsArray2[2] ?? 1);
        } else {
          v = new Date(v);
        }
      }
    }
    //is a Date object && does not contain an error
    if (v instanceof Date && !isNaN(v.valueOf())) {
      this._selected = v;
      return;
    }
    if (v == null) {
      this._selected = null;
      return;
    }
    console.warn(`ARD-NF2000: Could not parse [selected] value on <ard-calendar>, as it is not a valid value. Provided value: "${v}"`);
    this._selected = null;
  }

  //! output events
  @Output() yearSelected = new EventEmitter<number>();
  @Output() monthSelected = new EventEmitter<number>();

  @Output() selectedChange = new EventEmitter<Date | null>();
  @Output() activeYearChange = new EventEmitter<number>();
  @Output() activeMonthChange = new EventEmitter<number>();

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output('change') changeEvent = new EventEmitter<Date | null>();

  protected _emitChange(): void {
    const v = this.selected;
    this._onChangeRegistered?.(v);
    this.selectedChange.emit(v);
    this.changeEvent.emit(v);
  }

  //! calendar entry hover & click
  private _highlightedDay: number | null = null;
  get highlightedDay(): number | null {
    return this._highlightedDay;
  }
  set highlightedDay(v: number | null) {
    if (isNull(v)) {
      this._highlightedDay = v;
      return;
    }
    const date = new Date(this.activeYear, this.activeMonth, v);
    this._highlightedDay = date.getDate();
  }

  setHighlightedDayAdjustDate(day: number): void {
    this.highlightedDay = day;

    const date = new Date(this.activeYear, this.activeMonth, day);

    if (this.activeYear != date.getFullYear()) this.activeYear = date.getFullYear();

    if (this.activeMonth != date.getMonth()) this.activeMonth = date.getMonth();
  }

  private _highlightedMonth: number | null = null;
  get highlightedMonth(): number | null {
    return this._highlightedMonth;
  }
  set highlightedMonth(v: number | null) {
    if (isNull(v)) {
      this._highlightedMonth = v;
      return;
    }
    const date = new Date(this.activeYear, v, 1);
    this._highlightedMonth = date.getMonth();
  }

  setHighlightedMonthAdjustDate(month: number): void {
    this.highlightedMonth = month;

    const date = new Date(this.activeYear, month, 1);

    if (this.activeYear != date.getFullYear()) this.activeYear = date.getFullYear();
  }

  private _highlightedYear: number | null = null;
  get highlightedYear(): number | null {
    return this._highlightedYear;
  }
  set highlightedYear(v: number | null) {
    this._highlightedYear = v;
  }

  setHighlightedYearAdjustPage(year: number): void {
    this.highlightedYear = year;

    if (year < this.displayedYearRangeStart || year >= this.displayedYearRangeStart + 24) {
      //add the difference between the highlighted year and the displayed range start year
      //rounded to a multiple of 24, away from the number zero
      //the difference may be negative, if the first if condition is met
      this.displayedYearRangeStart += roundToMultiple(year - this.displayedYearRangeStart, 24, 'from_zero');
    }
  }

  get currentAriaLabel(): string {
    return new Date(this.activeYear, this.activeMonth, this.highlightedDay ?? 1).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  onCalendarDayMouseover(day: number | null): void {
    if (day == null) return;
    if (this._isUsingKeyboard) return;

    this.highlightedDay = day;
  }
  onCalendarMonthMouseover(month: number): void {
    if (this._isUsingKeyboard) return;

    this.highlightedMonth = month;
  }
  onCalendarYearMouseover(year: number): void {
    if (this._isUsingKeyboard) return;

    this.highlightedYear = year;
  }

  private _isUsingKeyboard: boolean = false;
  @HostListener('document:mousemove')
  onDocumentMousemove(): void {
    if (!this._isUsingKeyboard) this.highlightedDay = null;

    this._isUsingKeyboard = false;
  }
  @HostListener('document:keydown')
  onDocumentKeydown(): void {
    this._isUsingKeyboard = true;
  }

  onCalendarDayClick(day: number | null): void {
    if (day == null) return;

    this.selectDay(day);

    this.focus();
    this.highlightedDay = day;
  }
  onCalendarMonthClick(month: number): void {
    this.selectMonth(month);
  }
  onCalendarYearClick(year: number): void {
    this.selectYear(year);
  }

  onDayGridFocus(): void {
    this.highlightedDay = 1;
  }
  onDayGridBlur(): void {
    this.highlightedDay = null;
  }
  onDayGridClick(): void {
    this.highlightedDay ??= 1;
  }

  onMonthGridFocus(): void {
    this.highlightedMonth = 0;
  }
  onMonthGridBlur(): void {
    this.highlightedMonth = null;
  }
  onMonthGridClick(): void {
    this.highlightedMonth ??= 0;
  }

  onYearGridFocus(): void {
    this.highlightedYear = this.displayedYearRangeStart;
  }
  onYearGridBlur(): void {
    this.highlightedYear = null;
  }
  onYearGridClick(): void {
    this.highlightedYear ??= this.displayedYearRangeStart;
  }

  //! main grid keyboard controls
  onMainGridKeydown(event: KeyboardEvent): void {
    switch (event.code) {
      case 'Space':
      case 'Enter':
        this._onEnterPress(event);
        break;
      case 'ArrowUp':
        this._onArrowUpPress(event);
        break;
      case 'ArrowDown':
        this._onArrowDownPress(event);
        break;
      case 'ArrowLeft':
        this._onArrowLeftPress(event);
        break;
      case 'ArrowRight':
        this._onArrowRightPress(event);
        break;
      case 'Home':
        this._onHomePress(event);
        break;
      case 'End':
        this._onEndPress(event);
        break;
      case 'PageUp':
        this._onPageUpPress(event);
        break;
      case 'PageDown':
        this._onPageDownPress(event);
        break;

      default:
        return;
    }
  }
  //select currently selected entry
  private _onEnterPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.selectCurrentlyHighlighted();
  }
  //highlight the entry one line above
  private _onArrowUpPress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        this.highlightPreviousDay(7);
        break;
      case CalendarView.Months:
        this.highlightPreviousMonth(3); //3 months per line
        break;
      case CalendarView.Years:
        this.highlightPreviousYear(4); //4 years per line
        break;
    }
  }
  //highlight the entry one line below
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        this.highlightNextDay(7);
        break;
      case CalendarView.Months:
        this.highlightNextMonth(3); //3 months per line
        break;
      case CalendarView.Years:
        this.highlightNextYear(4); //4 years per line
        break;
    }
  }
  //highlight previous entry
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        this.highlightPreviousDay();
        break;
      case CalendarView.Months:
        this.highlightPreviousMonth();
        break;
      case CalendarView.Years:
        this.highlightPreviousYear();
        break;
    }
  }
  //highlight next entry
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        this.highlightNextDay();
        break;
      case CalendarView.Months:
        this.highlightNextMonth();
        break;
      case CalendarView.Years:
        this.highlightNextYear();
        break;
    }
  }
  //highlight first entry on the page
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        this.highlightFirstDay();
        break;
      case CalendarView.Months:
        this.highlightFirstMonth();
        break;
      case CalendarView.Years:
        this.highlightFirstYear();
        break;
    }
  }
  //highlight last entry on the page
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        this.highlightLastDay();
        break;
      case CalendarView.Months:
        this.highlightLastMonth();
        break;
      case CalendarView.Years:
        this.highlightLastYear();
        break;
    }
  }
  //alone: highlight same entry on the previous page
  //with alt: highlight same entry multiple pages before (days view: 12 pages, months view: 10 pages, years view: 5 pages)
  private _onPageUpPress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        if (event.altKey) this.highlightSameDayPreviousYear();
        else this.highlightSameDayPreviousMonth();
        break;
      case CalendarView.Months:
        this.highlightSameMonthPreviousYear(event.altKey);
        break;
      case CalendarView.Years:
        this.highlightSameYearPreviousPage(event.altKey);
        break;
    }
  }
  //alone: highlight same entry on the next page
  //with alt: highlight same entry multiple pages after (days view: 12 pages, months view: 10 pages, years view: 5 pages)
  private _onPageDownPress(event: KeyboardEvent): void {
    event.preventDefault();
    switch (this.activeView) {
      case CalendarView.Days:
        if (event.altKey) this.highlightSameDayNextYear();
        else this.highlightSameDayNextMonth();
        break;
      case CalendarView.Months:
        this.highlightSameMonthNextYear(event.altKey);
        break;
      case CalendarView.Years:
        this.highlightSameYearNextPage(event.altKey);
        break;
    }
  }
  //! manipulation methods
  //selecting
  selectDay(day: number | Date | null): void {
    if (this.isDaySelected(day)) return;
    if (isNull(day)) {
      if (!isDefined(this.selected)) return;

      this.selected = null;
      this._emitChange();
      return;
    }

    if (day instanceof Date) day = day.getDate();

    this.selected = new Date(this.activeYear, this.activeMonth, day);
    this._emitChange();
  }
  selectMonth(month: number | Date | null): void {
    if (isNull(month)) {
      this.activeMonth = null;
      return;
    }
    if (month instanceof Date) month = month.getMonth();

    this.activeMonth = month;

    this.activeMonthChange.emit(month);
    this.monthSelected.emit(month);

    this.openDaysView();
  }
  selectYear(year: number | Date | null): void {
    if (isNull(year)) {
      this.activeYear = null;
      return;
    }
    if (year instanceof Date) year = year.getFullYear();

    this.activeYear = year;

    this.activeYearChange.emit(year);
    this.yearSelected.emit(year);

    this.openMonthsView();
  }
  selectCurrentlyHighlighted(): void {
    if (!isDefined(this.highlightedDay)) return;

    switch (this.activeView) {
      case CalendarView.Days:
        this.selectDay(this.highlightedDay);
        return;
      case CalendarView.Months:
        this.selectMonth(this.highlightedMonth);
        return;
      case CalendarView.Years:
        this.selectYear(this.highlightedYear);
        return;

      default:
        return;
    }
  }
  //active months/years
  changeMonth(offset: number): void {
    const oldyear = this.activeYear;
    this.activeMonth += offset;

    if (this.activeYear != oldyear) this.activeYearChange.emit(this.activeYear);
    this.activeMonthChange.emit(this.activeMonth);
  }
  changeYear(offset: number): void {
    this.activeYear += offset;

    this.activeYearChange.emit(this.activeYear);
  }
  //changing year page
  changeYearsViewPage(pages: number): void {
    this.displayedYearRangeStart += 24 * pages;
  }
  //next/prev highlighting
  highlightNextDay(offset: number = 1): void {
    const currentDay = this.highlightedDay;
    if (!isDefined(currentDay)) {
      this.highlightedDay = 1;
      return;
    }
    this.setHighlightedDayAdjustDate(currentDay + offset);
  }
  highlightPreviousDay(offset: number = 1): void {
    this.highlightNextDay(offset * -1);
  }
  highlightNextMonth(offset: number = 1): void {
    const currentMonth = this.highlightedMonth;
    if (!isDefined(currentMonth)) {
      this.highlightedMonth = 0;
      return;
    }
    this.setHighlightedMonthAdjustDate(currentMonth + offset);
  }
  highlightPreviousMonth(offset: number = 1): void {
    this.highlightNextMonth(offset * -1);
  }
  highlightNextYear(offset: number = 1): void {
    const currentYear = this.highlightedYear;
    if (!isDefined(currentYear)) {
      this.highlightedYear = 0;
      return;
    }
    this.setHighlightedYearAdjustPage(currentYear + offset);
  }
  highlightPreviousYear(offset: number = 1): void {
    this.highlightNextYear(offset * -1);
  }
  //first/last highlighting
  highlightFirstDay(): void {
    this.highlightedDay = 1;
  }
  highlightLastDay(): void {
    switch (this.activeMonth + 1) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        this.highlightedDay = 31;
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        this.highlightedDay = 30;
        break;
      case 2:
        if (isLeapYear(this.activeYear)) this.highlightedDay = 29;
        else this.highlightedDay = 28;
    }
  }
  highlightFirstMonth(): void {
    this.highlightedMonth = 0;
  }
  highlightLastMonth(): void {
    this.highlightedMonth = 11;
  }
  highlightFirstYear(): void {
    this.highlightedYear = this.displayedYearRangeStart;
  }
  highlightLastYear(): void {
    this.highlightedYear = this.displayedYearRangeStart + 23; //24 years per page
  }
  //same day next/prev month/year
  highlightSameDayNextMonth(): void {
    this.activeMonth++;

    this._fixDateAfterMonthChange();
  }
  highlightSameDayPreviousMonth(): void {
    this.activeMonth--;

    this._fixDateAfterMonthChange();
  }
  private _fixDateAfterMonthChange(): void {
    switch (this.activeMonth + 1) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        //do nothing
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        //only do if day is 31
        if (this.highlightedDay == 31) this.highlightedDay = 30;
        break;
      case 2: {
        //skip if below 29 or null
        if (!this.highlightedDay || this.highlightedDay < 29) break;

        if (isLeapYear(this.activeYear)) this.highlightedDay = 29;
        else this.highlightedDay = 28;
      }
    }
  }
  highlightSameDayNextYear(): void {
    this.activeYear++;

    this._fixDateAfterYearChange();
  }
  highlightSameDayPreviousYear(): void {
    this.activeYear--;

    this._fixDateAfterYearChange();
  }
  private _fixDateAfterYearChange(): void {
    if (this.highlightedDay != 29) return; //skip if not 29th day is selected
    if (isLeapYear(this.activeYear)) return; //skip if nea year is a leap year
    if (this.activeMonth != 1) return; //skip if not february

    this.highlightedDay = 28;
  }
  //same month next/prev year
  highlightSameMonthNextYear(multiple: boolean): void {
    this.activeYear += multiple ? 10 : 1;
  }
  highlightSameMonthPreviousYear(multiple: boolean): void {
    this.activeYear -= multiple ? 10 : 1;
  }
  //same year next/prev page(s)
  highlightSameYearNextPage(multiple: boolean): void {
    if (!isDefined(this.highlightedYear)) {
      this.highlightedYear = this.displayedYearRangeStart;
      return;
    }

    this.setHighlightedYearAdjustPage(this.highlightedYear + (multiple ? 60 : 24));
  }
  highlightSameYearPreviousPage(multiple: boolean): void {
    if (!isDefined(this.highlightedYear)) {
      this.highlightedYear = this.displayedYearRangeStart;
      return;
    }

    this.setHighlightedYearAdjustPage(this.highlightedYear - (multiple ? 60 : 24));
  }

  //! settings
  protected _firstWeekday: number = 1;
  @Input()
  get firstWeekday(): number {
    return this._firstWeekday;
  }
  set firstWeekday(v: any) {
    this._firstWeekday = coerceNumberProperty(v, 1) % 7;

    this._updateCalendarArray();
    this._updateWeekdayArray();
  }

  protected _nointeract: boolean = false;
  @Input()
  get nointeract(): boolean {
    return this._nointeract || this.disabled;
  }
  set nointeract(v: any) {
    this._nointeract = coerceBooleanProperty(v);
  }

  protected _staticHeight: boolean = false;
  @Input()
  get staticHeight(): boolean {
    return this._staticHeight;
  }
  set staticHeight(v: any) {
    this._staticHeight = coerceBooleanProperty(v);
  }

  //! calendar array
  //days view array
  calendarArray!: (number | null)[][];

  reserveTopRow!: boolean;

  protected _updateCalendarArray(): void {
    const resultObj = getMonthLayout(this._activeDate, this.firstWeekday);

    this.reserveTopRow = resultObj.leadingSpaces < 3;
    this.calendarArray = resultObj.array;
  }

  //months view array
  readonly monthsArray: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  //years view array
  private _yearsArrayCache: number[] | null = null;
  private _yearsArrayCacheStartYear: number | null = null;
  getYearsArray(): number[] {
    const year = this.displayedYearRangeStart;

    if (this._yearsArrayCacheStartYear == year && isDefined(this._yearsArrayCache)) return this._yearsArrayCache;

    const newArray: number[] = [];

    for (let i = year; i < year + 24; i++) {
      newArray.push(i);
    }

    this._yearsArrayCache = newArray;
    this._yearsArrayCacheStartYear = year;
    return newArray;
  }

  //! weekday array
  weekdayArray!: number[];

  protected _updateWeekdayArray(): void {
    this.weekdayArray = [0, 1, 2, 3, 4, 5, 6].map(v => (v + this.firstWeekday) % 7);
  }

  //! change view functions
  activeView: CalendarView = CalendarView.Days;

  @Input()
  set startView(v: CalendarView) {
    this.activeView = v;
  }

  openYearsView(): void {
    this.activeView = CalendarView.Years;

    this._updateDisplayedYearRangeStart();

    this.viewChange.emit(this.activeView);
  }
  openMonthsView(): void {
    this.activeView = CalendarView.Months;
    //bring back old value
    const oldYear = this.activeYear;
    this.activeYear = this.activeYear ?? this.todayDate.getFullYear();

    //emit events
    this.viewChange.emit(this.activeView);
    if (oldYear != this.activeYear && this.activeYear == this.todayDate.getFullYear()) this.activeYearChange.emit(this.activeYear);
  }
  openDaysView(): void {
    this.activeView = CalendarView.Days;
    //bring back old values
    const oldYear = this.activeYear;
    this.activeYear = this.activeYear ?? this.todayDate.getFullYear();
    const oldMonth = this.activeMonth;
    this.activeMonth = this.activeMonth ?? this.todayDate.getMonth();

    //emit events
    this.viewChange.emit(this.activeView);
    if (oldYear != this.activeYear && this.activeYear == this.todayDate.getFullYear()) this.activeYearChange.emit(this.activeYear);
    if (oldMonth != this.activeMonth && this.activeMonth == this.todayDate.getMonth()) this.activeMonthChange.emit(this.activeMonth);
  }

  //! template customization
  //headers
  @ContentChild(ArdYearsViewHeaderTemplateDirective)
  yearsViewHeaderTemplate?: TemplateRef<CalendarYearsViewHeaderContext>;
  @ContentChild(ArdMonthsViewHeaderTemplateDirective)
  monthsViewHeaderTemplate?: TemplateRef<CalendarMonthsViewHeaderContext>;
  @ContentChild(ArdDaysViewHeaderTemplateDirective)
  daysViewHeaderTemplate?: TemplateRef<CalendarDaysViewHeaderContext>;
  //weekday
  @ContentChild(ArdWeekdayTemplateDirective)
  weekdayTemplate?: TemplateRef<CalendarWeekdayContext>;
  //floating month
  @ContentChild(ArdFloatingMonthTemplateDirective)
  floatingMonthTemplate?: TemplateRef<CalendarFloatingMonthContext>;
  //grid elements (year, month, day)
  @ContentChild(ArdYearTemplateDirective)
  yearTemplate?: TemplateRef<CalendarYearContext>;
  @ContentChild(ArdMonthTemplateDirective)
  monthTemplate?: TemplateRef<CalendarMonthContext>;
  @ContentChild(ArdDayTemplateDirective)
  dayTemplate?: TemplateRef<CalendarDayContext>;

  //! context getters
  //headers
  getYearsViewHeaderContext(): CalendarYearsViewHeaderContext {
    const yearRangeStart = this.displayedYearRangeStart;
    const yearRangeEnd = yearRangeStart + 23;
    const dateRange: DateRange = {
      low: new Date(yearRangeStart, 0, 1),
      high: new Date(yearRangeEnd, 0, 1),
    };
    return {
      nextPage: () => {
        this.changeYearsViewPage(+1);
      },
      prevPage: () => {
        this.changeYearsViewPage(-1);
      },
      openDaysView: () => {
        this.openDaysView();
      },
      yearRange: {
        low: yearRangeStart,
        high: yearRangeEnd,
      },
      dateRange,
      $implicit: dateRange,
    };
  }
  getMonthsViewHeaderContext(): CalendarMonthsViewHeaderContext {
    return {
      openYearsView: () => {
        this.openYearsView();
      },
      openDaysView: () => {
        this.openDaysView();
      },
      year: this.activeYear,
      date: this.activeDate,
      $implicit: this.activeYear,
    };
  }
  getDaysViewHeaderContext(): CalendarDaysViewHeaderContext {
    return {
      nextMonth: () => {
        this.changeMonth(+1);
      },
      prevMonth: () => {
        this.changeMonth(-1);
      },
      nextYear: () => {
        this.changeYear(+1);
      },
      prevYear: () => {
        this.changeYear(-1);
      },
      openYearsView: () => {
        this.openYearsView();
      },
      openMonthsView: () => {
        this.openMonthsView();
      },
      year: this.activeYear,
      month: this.activeMonth,
      date: this.activeDate,
      $implicit: this.activeDate,
    };
  }
  //weekday
  getWeekdayContext(dayIndex: number): CalendarWeekdayContext {
    const date = new Date(1970, 0, 4 + dayIndex);
    return {
      dayIndex,
      date,
      $implicit: date,
    };
  }
  //floating month
  getFloatingMonthContext(): CalendarFloatingMonthContext {
    return {
      month: this.activeMonth,
      date: this.activeDate,
      $implicit: this.activeDate,
    };
  }
  //grid elements (year, month, day)
  getYearContext(year: number): CalendarYearContext {
    return {
      value: year,
      date: new Date(this.activeYear, 0, 1),
      $implicit: year,
      select: (year: number) => {
        this.selectYear(year);
      },
    };
  }
  getMonthContext(month: number): CalendarMonthContext {
    const date = new Date(this.activeYear, month, 1);
    return {
      month,
      date,
      $implicit: date,
      select: (month: number | Date) => {
        this.selectMonth(month);
      },
    };
  }
  getDayContext(day: number): CalendarDayContext {
    return {
      value: day,
      date: new Date(this.activeYear, this.activeMonth, day),
      $implicit: day,
      select: (day: number | Date) => {
        this.selectDay(day);
      },
    };
  }
}
