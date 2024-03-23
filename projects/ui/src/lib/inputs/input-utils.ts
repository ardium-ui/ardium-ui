import { isAnyString, isNull, isNumber } from 'simple-bool';
import { ArdTransformer, RegExpTransformer } from './input-transformers';

export interface SimpleInputModelHost {
    maxLength?: number;
}
export class SimpleInputModel {
    protected _hostComp!: SimpleInputModelHost;
    constructor(
        protected inputEl: HTMLInputElement,
        hostComp: SimpleInputModelHost
    ) {
        this._hostComp = hostComp;
    }

    protected _value: string | null = null;
    get value(): string | null {
        return this._value;
    }
    set value(v: string | null) {
        this._value = v;
    }
    get stringValue(): string {
        return this._value ?? '';
    }
    set stringValue(v: string) {
        this._value = v || null;
    }

    writeValue(v: any): boolean {
        if (!isAnyString(v) && !isNull(v)) {
            //warn when using non-string/non-null value
            console.warn(new Error(`Trying to set simple-input's value to ${typeof v}, expected string.`));
            //normalize the value
            v = v?.toString?.() ?? String(v);
        }
        return this._writeValue(v);
    }
    protected _writeValue(v: string | null): boolean {
        //constraints
        v = this._applyLengthTransformer(v);
        //update view
        let oldVal = this.value;
        this.value = v;
        this._updateInputElement();
        return oldVal !== v;
    }
    rewriteValueAfterHostUpdate(): void {
        this._writeValue(this._value);
    }
    clear(): void {
        this._value = null;
        this._updateInputElement();
    }

    _updateInputElement() {
        this.inputEl.value = this.stringValue;
    }
    get caretPos(): number {
        return this.inputEl.selectionEnd ?? this.stringValue.length;
    }
    set caretPos(pos: number) {
        this.inputEl.setSelectionRange(pos, pos);
    }
    //* constraints
    protected _applyLengthTransformer(v: string | null): string | null {
        //exit if max length not specified
        if (this._hostComp.maxLength == undefined) return v;
        //exit if not value
        //exit if value length is less than specified max length
        if (!v || v.length <= this._hostComp.maxLength) return v;
        //cut the excess off
        v = v.substring(0, this._hostComp.maxLength);
        this.caretPos = this._hostComp.maxLength;
        return v;
    }
}
export interface InputModelHost extends SimpleInputModelHost {
    charlist?: RegExp;
}
export class InputModel extends SimpleInputModel {
    protected override _hostComp!: InputModelHost;
    constructor(inputEl: HTMLInputElement, hostComp: InputModelHost) {
        super(inputEl, hostComp);
    }
    protected override _writeValue(v: string | null): boolean {
        //transformers
        if (v) {
            let prev = this.stringValue;
            v = this._applyAllowOrDenylistTransformer(v, prev);
            prev = this.stringValue;
            v = this._applyLengthTransformer(v);
        }
        let oldVal = this.value;
        //update view
        this.value = v;
        this._updateInputElement();
        return oldVal !== v;
    }

    setSelection(from: number | null, to: number | null): void;
    setSelection(from: number | null, to?: number | null): void {
        to = to ?? this.value?.length ?? Infinity;
        this.inputEl.setSelectionRange(from, to);
    }
    //* constraints
    protected _applyAllowOrDenylistTransformer(v: string, prev: string): string {
        if (!this._hostComp.charlist || !v) return v;
        let { text, caretPos } = new RegExpTransformer(this._hostComp.charlist).apply(v, prev, this.caretPos);
        this.caretPos = caretPos;
        return text;
    }
}

export interface NumberInputModelHost {
    max: number;
    min: number;
    allowFloat: boolean;
}
export class NumberInputModel {
    protected _hostComp!: NumberInputModelHost;
    constructor(
        protected inputEl: HTMLInputElement,
        hostComp: NumberInputModelHost
    ) {
        this._hostComp = hostComp;
    }

    //! value setters/getters
    protected _value: string | null = null;
    get value(): string | null {
        return this._value;
    }
    set value(v: string | null) {
        this._value = v;
    }
    //value as string
    get stringValue(): string {
        return this._value ?? '';
    }
    set stringValue(v: string) {
        this._value = v || null;
    }
    //value as number
    get numberValue(): number | null {
        return (this._value == null && null) || Number(this._value);
    }
    set numberValue(v: number | null) {
        this._value = v == null ? null : v.toString();
    }

    //! write value handlers
    writeValue(v: any): boolean {
        if (!isNumber(v) && !isAnyString(v) && !isNull(v)) {
            //warn when using non-string/non-null value
            console.warn(new Error(`Trying to set simple-input's value to ${typeof v}, expected string, number, or null.`));
            //normalize the value
            v = v?.toString?.() ?? String(v);
        }
        v = String(v);
        return this._writeValue(v);
    }
    protected _writeValue(v: string | null): boolean {
        //constraints
        if (v) {
            v = this._removeDecimalPlaces(v);
            v = this._applyNumberConstraint(v);
            v = this._applyMinMaxConstraints(v);
        }
        //update view
        let oldVal = this.value;
        this.value = v;
        this._updateInputElement();
        return oldVal !== v;
    }
    rewriteValueAfterHostUpdate(): void {
        this._writeValue(this._value);
    }

    //! input element methods
    _updateInputElement() {
        this.inputEl.value = this.stringValue;
    }
    get caretPos(): number {
        return this.inputEl.selectionEnd ?? this.stringValue.length;
    }
    set caretPos(pos: number) {
        this.inputEl.setSelectionRange(pos, pos);
    }

    //! constraints
    private _removeDecimalPlaces(v: string): string {
        if (!v) return '';
        if (this._hostComp.allowFloat) return v;

        if (v.match(/[.,].+/)) {
            const num = Number(v);
            if (!isNaN(num)) v = Math.round(num).toString();
        }
        return v;
    }
    private _applyNumberConstraint(v: string): string {
        if (!v) return '';

        if (this._hostComp.allowFloat) {
            const { text, caretPos } = ArdTransformer.Float(v, this.stringValue, this.caretPos);
            this.caretPos = caretPos;
            return text;
        }
        const { text, caretPos } = ArdTransformer.Integer(v, this.stringValue, this.caretPos);
        this.caretPos = caretPos;
        return text;
    }
    private _applyMinMaxConstraints(v: string): string {
        if (!v) return '';

        const numericValue = Number(v);
        if (numericValue > this._hostComp.max) return this._hostComp.max.toString();
        if (numericValue < this._hostComp.min) return this._hostComp.min.toString();
        return v;
    }
}

export function escapeAndCreateRegex(str: string, flags?: string, negated: boolean = true): RegExp {
    str = str.replace(/([\]]+)/g, '\\$1');
    return new RegExp(`[${negated ? '^' : ''}${str}]`, flags);
}
