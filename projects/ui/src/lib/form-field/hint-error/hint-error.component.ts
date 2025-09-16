import { Component } from '@angular/core';
import { ArdiumHintErrorDirective } from './hint-error.directive';

@Component({
  standalone: false,
  selector: 'ard-hint-error',
  template: '<ng-content />',
  hostDirectives: [{ directive: ArdiumHintErrorDirective, inputs: ['left', 'right'] }],
})
export class ArdiumHintErrorComponent {}
