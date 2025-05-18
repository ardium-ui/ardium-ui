import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { isDefined, isNull } from 'simple-bool';
import {
  CalendarDayContext,
  CalendarDaysViewHeaderContext,
  CalendarFloatingMonthContext,
  CalendarWeekdayContext,
} from '../../calendar.types';
import { getCalendarData, getCalendarWeekdayArray } from './days-view.helpers';

const TODAY = new Date();

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

@Component({
  selector: 'ard-days-view',
  templateUrl: './days-view.component.html',
  styleUrl: './days-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysViewComponent {
  readonly tabIndex = input.required<number>();
  readonly readOnly = input.required<boolean>();
  readonly disabled = input.required<boolean>();

  readonly _isUsingKeyboard = input.required<boolean>();

  @HostListener('document:mousemove')
  onMouseMove(): void {
    if (this._isUsingKeyboard()) return;
    if (this.highlightedDay()) this.setHighlightedDay(null);
  }

  //! active year/month
  readonly activeYear = model.required<number>();
  readonly activeMonth = model.required<number>();

  changeMonth(offset: number): void {
    const newMonth = this.activeMonth() + offset;

    if (newMonth > 11) {
      this.activeMonth.set(0);
      this.activeYear.update(v => v + 1);
    } else if (newMonth < 0) {
      this.activeMonth.set(11);
      this.activeYear.update(v => v - 1);
    } else {
      this.activeMonth.set(newMonth);
    }
  }
  changeYear(offset: number): void {
    this.activeYear.update(v => v + offset);
  }

  readonly selectedDate = model.required<Date | null>();

  //! focusing
  readonly focusableElement = viewChild.required<ElementRef<HTMLElement>>('focusableElement');

  focus(): void {
    this.focusableElement().nativeElement.focus();
  }

  //! calendar data
  readonly firstWeekday = input.required<number>();

  readonly activeCalendarData = computed(() => getCalendarData(this.activeYear(), this.activeMonth(), this.firstWeekday()));
  readonly reserveTopRow = computed<boolean>(() => this.activeCalendarData().leadingSpaces < 3);

  readonly weekdayArray = computed(() => getCalendarWeekdayArray(this.firstWeekday()));

  isDateToday(day: number): boolean {
    return this.activeYear() === TODAY.getFullYear() && this.activeMonth() === TODAY.getMonth() && day === TODAY.getDate();
  }

  readonly currentAriaLabel = computed(() => {
    const day = this.highlightedDay();
    if (day === null) {
      return '';
    }
    return new Date(this.activeYear(), this.activeMonth(), day).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });

  //! outputs
  readonly triggerOpenYearsView = output<void>();
  readonly triggerOpenMonthsView = output<void>();
  readonly focusEvent = output<FocusEvent>({ alias: 'focus' });
  readonly blurEvent = output<FocusEvent>({ alias: 'blur' });

  //! calendar entry hover & click
  private readonly __highlightedDay = signal<number | null>(null);
  readonly highlightedDay = this.__highlightedDay.asReadonly();

  setHighlightedDay(day: number | null): void {
    if (isNull(day)) {
      this.__highlightedDay.update(() => day);
      return;
    }
    const date = new Date(this.activeYear(), this.activeMonth(), day);
    this.__highlightedDay.update(() => date.getDate());
  }
  setHighlightedDayAdjustDate(day: number): void {
    this.setHighlightedDay(day);

    const date = new Date(this.activeYear(), this.activeMonth(), day);

    if (this.activeYear() !== date.getFullYear()) this.activeYear.update(() => date.getFullYear());

    if (this.activeMonth() !== date.getMonth()) this.activeMonth.update(() => date.getMonth());
  }

  onCalendarDayMouseover(day: number | null): void {
    if (this._isUsingKeyboard()) return;
    if (this.disabled() || this.readOnly()) return;

    this.setHighlightedDay(day);
  }
  onCalendarDayClick(day: number | null): void {
    if (this.disabled() || this.readOnly()) return;
    if (day === null) return;

    this.selectDay(day);

    this.focus();
    this.setHighlightedDay(day);
  }
  onDayGridFocus(): void {
    if (this.disabled() || this.readOnly()) return;
    this.setHighlightedDay(1);
  }
  onDayGridBlur(): void {
    if (this.disabled() || this.readOnly()) return;
    this.setHighlightedDay(null);
  }
  onDayGridClick(): void {
    if (this.disabled() || this.readOnly()) return;
    if (this.highlightedDay() !== null) return;
    this.setHighlightedDay(1);
  }

  //! helpers
  isDayToday(day: number | null): boolean {
    return this.activeYear() === TODAY.getFullYear() && this.activeMonth() === TODAY.getMonth() && day === TODAY.getDate();
  }
  isDaySelected(day: number | Date | null): boolean {
    if (day instanceof Date) day = day.getDate();
    return (
      this.selectedDate() !== null &&
      this.activeYear() === this.selectedDate()?.getFullYear() &&
      this.activeMonth() === this.selectedDate()?.getMonth() &&
      day === this.selectedDate()?.getDate()
    );
  }

  //! keyboard controls
  onMainGridKeydown(event: KeyboardEvent): void {
    if (this.disabled() || this.readOnly()) return;
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
  private _onArrowUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightPreviousDay(7);
  }
  //highlight the entry one line below
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightNextDay(7);
  }
  //highlight previous entry
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightPreviousDay();
  }
  //highlight next entry
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightNextDay();
  }
  //highlight first entry on the page
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightFirstDay();
  }
  //highlight last entry on the page
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightLastDay();
  }
  //alone: highlight same entry on the previous page
  //with alt: highlight same entry multiple pages before (days view: 12 pages, months view: 10 pages, years view: 5 pages)
  private _onPageUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    if (event.altKey) this.highlightSameDayPreviousYear();
    else this.highlightSameDayPreviousMonth();
  }
  //alone: highlight same entry on the next page
  //with alt: highlight same entry multiple pages after (days view: 12 pages, months view: 10 pages, years view: 5 pages)
  private _onPageDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    if (event.altKey) this.highlightSameDayNextYear();
    else this.highlightSameDayNextMonth();
  }
  //! manipulation methods
  selectDay(day: number | Date | null): void {
    if (this.isDaySelected(day)) return;
    if (isNull(day)) {
      if (!isDefined(this.selectedDate())) return;

      this.selectedDate.set(null);
      return;
    }

    if (day instanceof Date) day = day.getDate();

    this.selectedDate.set(new Date(this.activeYear(), this.activeMonth(), day, 0, 0, 0, 0));
  }
  selectCurrentlyHighlighted(): void {
    if (!isDefined(this.highlightedDay())) return;

    this.selectDay(this.highlightedDay());
  }
  //next/prev highlighting
  highlightNextDay(offset = 1): void {
    const currentDay = this.highlightedDay();
    if (!isDefined(currentDay)) {
      this.setHighlightedDay(1);
      return;
    }
    this.setHighlightedDayAdjustDate(currentDay + offset);
  }
  highlightPreviousDay(offset = 1): void {
    this.highlightNextDay(offset * -1);
  }
  //first/last highlighting
  highlightFirstDay(): void {
    this.setHighlightedDay(1);
  }
  highlightLastDay(): void {
    switch (
      this.activeMonth() + 1 // +1 because month is 0-indexed
    ) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        this.setHighlightedDay(31);
        break;
      case 4:
      case 6:
      case 9:
      case 11:
        this.setHighlightedDay(30);
        break;
      case 2:
        if (isLeapYear(this.activeYear())) this.setHighlightedDay(29);
        this.setHighlightedDay(28);
    }
  }
  //same day next/prev month/year
  highlightSameDayNextMonth(): void {
    this.activeMonth.update(v => v + 1);

    this._fixDateAfterMonthChange();
  }
  highlightSameDayPreviousMonth(): void {
    this.activeMonth.update(v => v - 1);

    this._fixDateAfterMonthChange();
  }
  private _fixDateAfterMonthChange(): void {
    const day = this.highlightedDay();
    switch (
      this.activeMonth() + 1 // +1 because month is 0-indexed
    ) {
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
        if (day === 31) this.setHighlightedDay(30);
        break;
      case 2: {
        //skip if below 29 or null
        if (!day || day < 29) break;

        if (isLeapYear(this.activeYear())) this.setHighlightedDay(29);
        else this.setHighlightedDay(28);
      }
    }
  }
  highlightSameDayNextYear(): void {
    this.activeYear.update(v => v + 1);

    this._fixDateAfterYearChange();
  }
  highlightSameDayPreviousYear(): void {
    this.activeYear.update(v => v - 1);

    this._fixDateAfterYearChange();
  }
  private _fixDateAfterYearChange(): void {
    if (this.highlightedDay() !== 29) return; //skip if not 29th day is selected
    if (this.activeMonth() !== 1) return; //skip if not february
    if (isLeapYear(this.activeYear())) return; //skip if new year is a leap year

    this.setHighlightedDay(28);
  }

  //! templates
  readonly daysViewHeaderTemplate = input.required<TemplateRef<CalendarDaysViewHeaderContext> | undefined>();
  readonly floatingMonthTemplate = input.required<TemplateRef<CalendarFloatingMonthContext> | undefined>();
  readonly weekdayTemplate = input.required<TemplateRef<CalendarWeekdayContext> | undefined>();
  readonly dayTemplate = input.required<TemplateRef<CalendarDayContext> | undefined>();

  //! template contexts
  readonly daysViewHeaderContext = computed<CalendarDaysViewHeaderContext>(() => ({
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
      this.triggerOpenYearsView.emit();
    },
    openMonthsView: () => {
      this.triggerOpenMonthsView.emit();
    },
    year: this.activeYear(),
    month: this.activeMonth(),
    $implicit: new Date(this.activeYear(), this.activeMonth(), 1, 0, 0, 0, 0),
  }));

  readonly weekdayContext = computed<(dayIndex: number) => CalendarWeekdayContext>(() => (dayIndex: number) => {
    const date = new Date(1970, 0, 4 + dayIndex);
    return {
      dayIndex,
      date,
      $implicit: date,
    };
  });

  readonly floatingMonthContext = computed<CalendarFloatingMonthContext>(() => {
    const date = new Date(this.activeYear(), this.activeMonth(), 1, 0, 0, 0, 0);
    return {
      month: this.activeMonth(),
      date,
      $implicit: date,
    };
  });

  readonly dayContext = computed<(day: number) => CalendarDayContext>(() => (day: number) => {
    const date = new Date(this.activeYear(), this.activeMonth(), day);
    return {
      value: day,
      date,
      $implicit: day,
      select: (dayOrDate: number | Date) => {
        this.selectDay(dayOrDate);
      },
    };
  });
}
