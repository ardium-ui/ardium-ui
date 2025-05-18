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
import { ComponentColor } from 'projects/ui/src/public-api';
import { isDefined, isNull } from 'simple-bool';
import { CalendarMonthContext, CalendarMonthsViewHeaderContext } from '../../calendar.types';

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
    if (this.highlightedMonth()) this.highlightedMonth.set(null);
  }

  readonly color = input.required<ComponentColor>();

  readonly activeYear = model.required<number>();
  readonly activeMonth = model.required<number>();

  readonly selectedDate = model.required<Date | null>();

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

  //! calendar entry hover & click
  readonly highlightedMonth = signal<number | null>(null);

  setHighlightedMonthAdjustDate(month: number): void {
    this.highlightedMonth.set(month);

    const date = new Date(this.activeYear(), month, 1);

    if (this.activeYear() !== date.getFullYear()) this.activeYear.set(date.getFullYear());
  }

  onCalendarMonthMouseover(month: number): void {
    if (this._isUsingKeyboard()) return;
    if (this.disabled() || this.readOnly()) return;

    this.highlightedMonth.set(month);
  }

  onCalendarMonthClick(month: number): void {
    if (this.disabled() || this.readOnly()) return;
    this.selectMonth(month);
  }

  onMonthGridFocus(): void {
    if (this.disabled() || this.readOnly()) return;
    this.highlightedMonth.set(0);
  }
  onMonthGridBlur(): void {
    if (this.disabled() || this.readOnly()) return;
    this.highlightedMonth.set(null);
  }
  onMonthGridClick(): void {
    if (this.disabled() || this.readOnly()) return;
    if (this.highlightedMonth() !== null) return;
    this.highlightedMonth.set(0);
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
    this.highlightPreviousMonth(4); //4 months per line
  }
  //highlight the entry one line below
  private _onArrowDownPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.highlightNextMonth(4); //4 months per line
  }
  //highlight previous entry
  private _onArrowLeftPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.highlightPreviousMonth();
  }
  //highlight next entry
  private _onArrowRightPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.highlightNextMonth();
  }
  //highlight first entry on the page
  private _onHomePress(event: KeyboardEvent): void {
    event.preventDefault();
    this.highlightFirstMonth();
  }
  //highlight last entry on the page
  private _onEndPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.highlightLastMonth();
  }
  //alone: highlight same entry on the previous page
  //with alt: highlight same entry multiple pages before (days view: 12 pages, months view: 10 pages, years view: 5 pages)
  private _onPageUpPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.highlightSameMonthPreviousYear(event.altKey);
  }
  //alone: highlight same entry on the next page
  //with alt: highlight same entry multiple pages after (days view: 12 pages, months view: 10 pages, years view: 5 pages)
  private _onPageDownPress(event: KeyboardEvent): void {
    event.preventDefault();
    this.highlightSameMonthNextYear(event.altKey);
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

  //! manipulation methods
  selectMonth(month: number | Date | null): void {
    if (isNull(month)) {
      this.activeMonth.set(0);
      return;
    }
    if (month instanceof Date) month = month.getMonth();

    this.activeMonth.set(month);

    this.triggerOpenDaysView.emit();
  }
  selectCurrentlyHighlighted(): void {
    this.selectMonth(this.highlightedMonth());
  }
  highlightNextMonth(offset = 1): void {
    const currentMonth = this.highlightedMonth();
    if (!isDefined(currentMonth)) {
      this.highlightedMonth.set(0);
      return;
    }
    this.setHighlightedMonthAdjustDate(currentMonth + offset);
  }
  highlightPreviousMonth(offset = 1): void {
    this.highlightNextMonth(offset * -1);
  }
  highlightFirstMonth(): void {
    this.highlightedMonth.set(0);
  }
  highlightLastMonth(): void {
    this.highlightedMonth.set(11);
  }
  highlightSameMonthNextYear(multiple: boolean): void {
    this.activeYear.update(v => v + (multiple ? 10 : 1));
  }
  highlightSameMonthPreviousYear(multiple: boolean): void {
    this.activeYear.update(v => v - (multiple ? 10 : 1));
  }

  //! templates
  readonly monthsViewHeaderTemplate = input.required<TemplateRef<CalendarMonthsViewHeaderContext> | undefined>();
  readonly monthTemplate = input.required<TemplateRef<CalendarMonthContext> | undefined>();

  //! template contexts
  readonly monthsViewHeaderContext = computed(
    (): CalendarMonthsViewHeaderContext => ({
      openYearsView: () => {
        this.triggerOpenYearsView.emit();
      },
      openDaysView: () => {
        this.triggerOpenDaysView.emit();
      },
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
        this.selectMonth(month);
      },
    };
  });
}
