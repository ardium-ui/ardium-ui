import { ChangeDetectionStrategy, Component, computed, HostListener, input, output, TemplateRef } from '@angular/core';
import { CalendarYearContext, CalendarYearsViewHeaderContext, DateRange, YearRange } from '../../calendar.types';
import { getCalendarYearsArray } from './years-view.helpers';

const TODAY = new Date();

@Component({
  selector: 'ard-years-view',
  templateUrl: './years-view.component.html',
  styleUrl: './years-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YearsViewComponent {
  readonly tabIndex = input.required<number>();
  readonly readOnly = input.required<boolean>();
  readonly disabled = input.required<boolean>();

  readonly _isUsingKeyboard = input.required<boolean>();

  @HostListener('document:mousemove')
  onMouseMove(): void {
    if (this._isUsingKeyboard()) return;
    if (this.highlightedYear()) this.triggerHighlightYear.emit(null);
  }

  readonly activeYear = input.required<number>();

  readonly canGoToNextPage = input.required<boolean>();
  readonly canGoToPreviousPage = input.required<boolean>();

  readonly selectedDate = input.required<Date | null>();

  readonly currentYearRangeStart = input.required<number>();
  readonly yearsArray = computed(() => getCalendarYearsArray(this.currentYearRangeStart(), 24));

  readonly currentAriaLabel = computed(() => {
    return this.highlightedYear()?.toString() ?? '';
  });

  //! outputs
  readonly triggerOpenMonthsView = output<void>();
  readonly triggerOpenDaysView = output<void>();

  readonly focusEvent = output<FocusEvent>({ alias: 'focus' });
  readonly blurEvent = output<FocusEvent>({ alias: 'blur' });

  readonly triggerSelectYear = output<number>();
  readonly triggerChangeYearsViewPage = output<number>();

  readonly triggerHighlightYear = output<number | null>();
  readonly triggerHighlightNextYear = output<number>();
  readonly triggerHighlightPreviousYear = output<number>();
  readonly triggerHighlightFirstYear = output<void>();
  readonly triggerHighlightLastYear = output<void>();
  readonly triggerHighlightSameYearPreviousPage = output<boolean>();
  readonly triggerHighlightSameYearNextPage = output<boolean>();

  //! calendar entry hover & click
  readonly highlightedYear = input.required<number | null>();

  onCalendarYearMouseover(year: number): void {
    if (this._isUsingKeyboard() || this.disabled() || this.readOnly()) return;

    this.triggerHighlightYear.emit(year);
  }
  onCalendarYearClick(year: number): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerSelectYear.emit(year);
  }
  onYearGridFocus(): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerHighlightFirstYear.emit();
  }
  onYearGridBlur(): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerHighlightYear.emit(null);
  }
  onYearGridClick(): void {
    if (this.disabled() || this.readOnly()) return;
    if (this.highlightedYear() !== null) return;
    this.triggerHighlightFirstYear.emit();
  }

  //! helpers
  isYearToday(year: number): boolean {
    return year === TODAY.getFullYear();
  }
  isYearSelected(year: number | Date): boolean {
    if (year instanceof Date) year = year.getFullYear();
    return this.selectedDate() !== null && year === this.selectedDate()?.getFullYear();
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

    const year = this.highlightedYear();
    if (year === null) return;

    this.triggerSelectYear.emit(year);
  }
  //highlight the entry one line below
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightNextYear.emit(4); //4 years per line
  }
  //highlight the entry one line above
  private _onArrowUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightPreviousYear.emit(4); //4 years per line
  }
  //highlight next entry
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightNextYear.emit(1);
  }
  //highlight previous entry
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightPreviousYear.emit(1);
  }
  //highlight first entry on the page
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightFirstYear.emit();
  }
  //highlight last entry on the page
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightLastYear.emit();
  }
  //alone: highlight same entry on the previous page
  //with alt: highlight same entry multiple pages before
  private _onPageUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightSameYearPreviousPage.emit(event.altKey);
  }
  //alone: highlight same entry on the next page
  //with alt: highlight same entry multiple pages after
  private _onPageDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.triggerHighlightSameYearNextPage.emit(event.altKey);
  }

  //! templates
  readonly yearsViewHeaderTemplate = input.required<TemplateRef<CalendarYearsViewHeaderContext> | undefined>();
  readonly yearTemplate = input.required<TemplateRef<CalendarYearContext> | undefined>();

  //! template contexts
  readonly yearsViewHeaderContext = computed<CalendarYearsViewHeaderContext>(() => {
    const yearRangeStart = this.currentYearRangeStart();
    const yearRangeEnd = yearRangeStart + 23;
    const dateRange: DateRange = {
      low: new Date(yearRangeStart, 0, 1),
      high: new Date(yearRangeEnd, 0, 1),
    };
    const yearRange: YearRange = {
      low: yearRangeStart,
      high: yearRangeEnd,
    };
    return {
      nextPage: () => {
        this.triggerChangeYearsViewPage.emit(1);
      },
      prevPage: () => {
        this.triggerChangeYearsViewPage.emit(-1);
      },
      openMonthsView: () => {
        this.triggerOpenMonthsView.emit();
      },
      openDaysView: () => {
        this.triggerOpenDaysView.emit();
      },
      canGoToNextPage: this.canGoToNextPage(),
      canGoToPreviousPage: this.canGoToPreviousPage(),
      yearRange: yearRange,
      dateRange,
      $implicit: dateRange,
    };
  });
  readonly yearContext = computed<(year: number) => CalendarYearContext>(() => {
    return (year: number) => {
      const date = new Date(year, 0, 1);
      return {
        value: year,
        date,
        $implicit: date,
        select: (year: number) => {
          this.triggerSelectYear.emit(year);
        },
      };
    };
  });
}
