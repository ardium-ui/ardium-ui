import { ChangeDetectionStrategy, Component, HostBinding, ViewEncapsulation, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'ard-divider',
  template: '',
  styleUrls: ['./divider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumDividerComponent {
  readonly vertical = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  @HostBinding('class.ard-divider-vertical')
  get _verticalHostAttribute() {
    return this.vertical();
  }
}
