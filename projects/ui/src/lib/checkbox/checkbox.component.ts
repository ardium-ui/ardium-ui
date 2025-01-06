import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation, computed, forwardRef, input, model } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { SimpleComponentColor } from '../types/colors.types';
import { _BooleanComponentBase } from './../_internal/boolean-component';
import { ARD_CHECKBOX_DEFAULTS, ArdCheckboxDefaults } from './checkbox.defaults';
import { CheckboxState } from './checkbox.types';

@Component({
  selector: 'ard-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumCheckboxComponent),
      multi: true,
    },
  ],
})
export class ArdiumCheckboxComponent extends _BooleanComponentBase implements ControlValueAccessor {
  protected override readonly _DEFAULTS!: ArdCheckboxDefaults;
  constructor(@Inject(ARD_CHECKBOX_DEFAULTS) defaults: ArdCheckboxDefaults) {
    super(defaults);
  }

  readonly htmlId = input<string>('');

  //! appearance
  readonly color = input<SimpleComponentColor>(this._DEFAULTS.color);
  readonly unselectedColor = input<SimpleComponentColor>(this._DEFAULTS.unselectedColor);

  readonly ngClasses = computed(() =>
    [`ard-color-${this.color()}`, `ard-unselected-color-${this.unselectedColor()}`, `ard-checkbox-${this.state()}`].join(' ')
  );

  //override the "selected" setter, so it changes the state too.
  override set _selected(v: any) {
    const selected = coerceBooleanProperty(v);
    this.selected.set(selected);
    this.state.set(selected ? CheckboxState.Selected : CheckboxState.Unselected);
  }

  readonly state = model<CheckboxState>(CheckboxState.Unselected);

  //! click action
  toggleState() {
    let newState: CheckboxState = CheckboxState.Unselected;
    if (this.state() === CheckboxState.Unselected) {
      newState = CheckboxState.Selected;
    }
    this.state.set(newState);
    this.selected.set(this.state() === CheckboxState.Selected);

    this._emitChange();
  }
}
