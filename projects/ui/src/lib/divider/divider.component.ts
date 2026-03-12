import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ArdiumDividerDirectiveStandalone } from './divider.directive';

@Component({
  standalone: false,
  selector: 'ard-divider',
  template: '<ng-content />',
  styleUrls: ['./divider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [{ directive: ArdiumDividerDirectiveStandalone, inputs: ['vertical', 'flexItem', 'textAlign', 'variant'] }],
})
export class ArdiumDividerComponent {}
