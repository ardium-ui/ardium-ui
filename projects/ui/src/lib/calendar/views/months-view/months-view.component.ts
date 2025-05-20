import { ChangeDetectionStrategy, Component, computed, HostListener, input, output, TemplateRef } from '@angular/core';
import { ComponentColor } from 'projects/ui/src/public-api';
import { CalendarMonthContext, CalendarMonthsViewHeaderContext } from '../../calendar.types';
import { isYearOutOfRange } from '../years-view/years-view.helpers';
import { isMonthOutOfRange } from './months-view.helpers';

const TODAY = new Date();

@Component({
  selector: 'ard-months-view',
  templateUrl: './months-view.component.html',
  styleUrl: './months-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthsViewComponent {
  readonly tabIndex = input.required<number>();
  readonly readOnly = input.required<boolean>();
  readonly disabled = input.required<boolean>();

  readonly _isUsingKeyboard = input.required<boolean>();

  @HostListener('document:mousemove')
  onMouseMove(): void {
    if (this._isUsingKeyboard()) return;
    if (this.highlightedMonth()) this.triggerHighlightMonth.emit(null);
  }

  readonly color = input.required<ComponentColor>();

  readonly activeYear = input.required<number>();
  readonly activeMonth = input.required<number>();

  readonly selectedDate = input.required<Date | null>();

  readonly min = input.required<Date | null>();
  readonly max = input.required<Date | null>();

  readonly MONTHS_ARRAY: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  readonly currentAriaLabel = computed(() => {
    const month = this.highlightedMonth();
    if (month === null) {
      return '';
    }
    return new Date(this.activeYear(), month, 1).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
    });
  });

  //! outputs
  readonly triggerOpenYearsView = output<void>();
  readonly triggerOpenDaysView = output<void>();

  readonly focusEvent = output<FocusEvent>({ alias: 'focus' });
  readonly blurEvent = output<FocusEvent>({ alias: 'blur' });

  readonly triggerSelectMonth = output<number>();
  readonly triggeChangeYear = output<number>();

  readonly triggerHighlightMonth = output<number | null>();
  readonly triggerHighlightNextMonth = output<number>();
  readonly triggerHighlightPreviousMonth = output<number>();
  readonly triggerHighlightFirstMonth = output<void>();
  readonly triggerHighlightLastMonth = output<void>();
  readonly triggerHighlightSameMonthPreviousPage = output<boolean>();
  readonly triggerHighlightSameMonthNextPage = output<boolean>();

  //! calendar entry hover & click
  readonly highlightedMonth = input.required<number | null>();

  onCalendarMonthMouseover(month: number): void {
    if (this._isUsingKeyboard()) return;
    if (this.disabled() || this.readOnly()) return;

    this.triggerHighlightMonth.emit(month);
  }

  onCalendarMonthClick(month: number): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerSelectMonth.emit(month);
  }

  onMonthGridFocus(): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerHighlightMonth.emit(0);
  }
  onMonthGridBlur(): void {
    if (this.disabled() || this.readOnly()) return;
    this.triggerHighlightMonth.emit(null);
  }
  onMonthGridClick(): void {
    if (this.disabled() || this.readOnly()) return;
    if (this.highlightedMonth() !== null) return;
    this.triggerHighlightMonth.emit(0);
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

    this.triggerHighlightMonth.emit(this.highlightedMonth());
  }
  //highlight the entry one line below
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightNextMonth.emit(4); //4 months per line
  }
  //highlight the entry one line above
  private _onArrowUpPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightPreviousMonth.emit(4); //4 months per line
  }
  //highlight next entry
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightNextMonth.emit(1);
  }
  //highlight previous entry
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightPreviousMonth.emit(1);
  }
  //highlight first entry on the page
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightFirstMonth.emit();
  }
  //highlight last entry on the page
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightLastMonth.emit();
  }
  //alone: highlight same entry on the next page
  //with alt: highlight same entry multiple pages after (10 pages)
  private _onPageDownPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightSameMonthNextPage.emit(event.altKey);
  }
  //alone: highlight same entry on the previous page
  //with alt: highlight same entry multiple pages before (10 pages)
  private _onPageUpPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.triggerHighlightSameMonthPreviousPage.emit(event.altKey);
  }

  //! helpers
  isMonthToday(month: number): boolean {
    return this.activeYear() === TODAY.getFullYear() && month === TODAY.getMonth();
  }
  isMonthSelected(month: number | Date): boolean {
    if (month instanceof Date) month = month.getMonth();
    return (
      this.selectedDate() !== null &&
      this.activeYear() === this.selectedDate()?.getFullYear() &&
      month === this.selectedDate()?.getMonth()
    );
  }
  isMonthOutOfRange(month: number, year: number = this.activeYear()): number {
    return isMonthOutOfRange(month, year, this.min(), this.max());
  }
  isYearOutOfRange(year: number): number {
    return isYearOutOfRange(year, this.min(), this.max());
  }

  //! templates
  readonly monthsViewHeaderTemplate = input.required<TemplateRef<CalendarMonthsViewHeaderContext> | undefined>();
  readonly monthTemplate = input.required<TemplateRef<CalendarMonthContext> | undefined>();

  //! template contexts
  readonly monthsViewHeaderContext = computed(
    (): CalendarMonthsViewHeaderContext => ({
      nextPage: () => {
        this.triggeChangeYear.emit(this.activeYear() + 1);
      },
      prevPage: () => {
        this.triggeChangeYear.emit(this.activeYear() - 1);
      },
      openYearsView: () => {
        this.triggerOpenYearsView.emit();
      },
      openDaysView: () => {
        this.triggerOpenDaysView.emit();
      },
      canGoToNextPage: !this.isYearOutOfRange(this.activeYear() + 1),
      canGoToPreviousPage: !this.isYearOutOfRange(this.activeYear() - 1),
      year: this.activeYear(),
      date: new Date(this.activeYear(), 0, 1),
      $implicit: this.activeYear(),
    })
  );

  readonly monthContext = computed(() => (month: number): CalendarMonthContext => {
    const date = new Date(this.activeYear(), month, 1);
    return {
      month,
      date,
      $implicit: date,
      select: (month: number | Date) => {
        if (month instanceof Date) month = month.getMonth();
        this.triggerSelectMonth.emit(month);
      },
    };
  });
}
