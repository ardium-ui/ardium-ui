import { computed, Directive, inject, Injector, input, OnDestroy, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, NgControl, Validators } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { map, Subscription } from 'rxjs';
import { TakeChance as Random } from 'take-chance';
import { _NgModelComponentBase, _NgModelComponentDefaults, _ngModelComponentDefaults } from './ngmodel-component';

export interface _FormFieldComponentDefaults extends _NgModelComponentDefaults {
  required: boolean | undefined;
}

export const _formFieldComponentDefaults: _FormFieldComponentDefaults = {
  ..._ngModelComponentDefaults,
  required: undefined,
};

/**
 * Common code for components which implement the ControlValueAccessor.
 *
 * **Warning**: `writeValue` function should be implemented on the child component!
 */
@Directive()
export abstract class _FormFieldComponentBase extends _NgModelComponentBase implements ControlValueAccessor, OnInit, OnDestroy {
  protected override readonly _DEFAULTS!: _FormFieldComponentDefaults;

  protected readonly _injector = inject(Injector);

  private _statusChangesSub?: Subscription;
  ngOnInit(): void {
    this._ngControl = this._injector.get(NgControl, null);

    if (this._ngControl) {
      this._ngControl.valueAccessor = this;

      this._statusChangesSub = this._ngControl.statusChanges
        ?.pipe(map(v => v === 'INVALID'))
        .subscribe(v => this._hasErrorInControl.set(v));
    }
  }
  protected _ngControl: NgControl | null = null;

  readonly _required = input<boolean | undefined, any>(undefined, {
    transform: v => coerceBooleanProperty(v),
    alias: 'required',
  });
  get required() {
    return this._required() ?? !!this._ngControl?.control?.hasValidator(Validators.required);
  }

  readonly htmlId = input<string>(Random.id());

  readonly _hasError = input<boolean | undefined, any>(undefined, {
    transform: v => coerceBooleanProperty(v),
    alias: 'hasError',
  });
  private readonly _hasErrorInControl = signal<boolean>(false);
  readonly hasError = computed<boolean>(() => this._hasError() ?? (this.wasTouched() && this._hasErrorInControl()));

  readonly isSuccess = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  ngOnDestroy(): void {
    this._statusChangesSub?.unsubscribe();
  }
}
