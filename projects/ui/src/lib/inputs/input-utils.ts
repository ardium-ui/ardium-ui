import { isAnyString, isNull } from 'simple-bool';
import { RegExpTransformer } from './input-transformers';

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
    get value(): string | null { return this._value; }
    set value(v: string | null) { this._value = v; }
    get stringValue(): string { return this._value ?? '' }
    set stringValue(v: string) { this._value = v || null; }

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
        let { text, caretPos } = new RegExpTransformer(
            this._hostComp.charlist
        ).apply(
            v,
            prev,
            this.caretPos,
        );
        this.caretPos = caretPos;
        return text;
    }
}
export function escapeAndCreateRegex(str: string, flags?: string, negated: boolean = true): RegExp {
    str = str.replace(/([\]]+)/g, '\\$1');
    return new RegExp(`[${negated ? '^' : ''}${str}]`, flags);
}

