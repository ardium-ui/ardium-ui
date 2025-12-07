import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewEncapsulation,
  computed,
  contentChild,
  effect,
  forwardRef,
  input,
  model,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormValueControl } from '@angular/forms/signals';
import { SimpleComponentColor } from '../types/colors.types';
import { _BooleanComponentBase } from './../_internal/boolean-component';
import { ARD_CHECKBOX_DEFAULTS, ArdCheckboxDefaults } from './checkbox.defaults';
import { ArdCheckboxTemplateDirective } from './checkbox.directives';
import { _CheckboxTemplateRepositoryDirective } from './checkbox.internal-directives';
import { CheckboxState, CheckboxTemplateContext } from './checkbox.types';

@Component({
  standalone: false,
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
export class ArdiumCheckboxComponent extends _BooleanComponentBase implements ControlValueAccessor, FormValueControl<boolean> {
  protected override readonly _DEFAULTS!: ArdCheckboxDefaults;
  constructor(@Inject(ARD_CHECKBOX_DEFAULTS) defaults: ArdCheckboxDefaults) {
    super(defaults);

    effect(() => {
      const isSelected = this.value();
      this.state.set(isSelected ? CheckboxState.Selected : CheckboxState.Unselected);
    });
  }

  //! appearance
  readonly color = input<SimpleComponentColor>(this._DEFAULTS.color);
  readonly unselectedColor = input<SimpleComponentColor>(this._DEFAULTS.unselectedColor);

  readonly ngClasses = computed(() =>
    [`ard-color-${this.color()}`, `ard-unselected-color-${this.unselectedColor()}`, `ard-checkbox-${this.state()}`].join(' ')
  );

  readonly state = model<CheckboxState>(CheckboxState.Unselected);

  readonly State = CheckboxState;

  //! click action
  toggleState() {
    let newState: CheckboxState = CheckboxState.Unselected;
    if (this.state() === CheckboxState.Unselected) {
      newState = CheckboxState.Selected;
    }
    this.state.set(newState);
    this.value.set(this.state() === CheckboxState.Selected);

    this._emitChange();
  }

  //! templates
  readonly templateRepository = contentChild(_CheckboxTemplateRepositoryDirective);

  readonly checkboxTemplate = contentChild(ArdCheckboxTemplateDirective);

  readonly checkboxTemplateContext = computed<CheckboxTemplateContext>(() => ({
    $implicit: this.value(),
    selected: this.value(),
    state: this.state(),
  }));
}
