import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  output,
  TemplateRef,
  viewChild,
} from '@angular/core';
import {
  CalendarDayContext,
  CalendarDaysViewHeaderContext,
  CalendarFloatingMonthContext,
  CalendarWeekdayContext,
} from '../../calendar.types';
import { isMonthOutOfRange } from '../months-view/months-view.helpers';
import { getCalendarDayData, getCalendarWeekdayArray } from './days-view.helpers';

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
export class DaysViewComponent implements AfterViewInit {
  readonly tabIndex = input.required<number>();
  readonly readOnly = input.required<boolean>();
  readonly disabled = input.required<boolean>();

  readonly autoFocus = input.required<boolean>();

  readonly _isUsingKeyboard = input.required<boolean>();

  @HostListener('mousemove')
  onMouseMove(): void {
    if (this._isUsingKeyboard()) return;
    if (this.highlightedDay()) this.triggerHighlightDay.emit(null);
  }

  ngAfterViewInit(): void {
    if (!this.autoFocus()) return;
    this.focus();
    this.triggerHighlightDay.emit(1);
  }

  //! active year/month
  readonly activeYear = input.required<number>();
  readonly activeMonth = input.required<number>();

  readonly selectedDate = input.required<Date | null>();

  readonly min = input.required<Date | null>();
  readonly max = input.required<Date | null>();

  readonly isDayFilteredOut = input.required<(day: number, month?: number, year?: number) => boolean>();

  readonly highlightedDay = input.required<number | null>();

  //! focusing
  readonly focusableElement = viewChild.required<ElementRef<HTMLElement>>('focusableElement');

  focus(): void {
    this.focusableElement().nativeElement.focus();
  }

  //! calendar data
  readonly firstWeekday = input.required<number>();

  readonly activeCalendarData = computed(() =>
    getCalendarDayData(this.activeYear(), this.activeMonth(), this.firstWeekday(), this.min(), this.max())
  );
  readonly reserveTopRow = computed<boolean>(() => this.activeCalendarData().leadingSpaces < 3);

  readonly weekdayArray = computed(() => getCalendarWeekdayArray(this.firstWeekday()));

  isDaySelected(day: number | Date | null): boolean {
    if (day instanceof Date) day = day.getDate();
    return (
      this.selectedDate() !== null &&
      this.activeYear() === this.selectedDate()?.getFullYear() &&
      this.activeMonth() === this.selectedDate()?.getMonth() &&
      day === this.selectedDate()?.getDate()
    );
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

  readonly triggerSelectDay = output<number | null>();
  readonly triggerChangeMonth = output<number | null>();
  readonly triggerChangeYear = output<number | null>();

  readonly triggerHighlightDay = output<number | null>();
  readonly triggerHighlightNextDay = output<number>();
  readonly triggerHighlightPreviousDay = output<number>();
  readonly triggerHighlightFirstDay = output<void>();
  readonly triggerHighlightLastDay = output<void>();
  readonly triggerHighlightSameDayPreviousPage = output<boolean>();
  readonly triggerHighlightSameDayNextPage = output<boolean>();

  readonly focusEvent = output<FocusEvent>({ alias: 'focus' });
  readonly blurEvent = output<FocusEvent>({ alias: 'blur' });

  onCalendarDayMouseover(day: number | null): void {
    if (this._isUsingKeyboard()) return;
    if (this.disabled() || this.readOnly()) return;
    if (day && this.isDayFilteredOut()(day)) return;

    this.triggerHighlightDay.emit(day);
  }
  onCalendarDayClick(day: number | null): void {
    if (this.disabled() || this.readOnly()) return;
    if (day === null) return;
    if (this.isDayFilteredOut()(day)) return;

    this.triggerHighlightDay.emit(day);
    this.focus();
    this.triggerSelectDay.emit(day);
  }
  onDayGridFocus(): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerHighlightFirstDay.emit();
  }
  onDayGridBlur(): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerHighlightDay.emit(null);
  }
  onDayGridClick(): void {
    if (this.disabled() || this.readOnly()) return;
    if (this.highlightedDay() !== null) return;
    this.triggerHighlightFirstDay.emit();
  }

  //! helpers
  isDayToday(day: number | null): boolean {
    return this.activeYear() === TODAY.getFullYear() && this.activeMonth() === TODAY.getMonth() && day === TODAY.getDate();
  }
  isMonthOutOfRange(month: number): number {
    return isMonthOutOfRange(month, this.activeYear(), this.min(), this.max());
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

    this.triggerSelectDay.emit(this.highlightedDay());
  }
  //highlight the entry one line below
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightNextDay.emit(7);
  }
  //highlight the entry one line above
  private _onArrowUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightPreviousDay.emit(7);
  }
  //highlight next entry
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightNextDay.emit(1);
  }
  //highlight previous entry
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightPreviousDay.emit(1);
  }
  //highlight first entry on the page
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightFirstDay.emit();
  }
  //highlight last entry on the page
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightLastDay.emit();
  }
  //alone: highlight same entry on the next page
  //with alt: highlight same entry multiple pages after (12 pages)
  private _onPageDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightSameDayNextPage.emit(event.altKey);
  }
  //alone: highlight same entry on the previous page
  //with alt: highlight same entry multiple pages before (12 pages)
  private _onPageUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightSameDayPreviousPage.emit(event.altKey);
  }

  //! templates
  readonly daysViewHeaderTemplate = input.required<TemplateRef<CalendarDaysViewHeaderContext> | undefined>();
  readonly floatingMonthTemplate = input.required<TemplateRef<CalendarFloatingMonthContext> | undefined>();
  readonly weekdayTemplate = input.required<TemplateRef<CalendarWeekdayContext> | undefined>();
  readonly dayTemplate = input.required<TemplateRef<CalendarDayContext> | undefined>();

  fbdjfd = effect(() => {
    console.log('daysViewHeaderTemplate', this.daysViewHeaderTemplate());
  })

  //! template contexts
  readonly daysViewHeaderContext = computed<CalendarDaysViewHeaderContext>(() => ({
    nextMonth: () => {
      this.triggerChangeMonth.emit(this.activeMonth() + 1);
    },
    prevMonth: () => {
      this.triggerChangeMonth.emit(this.activeMonth() - 1);
    },
    nextYear: () => {
      this.triggerChangeYear.emit(this.activeYear() + 1);
    },
    prevYear: () => {
      this.triggerChangeYear.emit(this.activeYear() - 1);
    },
    openYearsView: () => {
      this.triggerOpenYearsView.emit();
    },
    openMonthsView: () => {
      this.triggerOpenMonthsView.emit();
    },
    canGoToNextPage: !this.isMonthOutOfRange(this.activeMonth() + 1),
    canGoToPreviousPage: !this.isMonthOutOfRange(this.activeMonth() - 1),
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
        this.triggerSelectDay.emit(dayOrDate instanceof Date ? dayOrDate.getDate() : dayOrDate);
      },
    };
  });
}
