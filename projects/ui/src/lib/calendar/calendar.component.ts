import { ChangeDetectionStrategy, Component, effect, forwardRef, Inject, model, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isDefined } from 'simple-bool';
import { ARD_FORM_FIELD_CONTROL } from '../form-field/form-field-child.token';
import { _AbstractCalendar } from './abstract-calendar';
import { ARD_CALENDAR_DEFAULTS, ArdCalendarDefaults } from './calendar.defaults';

@Component({
  standalone: false,
  selector: 'ard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumCalendarComponent),
      multi: true,
    },
    {
      provide: ARD_FORM_FIELD_CONTROL,
      useExisting: ArdiumCalendarComponent,
    },
  ],
})
export class ArdiumCalendarComponent extends _AbstractCalendar<Date> {
  readonly componentId = '200';
  readonly componentName = 'calendar';
  readonly isRangeSelector = false;

  constructor(@Inject(ARD_CALENDAR_DEFAULTS) defaults: ArdCalendarDefaults) {
    super(defaults);

    effect(() => {
      const v = this.valueInternalStart();
      if (!isDefined(v)) {
        return;
      }
      this.value.set(v);
    });
  }

  readonly value = model<Date | null>(null);

  override writeValue(v: any): void {
    if (v instanceof Date) {
      this.valueInternalStart.set(v);
    } else if (!isDefined(v)) {
      this.valueInternalStart.set(null);
    } else {
      console.error(new Error(`ARD-NF2003: <ard-calendar> [writeValue] expected a Date or null, got "${v}".`));
    }
  }
}
