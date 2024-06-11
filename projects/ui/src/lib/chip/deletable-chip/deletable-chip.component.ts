import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../../_internal/focusable-component';
import { SimpleOneAxisAlignment } from '../../types/alignment.types';
import { ComponentColor } from '../../types/colors.types';
import { DecorationElementAppearance, FormElementVariant } from '../../types/theming.types';

@Component({
  selector: 'ard-deletable-chip',
  templateUrl: './deletable-chip.component.html',
  styleUrls: ['../chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumDeletableChipComponent),
      multi: true,
    },
  ],
})
export class ArdiumDeletableChipComponent extends _FocusableComponentBase {
  readonly DEFAULTS = {
    deleteButtonTitle: 'Delete',
  };

  readonly deleteButtonTitle = input<string>(this.DEFAULTS.deleteButtonTitle);

  //! appearance
  readonly contentAlignment = input<SimpleOneAxisAlignment>(SimpleOneAxisAlignment.Left);
  readonly appearance = input<DecorationElementAppearance>(DecorationElementAppearance.Outlined);
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);
  readonly color = input<ComponentColor>(ComponentColor.Primary);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

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

  //! events
  readonly deleteEvent = output<MouseEvent>({ alias: 'delete' });
}
