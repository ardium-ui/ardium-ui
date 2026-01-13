import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ArdiumDateInputComponent } from 'projects/ui/src/public-api';
import { Logger } from '../../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-date-input',
  templateUrl: './date-input.page.html',
  styleUrl: './date-input.page.scss',
})
export class DateInputPage {
  readonly logger = inject(Logger);
  log = this.logger.log;

  readonly formControl = new FormControl<Date | null>(null);

  constructor() {
    this.formControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(v => {
      console.log('formControl changes', v);
      if (this.formControl.value === null) return;

      setTimeout(() => {
        console.log('%csetting to null', 'color:red');
        this.formControl.setValue(null);
      }, 3000);
    });
  }

  readonly selectedYear = signal<number | null>(null);
  readonly selectedMonth = signal<number | null>(null);

  onMonthSelect(month: number, dateInput: ArdiumDateInputComponent): void {
    this.selectedMonth.set(month);
    dateInput.close();
  }

  readonly yearMonthValue = computed<Date | null>(() => {
    const year = this.selectedYear();
    const month = this.selectedMonth();
    if (year === null || month === null) return null;
    return new Date(year, month, 1);
  });

  readonly yearMonthSerializer = (date: Date | null): string => {
    if (date === null) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  };
}
