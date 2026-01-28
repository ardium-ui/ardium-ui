import {
  ChangeDetectionStrategy,
  Component,
  effect,
  forwardRef,
  Inject,
  model,
  output,
  untracked,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isDate, isDefined, isObject } from 'simple-bool';
import { ARD_FORM_FIELD_CONTROL } from '../form-field/form-field-child.token';
import { _AbstractCalendar } from './abstract-calendar';
import { ARD_CALENDAR_DEFAULTS, ArdCalendarDefaults } from './calendar.defaults';
import { DateRange } from './calendar.types';

@Component({
  standalone: false,
  selector: 'ard-range-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumRangeCalendarComponent),
      multi: true,
    },
    {
      provide: ARD_FORM_FIELD_CONTROL,
      useExisting: ArdiumRangeCalendarComponent,
    },
  ],
})
export class ArdiumRangeCalendarComponent extends _AbstractCalendar<DateRange> {
  readonly componentId = '200';
  readonly componentName = 'calendar';
  readonly isRangeSelector = true;

  constructor(@Inject(ARD_CALENDAR_DEFAULTS) defaults: ArdCalendarDefaults) {
    super(defaults);

    effect(() => {
      const start = this.selectionStart();
      const end = this.selectionEnd();

      if (isDefined(start) && !isDefined(end)) {
        this.startSelection.emit(start);
      }
      if (!isDefined(start)) {
        this.value.set(null);
        return;
      }
      // avoid re-emitting same value
      const value = untracked(() => this.value());
      if (value && value.from.valueOf() === start.valueOf() && value.to?.valueOf() === end?.valueOf()) {
        return;
      }
      this.value.set(new DateRange(start, end));
      this._emitChange();
    });
  }

  readonly value = model<DateRange | null>(null);

  readonly startSelection = output<Date>();

  readonly endDate = this.selectionEnd.asReadonly();

  override writeValue(v: any): void {
    if (isObject(v) && 'from' in v && 'to' in v && isDate(v['from']) && isDate(v['to'])) {
      this.selectionStart.set(v['from']);
      this.selectionEnd.set(v['to']);
    } else if (!isDefined(v)) {
      this.selectionStart.set(null);
      this.selectionEnd.set(null);
    } else {
      console.error(
        new Error(`ARD-NF2003: <ard-range-calendar> [writeValue] expected a { from: Date, to: Date } object or null, got "${v}".`)
      );
    }
  }
}
