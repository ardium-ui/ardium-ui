import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewEncapsulation,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { _BooleanComponentBase } from '../../_internal/boolean-component';
import { ComponentColor } from '../../types/colors.types';

@Component({
  selector: 'ard-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumRadioComponent extends _BooleanComponentBase {
  protected readonly _changeDetector = inject(ChangeDetectorRef);

  readonly htmlId = input<string>(crypto.randomUUID());

  readonly value = input<any>();

  //! appearance
  readonly color = input<ComponentColor>(ComponentColor.Primary);

  readonly ngClasses = computed<string>(() =>
    [`ard-color-${this.color()}`, `ard-radio-${this.selected() ? 'selected' : 'unselected'}`].join(' ')
  );

  //! event handlers
  onMousedown(): void {
    this.focus();
  }
  onMouseup(): void {
    this.focus();
    this.selected.set(true);
  }

  //! radio-group access points
  readonly name = signal<string | null>(null);

  /**
   * Marks the radio button as needing checking for change detection.
   * This method is exposed because the parent radio group will directly
   * update bound properties of the radio button.
   */
  markForCheck() {
    // When group value changes, the button will not be notified. Use `markForCheck` to explicit
    // update radio button's status
    this._changeDetector.markForCheck();
  }
}
