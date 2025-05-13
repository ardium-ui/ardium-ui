import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  model,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { roundToMultiple } from 'more-rounding';
import { ArdiumButtonModule, ArdiumIconButtonModule } from 'projects/ui/src/public-api';
import { isDefined, isNull } from 'simple-bool';
import { ArdiumIconModule } from '../../../icon';
import { CalendarYearContext, CalendarYearsViewHeaderContext, DateRange, YearRange } from '../../calendar.types';
import { getCalendarYearsArray } from './years-view.helpers';

const TODAY = new Date();

@Component({
  selector: 'ard-years-view',
  templateUrl: './years-view.component.html',
  styleUrl: './years-view.component.scss',
  imports: [CommonModule, DatePipe, ArdiumIconButtonModule, ArdiumIconModule, ArdiumButtonModule],
  standalone: true,
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
    if (this.highlightedYear()) this.highlightedYear.set(null);
  }

  readonly activeYear = model.required<number>();

  readonly selectedDate = model.required<Date | null>();

  readonly currentYearRangeStart = signal<number>(TODAY.getFullYear() - (TODAY.getFullYear() % 4) - 8); // current year always in 3rd row
  readonly yearsArray = computed(() => getCalendarYearsArray(this.currentYearRangeStart(), 24));

  readonly currentAriaLabel = computed(() => {
    return this.highlightedYear()?.toString() ?? '';
  });

  //! outputs
  readonly triggerOpenMonthsView = output<void>();
  readonly triggerOpenDaysView = output<void>();
  readonly focusEvent = output<FocusEvent>({ alias: 'focus' });
  readonly blurEvent = output<FocusEvent>({ alias: 'blur' });

  //! calendar entry hover & click
  readonly highlightedYear = signal<number | null>(null);

  setHighlightedYearAdjustPage(year: number): void {
    this.highlightedYear.set(year);

    if (year < this.currentYearRangeStart() || year >= this.currentYearRangeStart() + 24) {
      //add the difference between the highlighted year and the displayed range start year
      //rounded to a multiple of 24, away from the number zero
      //the difference may be negative, if the first if condition is met
      this.currentYearRangeStart.update(v => v + roundToMultiple(year - this.currentYearRangeStart(), 24, 'from_zero'));
    }
  }

  onCalendarYearMouseover(year: number): void {
    if (this._isUsingKeyboard() || this.disabled() || this.readOnly()) return;

    this.highlightedYear.set(year);
  }
  onCalendarYearClick(year: number): void {
    if (this.disabled() || this.readOnly()) return;
    this.selectYear(year);
  }
  onYearGridFocus(): void {
    if (this.disabled() || this.readOnly()) return;
    this.highlightedYear.set(this.currentYearRangeStart());
  }
  onYearGridBlur(): void {
    if (this.disabled() || this.readOnly()) return;
    this.highlightedYear.set(null);
  }
  onYearGridClick(): void {
    if (this.disabled() || this.readOnly()) return;
    if (this.highlightedYear() !== null) return;
    this.highlightedYear.set(this.currentYearRangeStart());
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

    this.selectCurrentlyHighlighted();
  }
  //highlight the entry one line above
  private _onArrowUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightPreviousYear(4); //4 years per line
  }
  //highlight the entry one line below
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightNextYear(4); //4 years per line
  }
  //highlight previous entry
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightPreviousYear();
  }
  //highlight next entry
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightNextYear();
  }
  //highlight first entry on the page
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightFirstYear();
  }
  //highlight last entry on the page
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightLastYear();
  }
  //alone: highlight same entry on the previous page
  //with alt: highlight same entry multiple pages before
  private _onPageUpPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightSameYearPreviousPage(event.altKey);
  }
  //alone: highlight same entry on the next page
  //with alt: highlight same entry multiple pages after
  private _onPageDownPress(event: KeyboardEvent): void {
    event.preventDefault();

    this.highlightSameYearNextPage(event.altKey);
  }

  //! manipulation methods
  selectYear(year: number | Date | null): void {
    if (isNull(year)) {
      this.activeYear.set(TODAY.getFullYear());
      return;
    }
    if (year instanceof Date) year = year.getFullYear();

    this.activeYear.set(year);
    this.triggerOpenMonthsView.emit();
  }
  selectCurrentlyHighlighted(): void {
    this.selectYear(this.highlightedYear());
  }
  changeYearsViewPage(pages: number): void {
    this.currentYearRangeStart.update(v => v + 24 * pages);
  }
  highlightNextYear(offset = 1): void {
    const currentYear = this.highlightedYear();
    if (!isDefined(currentYear)) {
      this.highlightedYear.set(0);
      return;
    }
    this.setHighlightedYearAdjustPage(currentYear + offset);
  }
  highlightPreviousYear(offset = 1): void {
    this.highlightNextYear(offset * -1);
  }
  highlightFirstYear(): void {
    this.highlightedYear.set(this.currentYearRangeStart());
  }
  highlightLastYear(): void {
    this.highlightedYear.set(this.currentYearRangeStart() + 23); //24 years per page
  }
  highlightSameYearNextPage(multiple: boolean): void {
    const year = this.highlightedYear();
    if (!isDefined(year)) {
      this.highlightedYear.set(this.currentYearRangeStart());
      return;
    }
    this.setHighlightedYearAdjustPage(year + (multiple ? 60 : 24));
  }
  highlightSameYearPreviousPage(multiple: boolean): void {
    const year = this.highlightedYear();
    if (!isDefined(year)) {
      this.highlightedYear.set(this.currentYearRangeStart());
      return;
    }
    this.setHighlightedYearAdjustPage(year - (multiple ? 60 : 24));
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
        this.changeYearsViewPage(+1);
      },
      prevPage: () => {
        this.changeYearsViewPage(-1);
      },
      openMonthsView: () => {
        this.triggerOpenMonthsView.emit();
      },
      openDaysView: () => {
        this.triggerOpenDaysView.emit();
      },
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
          this.selectYear(year);
        },
      };
    };
  });
}
