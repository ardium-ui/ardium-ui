import { computed, Directive, inject, Injector, input, runInInjectionContext, Signal, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { NgControl, Validators } from '@angular/forms';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { map, Subscription } from 'rxjs';
import { TakeChance as Random } from 'take-chance';
import { ARD_FORM_FIELD_CONTROL, ArdFormFieldControl } from './form-field-child.token';

@Directive({
  standalone: false,
  selector:
    'ard-form-field > input, ard-form-field > textarea, ard-form-field > select, ard-horizontal-form-field > input, ard-horizontal-form-field > textarea, ard-horizontal-form-field > select',
  providers: [
    {
      provide: ARD_FORM_FIELD_CONTROL,
      useExisting: ArdiumFormFieldNativeInputAdapterDirective,
    },
  ],
  host: {
    '[class.ard-has-error]': 'hasError()',
    '[class.ard-is-success]': 'isSuccess()',
  },
})
export class ArdiumFormFieldNativeInputAdapterDirective implements ArdFormFieldControl {
  readonly _required = input<boolean | undefined, any>(undefined, {
    transform: v => coerceBooleanProperty(v),
    alias: 'required',
  });
  get required() {
    return this._required() ?? !!this._ngControl?.control?.hasValidator(Validators.required);
  }

  readonly isSuccess = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly disabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! form field related
  protected readonly _injector = inject(Injector);

  readonly wasTouched = signal<boolean>(false);

  private _statusChangesSub?: Subscription;
  ngOnInit(): void {
    this._ngControl = this._injector.get(NgControl, null);

    if (this._ngControl) {
      // if (!this._ngControl.valueAccessor || (this && this instanceof (this._ngControl.valueAccessor as any).constructor)) {
      //   this._ngControl.valueAccessor = this;
      // }

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
