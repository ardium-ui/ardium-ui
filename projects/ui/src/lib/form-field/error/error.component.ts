import { Component } from '@angular/core';
import { ArdiumErrorDirective } from './error.directive';

@Component({
  selector: 'ard-error',
  template: '<ng-content />',
  hostDirectives: [{ directive: ArdiumErrorDirective }],
})
export class ArdiumErrorComponent {}
