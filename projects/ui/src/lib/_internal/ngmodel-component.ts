import {
  computed,
  Directive,
  inject,
  Injector,
  input,
  OnDestroy,
  OnInit,
  runInInjectionContext,
  Signal,
  signal,
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { map, Subscription } from 'rxjs';
import { TakeChance as Random } from 'take-chance';
import { _FocusableComponentBase, _focusableComponentDefaults, _FocusableComponentDefaults } from './focusable-component';

export interface _NgModelComponentDefaults extends _FocusableComponentDefaults {
  required: boolean | undefined;
}

export const _ngModelComponentDefaults: _NgModelComponentDefaults = {
  ..._focusableComponentDefaults,
  required: undefined,
};

/**
 * Common code for components which implement the ControlValueAccessor.
 *
 * **Warning**: `writeValue` function should be implemented on the child component!
 */
@Directive()
export abstract class _NgModelComponentBase extends _FocusableComponentBase implements ControlValueAccessor, OnInit, OnDestroy {
  protected override readonly _DEFAULTS!: _NgModelComponentDefaults;

  //! control value accessor
  protected _onChangeRegistered!: (_: any) => void;
  protected _onTouchedRegistered!: () => void;
  /**
   * Registers a function to handle touched state. Required by ControlValueAccessor.
   * @param fn The function to register.
   */
  registerOnTouched(fn: () => void): void {
    this._onTouchedRegistered = fn;
  }
  /**
   * Registers a function to handle value change. Required by ControlValueAccessor.
   * @param fn The function to register.
   */
  registerOnChange(fn: (_: any) => void): void {
    this._onChangeRegistered = fn;
  }
  /**
   * Sets the component's disabled state. Required by ControlValueAccessor.
   * @param isDisabled the new disabled state.
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  /**
   * Writes the a new value into the component. Required by ControlValueAccessor.
   * @abstract
   * @param v The new value to write.
   */
  abstract writeValue(v: any): void; //* abstract

  /**
   * Writes the a new value into the component. Required by ControlValueAccessor.
   * @abstract
   * @param v The new value to write.
   */
  protected abstract _emitChange(): void; //* abstract

  //! event handlers
  readonly wasTouched = signal<boolean>(false);

  override onFocus(event: FocusEvent): void {
    super.onFocus(event);
    this._shouldEmitTouched = false;
  }

  private _shouldEmitTouched = false;
  override onBlur(event: FocusEvent) {
    this._shouldEmitTouched = true;
    super.onBlur(event);

    setTimeout(() => {
      if (!this._shouldEmitTouched) return;
      this.wasTouched.set(true);
      this._onTouchedRegistered?.();
    }, 0);
  }

  //! form field related
  protected readonly _injector = inject(Injector);

  private _statusChangesSub?: Subscription;
  ngOnInit(): void {
    this._ngControl = this._injector.get(NgControl, null);

    if (this._ngControl) {
      if (!this._ngControl.valueAccessor || this && this instanceof (this._ngControl.valueAccessor as any).constructor) {
        this._ngControl.valueAccessor = this;
      }

      this._hasErrorInControl.set(this._ngControl.status === 'INVALID');

      this._statusChangesSub = this._ngControl.statusChanges
        ?.pipe(map(v => v === 'INVALID'))
        .subscribe(v => this._hasErrorInControl.set(v));

      if (!this._ngControl.control) return;

      runInInjectionContext(this._injector, () => {
        // do not read the next line of code if you are easily frightened
        // I'm not proud of this part, but it had to be done. God please forgive me
        // I didn't find any other feasible way to detect when the control changes its touched state
        // so it had to be hacked like this
        toObservable((this._ngControl?.control as any | undefined)?.touchedReactive as Signal<boolean>)?.subscribe(v =>
          this.wasTouched.set(v)
        );
      });
    }
  }
  protected _ngControl: NgControl | null = null;

  readonly htmlId = input<string>(Random.id());

  readonly _hasError = input<boolean | undefined, any>(undefined, {
    transform: v => coerceBooleanProperty(v),
    alias: 'hasError',
  });
  private readonly _hasErrorInControl = signal<boolean>(false);
  readonly hasError = computed<boolean>(() => this._hasError() ?? (this.wasTouched() && this._hasErrorInControl()));

  ngOnDestroy(): void {
    this._statusChangesSub?.unsubscribe();
  }
}
