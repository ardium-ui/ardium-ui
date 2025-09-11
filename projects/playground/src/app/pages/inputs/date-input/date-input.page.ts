import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { ArdCalendarView } from 'projects/ui/src/public-api';
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

  readonly activeView = signal<ArdCalendarView>(ArdCalendarView.Years);

  onCalendarOpen() {
    this.activeView.set(ArdCalendarView.Years);
  }
}
