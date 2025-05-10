import { ChangeDetectionStrategy, Component, ViewEncapsulation, computed, inject } from '@angular/core';
import { ARD_CALENDAR_DEFAULTS } from './calendar.defaults';

@Component({
  selector: 'ard-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCalendarComponent {
  protected readonly _DEFAULTS = inject(ARD_CALENDAR_DEFAULTS);

  //! appearance

  readonly ngClasses = computed((): string => [].join(' '));
}
