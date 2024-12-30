import { Component } from '@angular/core';
import { _FocusableComponentBaseWithDefaults, _focusableComponentDefaults } from './../focusable-component';

@Component({
  selector: 'ard-clear-button',
  templateUrl: './clear-button.component.html',
  styleUrls: ['./clear-button.component.scss'],
})
export class _ClearButtonComponent extends _FocusableComponentBaseWithDefaults {
  constructor() {
    super(_focusableComponentDefaults);
  }
}
