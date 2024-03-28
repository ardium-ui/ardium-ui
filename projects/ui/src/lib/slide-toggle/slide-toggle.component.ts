import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ComponentColor } from '../types/colors.types';
import { _BooleanComponentBase } from './../_internal/boolean-component';

@Component({
  selector: 'ard-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: ['./slide-toggle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumSlideToggleComponent),
      multi: true,
    },
  ],
})
export class ArdiumSlideToggleComponent extends _BooleanComponentBase implements ControlValueAccessor {
  @Input() wrapperClasses: string = '';

  //* appearance
  @Input() color: ComponentColor = ComponentColor.Primary;
  @Input() icon?: string;
  @Input() selectedIcon?: string;
  @Input() unselectedIcon?: string;

  get ngClasses(): string {
    return [`ard-color-${this.color}`].join(' ');
  }
}
