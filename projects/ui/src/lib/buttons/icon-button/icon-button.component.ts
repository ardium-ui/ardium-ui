import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../../_internal/focusable-component';
import { ComponentColor } from '../../types/colors.types';

@Component({
  selector: 'ard-icon-button',
  templateUrl: './icon-button.component.html',
  styleUrls: ['./icon-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumIconButtonComponent extends _FocusableComponentBase {
  @Input() wrapperClasses: string = '';

  //! button settings
  @Input() color: ComponentColor = ComponentColor.Primary;

  private _compact: boolean = false;
  @Input()
  get compact(): boolean {
    return this._compact;
  }
  set compact(v: any) {
    this._compact = coerceBooleanProperty(v);
  }

  get ngClasses(): string {
    return ['ard-appearance-transparent', `ard-color-${this.disabled ? ComponentColor.None : this.color}`, this.compact ? 'ard-compact' : ''].join(' ');
  }
}
