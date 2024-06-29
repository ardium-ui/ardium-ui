import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  HostBinding,
  Input,
  OnDestroy,
  OutputRefSubscription,
  QueryList,
  ViewEncapsulation,
  forwardRef,
  input,
  output
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ArdiumRadioComponent } from './radio/radio.component';

@Component({
  selector: 'ard-radio-group',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.tabindex]': 'null',
    '[attr.aria-label]': 'null',
    '[attr.aria-labelledby]': 'null',
    '[attr.aria-describedby]': 'null',
    role: 'radiogroup',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ArdiumRadioGroupComponent),
      multi: true,
    },
  ],
})
export class ArdiumRadioGroupComponent extends _NgModelComponentBase implements AfterContentInit, AfterViewInit, OnDestroy {
  @ContentChildren(ArdiumRadioComponent, { descendants: true })
  private _radios!: QueryList<ArdiumRadioComponent>;

  readonly htmlId = input<string>('');

  @HostBinding('attr.id')
  get _htmlIdHostAttribute() {
    return this.htmlId();
  }

  //! value
  @Input()
  get value(): any | undefined {
    return this._selected?.value();
  }
  set value(v: any) {
    this.writeValue(v);
  }

  readonly valueChange = output<any>();
  readonly changeEvent = output<any>({ alias: 'change' });

  private _valueBeforeInit: any;
  writeValue(v: any): void {
    if (this.value !== v) {
      if (!this._isContentInit) {
        this._valueBeforeInit = v;
        return;
      }

      this._findRadioByValue(v);
    }
    setTimeout(() => {
      this._updateRadiosByValue();
    }, 0);
  }

  private _findRadioByValue(v: any): void {
    if (!this._radios) return;

    this._selected = this._radios.find(radio => v === radio.value()) ?? null;
  }

  /** Updates all child radios depending on the currently selected radio. */
  private _updateRadiosByValue(): void {
    if (!this._isContentInit) return;

    this._radios.forEach(radio => {
      radio.selected.set(this.value === radio.value());
      radio.markForCheck();
    });
  }

  private _selected: ArdiumRadioComponent | null = null;
  /**
   * The currently selected radio button. If set to a new radio button, the radio group value
   * will be updated to match the new selected button.
   */
  @Input()
  get selected() {
    return this._selected;
  }
  set selected(selected: ArdiumRadioComponent | null) {
    this._selected = selected;
    this._checkSelectedRadioButton();
  }

  private _checkSelectedRadioButton() {
    if (this._selected && !this._selected.selected()) {
      this._selected.selected.set(true);
      this._selected.markForCheck();
    }
  }

  //! name
  private _name: string = crypto.randomUUID();
  /** Name of the radio button group. All radio buttons inside this group will use this name. */
  @Input()
  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
    this._updateRadioButtonNames();
  }

  private _updateRadioButtonNames(): void {
    if (this._radios) {
      this._radios.forEach(radio => {
        radio.name.set(this.name);
        radio.markForCheck();
      });
    }
  }

  //! update handlers
  private _handleBlurEvents(event: FocusEvent): void {
    this.onBlur(event);
  }
  private _handleFocusEvents(event: FocusEvent): void {
    this.onFocus(event);
  }
  private _handleChangeEvents(selected: ArdiumRadioComponent): void {
    this.writeValue(selected.value());

    this._emitChange();
  }

  protected _emitChange(): void {
    const v = this.value;
    this._onChangeRegistered?.(v);
    this.changeEvent.emit(v);
    this.valueChange.emit(v);
  }

  //! hooks
  private readonly _subscriptions: Subscription[] = [];
  private _childEventSubs: OutputRefSubscription[] = [];
  private _isContentInit = false;
  ngAfterContentInit(): void {
    this._isContentInit = true;

    if (this._valueBeforeInit !== undefined) {
      this.writeValue(this._valueBeforeInit);
    }

    setTimeout(() => {
      this._updateRadioButtonNames();
    }, 0);

    //sub to child component events
    for (const radio of this._radios) {
      this._childEventSubs.push(
        radio.blurEvent.subscribe(v => {
          this._handleBlurEvents(v);
        })
      );
      this._childEventSubs.push(
        radio.focusEvent.subscribe(v => {
          this._handleFocusEvents(v);
        })
      );
      this._childEventSubs.push(
        radio.selectedChange.subscribe((v: boolean) => {
          if (!v) return;
          this._handleChangeEvents(radio);
        })
      );
    }
  }
  ngAfterViewInit(): void {
    const sub = (this._radios.changes as Observable<ArdiumRadioComponent[]>).subscribe(radios => {
      setTimeout(() => {
        this._updateRadioButtonNames();
      }, 0);

      this._destroyChildSubscriptions();

      //sub to child component events
      for (const radio of radios) {
        this._childEventSubs.push(
          radio.blurEvent.subscribe(v => {
            this._handleBlurEvents(v);
          })
        );
        this._childEventSubs.push(
          radio.focusEvent.subscribe(v => {
            this._handleFocusEvents(v);
          })
        );
        this._childEventSubs.push(
          radio.selectedChange.subscribe((v: boolean) => {
            if (!v) return;
            this._handleChangeEvents(radio);
          })
        );
      }
    });

    this._subscriptions.push(sub);
  }
  ngOnDestroy(): void {
    for (const sub of this._subscriptions) {
      sub.unsubscribe();
    }
    this._destroyChildSubscriptions();
  }
  private _destroyChildSubscriptions(): void {
    for (const sub of this._childEventSubs) {
      sub.unsubscribe();
    }
    this._childEventSubs = [];
  }
}
