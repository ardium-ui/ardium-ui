import { isAnyString, isDefined, isNull } from 'simple-bool';
import { RegExpTransformer } from './input-transformers';
import { CaseTransformerType } from './input-types';
import { ElementRef, Signal, computed, signal } from '@angular/core';
import { Nullable } from '../types/utility.types';

export interface HexInputModelHost {
  readonly case: Signal<CaseTransformerType>;
  readonly maxDigits: Signal<Nullable<number>>;
  readonly textInputEl: Signal<ElementRef<HTMLInputElement> | undefined>;
}
export class HexInputModel {
  constructor(protected readonly _hostComp: HexInputModelHost) {}

  //! value setters/getters
  readonly value = signal<string | null>(null);
  readonly stringValue = computed<string>(() => this.value() ?? '');
  //value with the hash sign
  readonly hashSignValue = computed<string>(() => '#' + this.stringValue());

  //! write value handlers
  writeValue(v: any): boolean {
    if (!isAnyString(v) && !isNull(v)) {
      //warn when using non-string/non-null value
      console.warn(
        new Error(`ARD-WA0160: Trying to set <ard-hex-input>'s value to "${v}" (of type ${typeof v}), expected string or null.`)
      );
      //normalize the value
      v = v?.toString?.() ?? String(v);
    }
    //normalize the value
    v = v ?? '';
    if (typeof v === 'string') v = v.replace('#', '');

    return this._writeValue(v);
  }
  protected _writeValue(v: string | null): boolean {
    const oldVal = this.value();
    //constraints
    if (v) {
      v = this._applyCharactersConstraint(v);
      v = this._applyDigitsConstraint(v, oldVal ?? '');
      v = this._applyCaseTransformer(v);
    }
    //update view
    this.value.set(v);
    this._updateInputElement();
    return oldVal !== v;
  }
  clear(): void {
    this._writeValue(null);
  }
  rewriteValueAfterHostUpdate(): void {
    this._writeValue(this.value());
  }

  //! input element methods
  _updateInputElement() {
    const el = this._hostComp.textInputEl()?.nativeElement;
    if (!el) return;
    const caretPos = this.caretPos;
    el.value = this.stringValue();
    this.caretPos = caretPos;
  }
  get caretPos(): number {
    return this._hostComp.textInputEl()?.nativeElement.selectionEnd ?? this.stringValue().length;
  }
  set caretPos(pos: number) {
    this._hostComp.textInputEl()?.nativeElement.setSelectionRange(pos, pos);
  }

  //! constraints
  private _charactersRegexTransformer = new RegExpTransformer(/[^0-9a-f]/i, '');
  private _applyCharactersConstraint(v: string): string {
    const { text, caretPos } = this._charactersRegexTransformer.apply(v, '', this.caretPos);
    this.caretPos = caretPos;
    return text;
  }
  private _applyDigitsConstraint(v: string, prev: string): string {
    const maxLength = this._hostComp.maxDigits();
    if (!isDefined(maxLength)) return v;
    if (v.length <= maxLength) return v;
    if (v.length < prev.length) return v;

    let firstChangeIndex = 0;
    while (
      firstChangeIndex < v.length &&
      (!prev.charAt(firstChangeIndex) || v.charAt(firstChangeIndex) === prev.charAt(firstChangeIndex)) &&
      firstChangeIndex <= maxLength
    ) {
      firstChangeIndex++;
    }
    if (firstChangeIndex > maxLength) return v.substring(0, maxLength);

    const overflow = v.length - maxLength;
    this.caretPos -= overflow;
    return v.substring(0, firstChangeIndex) + v.substring(firstChangeIndex + overflow);
  }
  private _applyCaseTransformer(v: string): string {
    if (this._hostComp.case() === CaseTransformerType.Uppercase) return v.toUpperCase();
    if (this._hostComp.case() === CaseTransformerType.Lowercase) return v.toLowerCase();
    return v;
  }
}
