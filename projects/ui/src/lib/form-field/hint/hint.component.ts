import { Component } from '@angular/core';
import { ArdiumHintDirective } from './hint.directive';

@Component({
  selector: 'ard-hint',
  template: '<ng-content />',
  hostDirectives: [{ directive: ArdiumHintDirective, inputs: ['left', 'right'] }],
})
export class ArdiumHintComponent {}
