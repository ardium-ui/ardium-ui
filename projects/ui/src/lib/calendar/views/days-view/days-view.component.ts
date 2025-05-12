import { CommonModule, DatePipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model, output, TemplateRef } from '@angular/core';
import { ArdiumButtonModule, ArdiumIconButtonModule } from 'projects/ui/src/public-api';
import { ArdiumIconModule } from '../../../icon';
import {
  CalendarDayContext,
  CalendarDaysViewHeaderContext,
  CalendarFloatingMonthContext,
  CalendarWeekdayContext,
} from '../../calendar.types';
import { getCalendarData, getCalendarWeekdayArray } from './days-view.helpers';

const TODAY = new Date();

@Component({
  selector: 'ard-days-view',
  templateUrl: './days-view.component.html',
  styleUrl: './days-view.component.scss',
  imports: [CommonModule, DatePipe, UpperCasePipe, ArdiumIconButtonModule, ArdiumIconModule, ArdiumButtonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DaysViewComponent {
  readonly tabIndex = input.required<number>();
  readonly readOnly = input.required<boolean>();
  readonly disabled = input.required<boolean>();

  //! active year/month
  readonly activeYear = model.required<number>();
  readonly activeMonth = model.required<number>();

  changeMonth(offset: number): void {
    const oldyear = this.activeYear();
    this.activeMonth.update(v => v + offset);

    if (this.activeMonth() > 11) {
      this.activeMonth.update(() => 0);
      this.changeYear(+1);
    } else if (this.activeMonth() < 0) {
      this.activeMonth.update(() => 11);
      this.changeYear(-1);
    }
  }
  changeYear(offset: number): void {
    this.activeYear.update(v => v + offset);
  }

  //! calendar data
  readonly firstWeekday = input.required<number>();

  readonly activeCalendarData = computed(() => getCalendarData(this.activeYear(), this.activeMonth(), this.firstWeekday()));
  readonly reserveTopRow = computed<boolean>(() => this.activeCalendarData().leadingSpaces < 3);

  readonly weekdayArray = computed(() => getCalendarWeekdayArray(this.firstWeekday()));

  isDateToday(day: number): boolean {
    return this.activeYear() === TODAY.getFullYear() && this.activeMonth() === TODAY.getMonth() && day === TODAY.getDate();
  }

  //! outputs
  readonly triggerOpenYearsView = output<void>();
  readonly triggerOpenMonthsView = output<void>();

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
        // this.selectDay(dayOrDate);
      },
    };
  });
}
