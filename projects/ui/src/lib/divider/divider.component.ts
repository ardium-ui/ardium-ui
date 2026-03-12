import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { _DividerDirective } from './_internal-directive';

@Component({
  standalone: false,
  selector: 'ard-divider',
  template: '<ng-content />',
  styleUrls: ['./divider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: _DividerDirective, inputs: ['vertical', 'flexItem', 'textAlign', 'variant'] }],
})
export class ArdiumDividerComponent {}
