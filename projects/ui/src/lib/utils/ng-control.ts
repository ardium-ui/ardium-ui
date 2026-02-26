import { computed, inject, Injector, signal } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  ControlValueAccessor,
  FormControlStatus,
  NgControl,
  PristineChangeEvent,
  StatusChangeEvent,
  TouchedChangeEvent,
  ValidationErrors,
  ValidatorFn,
  ValueChangeEvent,
} from '@angular/forms';
import { isEqual } from 'lodash';
import { Subscription } from 'rxjs';
import { isFunction } from 'simple-bool';

export interface FormControlTrackerOptions {
  attachValueAccessor?: boolean;
}

class FormControlTracker<T> {
  constructor(
    private readonly thisObj: any,
    private readonly options: FormControlTrackerOptions = {}
  ) {}

  private readonly _injector = inject(Injector);

  /** The AbstractControl instance attached to the component instance. */
  public readonly instance!: AbstractControl<T>;

  private readonly _value = signal<T>(undefined as T);
  public readonly value = this._value.asReadonly();

  private readonly _errors = signal<ValidationErrors | null>(null, { equal: (a, b) => isEqual(a, b) });
  public readonly errors = this._errors.asReadonly();

  private readonly _touched = signal<boolean>(false);
  public readonly touched = this._touched.asReadonly();
  public readonly untouched = computed(() => !this.touched());

  private readonly _pristine = signal<boolean>(false);
  public readonly pristine = this._pristine.asReadonly();
  public readonly dirty = computed(() => !this.pristine());

  private readonly _status = signal<FormControlStatus>('VALID');
  public readonly status = this._status.asReadonly();
  public readonly valid = computed<boolean>(() => this.status() === 'VALID');
  public readonly invalid = computed<boolean>(() => this.status() === 'INVALID');
  public readonly pending = computed<boolean>(() => this.status() === 'PENDING');
  public readonly disabled = computed<boolean>(() => this.status() === 'DISABLED');
  public readonly enabled = computed(() => !this.disabled());

  private readonly _validators = signal<ValidatorFn[] | null>(null);
  public readonly validators = this._validators.asReadonly();

  private readonly _asyncValidators = signal<AsyncValidatorFn[] | null>(null);
  public readonly asyncValidators = this._asyncValidators.asReadonly();

  private _eventsSub?: Subscription;

  init() {
    const ngControl = this._injector.get(NgControl, null);

    if (ngControl) {
      // if the valueAccessor was not yet set by Angular, we have to do it manually here
      if (this.options.attachValueAccessor ?? true) {
        if (!ngControl.valueAccessor || (this.thisObj && this.thisObj instanceof (ngControl.valueAccessor as any).constructor)) {
          ngControl.valueAccessor = this.thisObj as unknown as ControlValueAccessor;
        }
      }
      // grab the AbstractControl instance
      const instance = ngControl.control;
      if (!instance) return;
      (this as any).instance = instance;

      // listen to all data available in the events emitter
      this._eventsSub = instance.events.subscribe(event => {
        if (event instanceof ValueChangeEvent) {
          this._value.set(event.value);
          return;
        }
        if (event instanceof TouchedChangeEvent) {
          this._touched.set(event.touched);
          return;
        }
        if (event instanceof PristineChangeEvent) {
          this._pristine.set(event.pristine);
          return;
        }
        if (event instanceof StatusChangeEvent) {
          this._status.set(event.status);
          this._errors.set(event.source.errors);
          return;
        }
      });

      this._value.set(instance.value);
      this._touched.set(instance.touched);
      this._pristine.set(instance.pristine);
      this._status.set(instance.status);
      this._errors.set(instance.errors);

      // do not read the next lines of code if you are easily frightened
      // I'm not proud of this part, but it had to be done. God please forgive me
      // I didn't find any other feasible way to detect when the control changes its validators
      // so it had to be hacked like this

      // override the "setValidators" function to capture the validators
      const oldSetValidators = instance.setValidators.bind(instance);
      instance.setValidators = (...args: Parameters<typeof instance.setValidators>) => {
        oldSetValidators(...args);

        const validators = (instance as any)._rawValidators as ValidatorFn | ValidatorFn[] | null;
        this._validators.set(isFunction(validators) ? [validators] : validators);
      };
      // override the "validator" setter to capture the validators
      wrapSetter<AbstractControl<T>>(instance, 'validator', () => {
        const raw = (instance as any)._rawValidators as ValidatorFn | ValidatorFn[] | null;
        this._validators.set(isFunction(raw) ? [raw] : raw);
      });

      // override the "setAsyncValidators" function to capture the async validators
      const oldSetAsyncValidators = instance.setAsyncValidators.bind(instance);
      instance.setAsyncValidators = (...args: Parameters<typeof instance.setAsyncValidators>) => {
        oldSetAsyncValidators(...args);

        const validators = (instance as any)._rawAsyncValidators as AsyncValidatorFn | AsyncValidatorFn[] | null;
        this._asyncValidators.set(isFunction(validators) ? [validators] : validators);
      };
      // override the "asyncValidator" setter to capture the async validators
      wrapSetter<AbstractControl<T>>(instance, 'asyncValidator', () => {
        const raw = (instance as any)._rawAsyncValidators as AsyncValidatorFn | AsyncValidatorFn[] | null;
        this._asyncValidators.set(isFunction(raw) ? [raw] : raw);
      });

      // assign the validators at init time
      const validators = (instance as any)._rawValidators as ValidatorFn | ValidatorFn[] | null;
      this._validators.set(isFunction(validators) ? [validators] : validators);
      const asyncValidators = (instance as any)._rawAsyncValidators as AsyncValidatorFn | AsyncValidatorFn[] | null;
      this._asyncValidators.set(isFunction(asyncValidators) ? [asyncValidators] : asyncValidators);
    }
  }

  destroy() {
    this._eventsSub?.unsubscribe();
  }
}

/**
 * Gives reactive access to the properties of the Form Control assigned to the component instance.
 *
 * Call the `init()` method inside `ngOnInit()` to start listening to the Form Control, call `destroy()` to dispose of the listener.
 *
 * @param thisObj the component instance.
 * @returns an object containing all standard form control getters as signals.
 * @example
 * ```
 * export class MyComponent implements ControlValueAccessor, OnInit, OnDestroy {
 *   readonly control = trackFormControl(this);
 *
 *   ngOnInit(): void {
 *     this.control.init();
 *   }
 *   ngOnDestroy(): void {
 *     this.control.destroy();
 *   }
 *   // control value accessor implementation ...
 * }
 * ```
 */
export function trackFormControl<T = any>(thisObj: any, options: { attachValueAccessor?: boolean } = {}) {
  return new FormControlTracker<T>(thisObj, options);
}

// --- helper: wraps an accessor setter on a single instance ---
function wrapSetter<TObj extends object>(obj: TObj, propName: keyof TObj, after: () => void) {
  // find the accessor descriptor up the prototype chain
  let proto: any = obj;
  let desc: PropertyDescriptor | undefined;

  while (proto && !(desc = Object.getOwnPropertyDescriptor(proto, propName))) {
    proto = Object.getPrototypeOf(proto);
  }

  if (!desc || typeof desc.set !== 'function') {
    throw new Error(`No setter found for ${String(propName)}`);
  }

  const originalSet = desc.set!;
  const originalGet = desc.get; // may exist

  Object.defineProperty(obj, propName, {
    configurable: true,
    enumerable: desc.enumerable ?? true,

    get: originalGet
      ? function (this: TObj) {
          return originalGet.call(this);
        }
      : undefined,

    set: function (this: TObj, value: unknown) {
      originalSet.call(this, value);
      after();
    },
  });
}
