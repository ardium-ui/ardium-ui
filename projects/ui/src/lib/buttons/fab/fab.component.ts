import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _ButtonBase } from '../_button-base';
import { FABSize } from '../general-button.types';

@Component({
  selector: 'ard-fab',
  templateUrl: './fab.component.html',
  styleUrls: ['./fab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumFabComponent extends _ButtonBase {
  //! appearance
  @Input() size: FABSize = FABSize.Standard;

  private _extended: boolean = false;
  @Input()
  get extended(): boolean {
    return this._extended;
  }
  set extended(v: any) {
    this._extended = coerceBooleanProperty(v);
  }

  get ngClasses(): string {
    return [
      `ard-appearance-${this.appearance}`,
      `ard-color-${this.color}`,
      `ard-fab-size-${this.size}`,
      this.lightColoring ? `ard-light-coloring` : '',
      this.extended ? 'ard-fab-extended' : '',
    ].join(' ');
  }
}
