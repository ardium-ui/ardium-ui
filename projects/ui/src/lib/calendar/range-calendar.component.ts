import { ChangeDetectionStrategy, Component, effect, forwardRef, Inject, model, output, ViewEncapsulation } from '@angular/core';
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
      const start = this.valueInternalStart();
      const end = this.valueInternalEnd();
      if (!isDefined(start) || !isDefined(end)) {
        return;
      }
      this.value.set(new DateRange(start, end));
      this._emitChange();
    });
    effect(() => {
      const start = this.valueInternalStart();
      if (isDefined(start)) {
        this.startSelection.emit(start);
      }
    });
  }

  readonly value = model<DateRange | null>(null);

  readonly startSelection = output<Date>();

  readonly endDate = this.valueInternalEnd.asReadonly();

  override writeValue(v: any): void {
    if (isObject(v) && 'from' in v && 'to' in v && isDate(v['from']) && isDate(v['to'])) {
      this.valueInternalStart.set(v['from']);
      this.valueInternalEnd.set(v['to']);
    } else if (!isDefined(v)) {
      this.valueInternalStart.set(null);
      this.valueInternalEnd.set(null);
    } else {
      console.error(
        new Error(`ARD-NF2003: <ard-range-calendar> [writeValue] expected a { from: Date, to: Date } object or null, got "${v}".`)
      );
    }
  }
}
