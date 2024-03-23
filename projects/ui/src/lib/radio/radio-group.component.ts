import {
    AfterContentInit,
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    Output,
    QueryList,
    ViewEncapsulation,
    forwardRef,
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
export class ArdiumRadioGroupComponent
    extends _NgModelComponentBase
    implements AfterContentInit, AfterViewInit, OnDestroy
{
    @ContentChildren(ArdiumRadioComponent, { descendants: true })
    private _radios!: QueryList<ArdiumRadioComponent>;

    @HostBinding('attr.id')
    @Input()
    htmlId?: string;

    //! value
    @Input()
    get value(): any {
        return this._selected?.value;
    }
    set value(v: any) {
        this.writeValue(v);
    }

    @Output() valueChange = new EventEmitter<any>();
    @Output('change') changeEvent = new EventEmitter<any>();

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

        this._selected =
            this._radios.find((radio) => v === radio.value) ?? null;
    }

    /** Updates all child radios depending on the currently selected radio. */
    private _updateRadiosByValue(): void {
        if (!this._isContentInit) return;

        this._radios.forEach((radio) => {
            radio.selected = this.value === radio.value;
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
        if (this._selected && !this._selected.selected) {
            this._selected.selected = true;
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
            this._radios.forEach((radio) => {
                radio.name = this.name;
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
        this.selected = selected;
        this.writeValue(selected.value);

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
    private _childEventSubs: Subscription[] = [];
    private _isContentInit: boolean = false;
    ngAfterContentInit(): void {
        this._isContentInit = true;

        if (this._valueBeforeInit !== undefined) {
            this.writeValue(this._valueBeforeInit);
        }

        setTimeout(() => {
            this._updateRadioButtonNames();
        }, 0);

        this._radios.forEach((radio) => {
            this._childEventSubs.push(
                radio.blurEvent.subscribe((v) => {
                    this._handleBlurEvents(v);
                }),
            );
            this._childEventSubs.push(
                radio.focusEvent.subscribe((v) => {
                    this._handleFocusEvents(v);
                }),
            );
            this._childEventSubs.push(
                radio.selectedChange.subscribe(() => {
                    this._handleChangeEvents(radio);
                }),
            );
        });
    }
    ngAfterViewInit(): void {
        const sub = (
            this._radios.changes as Observable<ArdiumRadioComponent[]>
        ).subscribe((radios) => {
            setTimeout(() => {
                this._updateRadioButtonNames();
            }, 0);

            this._destroyChildSubscriptions();

            //sub to child component events
            for (const radio of radios) {
                this._childEventSubs.push(
                    radio.blurEvent.subscribe((v) => {
                        this._handleBlurEvents(v);
                    }),
                );
                this._childEventSubs.push(
                    radio.focusEvent.subscribe((v) => {
                        this._handleFocusEvents(v);
                    }),
                );
                this._childEventSubs.push(
                    radio.selectedChange.subscribe(() => {
                        this._handleChangeEvents(radio);
                    }),
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
