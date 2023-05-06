import { isAnyString, isDefined, isNull } from "simple-bool";
import { RegExpTransformer } from '../input-transformers';
import { CaseTransformerType } from "../input-types";

export interface HexInputModelHost {
    case: CaseTransformerType,
    maxDigits: number | undefined,
}
export class HexInputModel {
    constructor(
        protected inputEl: HTMLInputElement,
        protected _hostComp: HexInputModelHost,
    ) {  }

    //! value setters/getters
    protected _value: string | null = null;
    get value(): string | null { return this._value; }
    set value(v: string | null) { this._value = v; }
    //value as string
    get stringValue(): string { return this._value ?? '' }
    set stringValue(v: string) { this._value = v || null; }

    //! write value handlers
    writeValue(v: any): boolean {
        if (!isAnyString(v) && !isNull(v)) {
            //warn when using non-string/non-null value
            console.warn(new Error(`Trying to set ard-hex-input's value to type ${typeof v}, expected string, or null.`));
        }
        //normalize the value
        v = v ?? '';
        return this._writeValue(v);
    }
    protected _writeValue(v: string | null): boolean {
        const oldVal = this.value;
        //constraints
        if (v) {
            v = this._applyCharactersConstraint(v);
            v = this._applyDigitsConstraint(v, oldVal ?? '');
            v = this._applyCaseTransformer(v);
        }
        //update view
        this.value = v;
        this._updateInputElement();
        return oldVal !== v;
    }
    clear(): void {
        this._writeValue(null);
    }
    rewriteValueAfterHostUpdate(): void {
        this._writeValue(this._value);
    }

    //! input element methods
    _updateInputElement() {
        const caretPos = this.caretPos;
        this.inputEl.value = this.stringValue;
        this.caretPos = caretPos;
    }
    get caretPos(): number {
        return this.inputEl.selectionEnd ?? this.stringValue.length;
    }
    set caretPos(pos: number) {
        this.inputEl.setSelectionRange(pos, pos);
    }

    //! constraints
    private _charactersRegexTransformer = new RegExpTransformer(/[^0-9a-f]/i, '');
    private _applyCharactersConstraint(v: string): string {
        const { text, caretPos } = this._charactersRegexTransformer.apply(v, '', this.caretPos);
        this.caretPos = caretPos;
        return text;
    }
    private _applyDigitsConstraint(v: string, prev: string): string {
        const maxLength = this._hostComp.maxDigits;
        if (!isDefined(maxLength)) return v;
        if (v.length <= maxLength) return v;
        if (v.length < prev.length) return v;

        let firstChangeIndex = 0;
        while (
            firstChangeIndex < v.length
            && (!prev.charAt(firstChangeIndex) || v.charAt(firstChangeIndex) == prev.charAt(firstChangeIndex))
            && firstChangeIndex <= maxLength
        ) {
            firstChangeIndex++;
        }
        if (firstChangeIndex > maxLength) return v.substring(0, maxLength);

        const overflow = v.length - maxLength;
        this.caretPos -= overflow;
        return v.substring(0, firstChangeIndex) + v.substring(firstChangeIndex + overflow);
    }
    private _applyCaseTransformer(v: string): string {
        if (this._hostComp.case == CaseTransformerType.Uppercase) return v.toUpperCase();
        if (this._hostComp.case == CaseTransformerType.Lowercase) return v.toLowerCase();
        return v;
    }
}