import { ChangeDetectionStrategy, Component, computed, forwardRef, input, Input, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { ComponentColor } from '../../types/colors.types';
import { DecorationElementAppearance, FormElementVariant } from '../../types/theming.types';
import { _BooleanComponentBase } from './../../_internal/boolean-component';

@Component({
  selector: 'ard-selectable-chip',
  templateUrl: './selectable-chip.component.html',
  styleUrls: ['../chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumSelectableChipComponent),
      multi: true,
    },
  ],
})
export class ArdiumSelectableChipComponent extends _BooleanComponentBase implements ControlValueAccessor {
  readonly DEFAULTS = {
    chipTitle: 'Select',
  };

  readonly chipTitle = input<string>(this.DEFAULTS.chipTitle);
  readonly hideSelectionIcon = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

  //! appearance
  readonly contentAlignment = input<SimpleOneAxisAlignment>(SimpleOneAxisAlignment.Left);
  readonly appearance = input<DecorationElementAppearance>(DecorationElementAppearance.Outlined);
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);
  readonly color = input<ComponentColor>(ComponentColor.Primary);

  readonly compact = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

  readonly wrapperClasses = input<string>('');

  readonly ngClasses = computed(() =>
    [
      this.wrapperClasses(),
      `ard-chip-align-${this.contentAlignment()}`,
      `ard-variant-${this.variant()}`,
      `ard-appearance-${this.appearance()}`,
      `ard-color-${this.color()}`,
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );
}
