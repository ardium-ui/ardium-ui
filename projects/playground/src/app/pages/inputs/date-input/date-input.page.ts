import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { Logger } from '../../../services/logger.service';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.page.html',
  styleUrl: './date-input.page.scss',
})
export class DateInputPage {
  readonly logger = inject(Logger);
  log = this.logger.log;

  readonly formControl = new FormControl<Date | null>(null);

  constructor() {
    this.formControl.valueChanges.pipe(takeUntilDestroyed()).subscribe(v => console.log('formControl changes', v));
  }
}
