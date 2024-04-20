import { ChangeDetectionStrategy, Component, ViewEncapsulation, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';

@Component({
  selector: 'ard-tab',
  templateUrl: './tab.component.html',
  styleUrl: './tab.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumTabComponent {
  readonly disabled = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

  readonly label = input<string>();

  readonly tabId = input<string>();
}
