import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from '../types/alignment.types';
import { ComponentColor } from '../types/colors.types';
import { DecorationElementAppearance, FormElementVariant } from '../types/theming.types';
import { _DisablableComponentBase } from './../_internal/disablable-component';

@Component({
  selector: 'ard-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumChipComponent extends _DisablableComponentBase {
  @Input() contentAlignment: SimpleOneAxisAlignment = SimpleOneAxisAlignment.Left;

  //* appearance
  @Input() appearance: DecorationElementAppearance = DecorationElementAppearance.Outlined;
  @Input() variant: FormElementVariant = FormElementVariant.Rounded;
  @Input() color: ComponentColor = ComponentColor.Primary;

  private _compact: boolean = false;
  @Input()
  get compact(): boolean {
    return this._compact;
  }
  set compact(v: any) {
    this._compact = coerceBooleanProperty(v);
  }

  @Input() wrapperClasses: string = '';
  get ngClasses(): string {
    return [
      this.wrapperClasses,
      `ard-chip-align-${this.contentAlignment}`,
      `ard-variant-${this.variant}`,
      `ard-appearance-${this.appearance}`,
      `ard-color-${this.color}`,
      this.compact ? 'ard-compact' : '',
    ].join(' ');
  }
}
