import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { DateRange } from 'projects/ui/src/public-api';
import { Logger } from '../../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-date-range-input',
  templateUrl: './date-range-input.page.html',
  styleUrl: './date-range-input.page.scss',
})
export class DateRangeInputPage {
  readonly logger = inject(Logger);
  log = this.logger.log;

  readonly formControl = new FormControl<DateRange | null>(
    new DateRange(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth(), 28)
    )
  );

  constructor() {
    this.formControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(v => {
      console.log('formControl changes', v);
    });
  }
}
