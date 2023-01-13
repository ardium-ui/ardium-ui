import { ChangeDetectionStrategy, Component, forwardRef, HostListener, Input, OnInit, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { isString } from 'simple-bool';
import { ArdiumSimpleInputComponent } from '../simple-input/simple-input.component';
import { coerceBooleanProperty } from './../../utils';
import { escapeAndCreateRegex, InputModel, InputModelHost } from './../input-utils';

@Component({
    selector: 'ard-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumInputComponent),
            multi: true
        }
    ]
})
export class ArdiumInputComponent extends ArdiumSimpleInputComponent implements InputModelHost, OnInit {

    override readonly DEFAULTS = {
        clearButtonTitle: 'Clear',
    }
    //* input view
    protected override inputModel!: InputModel;
    override ngOnInit(): void {
        this.inputModel = new InputModel(this.textInputEl.nativeElement, this);
        this._setInputAttributes();
        //set the value
        if (this._valueBeforeInit) {
            this.writeValue(this._valueBeforeInit);
            delete this._valueBeforeInit;
        }
    }

    //* allowlist/denylist of characters
    //use standard string for denylist, prepend with ^ for allowlist
    private _charlistRegExp?: RegExp;
    @Input()
    get charlist(): RegExp | undefined { return this._charlistRegExp; }
    set charlist(v: any) {
        if (!isString(v)) {
            throw new Error("charlistRegExp must be a non-empty string.");
        }
        let flags = this._charlistCaseInsensitive ? 'i' : '';
        let negated = v.startsWith('^');
        this._charlistRegExp = escapeAndCreateRegex(v, flags, !negated);
    }
    protected _charlistCaseInsensitive: boolean = false;
    @Input()
    set charlistCaseInsensitive(v: any) {
        this._charlistCaseInsensitive = coerceBooleanProperty(v);
        if (this._charlistRegExp) {
            let flags = this._charlistCaseInsensitive ? 'i' : '';
            this._charlistRegExp = new RegExp(this._charlistRegExp.source, flags);
        }
    }

    //* suggestions
    protected _suggestion?: string | null;
    @Input()
    set suggestion(v: string | null | undefined) {
        this._suggestion = v;
    }
    get suggestion(): string | null | undefined {
        return this._suggestion ?? '';
    }
    //should show suggestion
    get shouldDisplaySuggestion(): boolean {
        return !this.disabled && Boolean(this.suggestion);
    }
    //suggestion event
    @Output('acceptSuggestion') acceptSuggestionEvent = new EventEmitter();

    //* key press handlers
    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Tab':
            case 'Enter': {
                this._onTabOrEnterPress(event);
                return;
            }
        }
    }
    protected _onTabOrEnterPress(event: KeyboardEvent): void {
        if (!this.shouldDisplaySuggestion) return;
        event.preventDefault();
        this.onInput(this.suggestion ?? '');
        this.acceptSuggestionEvent.emit();
    }
}
