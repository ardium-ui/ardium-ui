import { ElementRef, Signal, computed, signal } from '@angular/core';
import { isAnyString, isDefined, isNull, isNumber } from 'simple-bool';
import { Nullable } from '../types/utility.types';
import { ArdTransformer, RegExpTransformer } from './input-transformers';

export interface InputModelHost {
  readonly maxLength: Signal<Nullable<number>>;
  readonly textInputEl: Signal<ElementRef<HTMLInputElement> | undefined>;
}
export class InputModel {
  constructor(protected readonly _ardHostCmp: InputModelHost) {}

  readonly value = signal<string | null>(null);
  readonly stringValue = computed<string>(() => this.value() ?? '');

  writeValue(v: any): boolean {
    if (!isAnyString(v) && !isNull(v)) {
      //warn when using non-string/non-null value
      console.warn(
        new Error(
          `ARD-WA0020: Trying to set <ard-input>'s value to "${v}" (of type ${typeof v}), expected string or null.`
        )
      );
      //normalize the value
      v = v?.toString?.() ?? String(v);
    }
    return this._writeValue(v);
  }
  protected _writeValue(v: string | null): boolean {
    //constraints
    v = this._applyLengthTransformer(v);
    //update view
    const oldVal = this.value();
    this.value.set(v);
    this._updateInputElement();
    return oldVal !== v;
  }
  rewriteValueAfterHostUpdate(): void {
    this._writeValue(this.value());
  }
  clear(): void {
    this.value.set(null);
    this._updateInputElement();
  }

  _updateInputElement() {
    const el = this._ardHostCmp.textInputEl()?.nativeElement;
    if (!el) return;
    el.value = this.stringValue();
  }
  get caretPos(): number {
    return this._ardHostCmp.textInputEl()?.nativeElement.selectionEnd ?? this.stringValue.length;
  }
  set caretPos(pos: number) {
    this._ardHostCmp.textInputEl()?.nativeElement.setSelectionRange(pos, pos);
  }
  //! constraints
  protected _applyLengthTransformer(v: string | null): string | null {
    const max = this._ardHostCmp.maxLength();
    if (!isDefined(max)) return v;
    if (!v || v.length <= max) return v;

    v = v.substring(0, max);
    this.caretPos = max;
    return v;
  }
}
export interface AutocompleteInputModelHost extends InputModelHost {
  charlist: Signal<RegExp | undefined>;
}
export class AutocompleteInputModel extends InputModel {
  constructor(protected override readonly _ardHostCmp: AutocompleteInputModelHost) {
    super(_ardHostCmp);
  }
  protected override _writeValue(v: string | null): boolean {
    //transformers
    if (v) {
      let prev = this.stringValue();
      v = this._applyAllowOrDenylistTransformer(v, prev);
      prev = this.stringValue();
      v = this._applyLengthTransformer(v);
    }
    const oldVal = this.value();
    //update view
    this.value.set(v);
    this._updateInputElement();
    return oldVal !== v;
  }

  setSelection(from: number | null, to: number | null): void;
  setSelection(from: number | null, to?: number | null): void {
    to = to ?? this.value()?.length ?? Infinity;
    this._ardHostCmp.textInputEl()?.nativeElement.setSelectionRange(from, to);
  }
  //* constraints
  protected _applyAllowOrDenylistTransformer(v: string, prev: string): string {
    const charlist = this._ardHostCmp.charlist();
    if (!charlist || !v) return v;
    const { text, caretPos } = new RegExpTransformer(charlist).apply(v, prev, this.caretPos);
    this.caretPos = caretPos;
    return text;
  }
}

export interface NumberInputModelHost {
  readonly max: Signal<number>;
  readonly min: Signal<number>;
  readonly allowFloat: Signal<boolean>;
  readonly inputEl: Signal<ElementRef<HTMLInputElement> | undefined>;
}
export class NumberInputModel {
  constructor(protected readonly _ardHostCmp: NumberInputModelHost) {}

  //! value setters/getters
  protected readonly _value = signal<string | null>(null);
  readonly value = this._value.asReadonly();
  readonly stringValue = computed(() => this._value() ?? '');
  readonly numberValue = computed(() => (this._value() === null ? null : Number(this._value())));

  setValue(v: string | number | null): void {
    const stringV = isNumber(v) ? String(v) : v;
    this._value.set(stringV);
    this._updateInputEl();
  }
  
  private _updateInputEl(): void {
    const stringV = this.stringValue();
    const el = this._ardHostCmp.inputEl()?.nativeElement;
    if (!el) return;

    const caretPos = this.caretPos;
    el.value = stringV;
    this.caretPos = caretPos;
  }

  //! write value handlers
  writeValue(v: any): boolean {
    if (!isNumber(v) && !isAnyString(v) && !isNull(v)) {
      //warn when using non-string/non-null value
      console.warn(
        new Error(`ARD-WA0070: Trying to set <ard-number-input>'s value to "${typeof v}", expected string, number, or null.`)
      );
      //normalize the value
      v = v?.toString?.() ?? String(v);
    }
    v = String(v);
    return this._writeValue(v);
  }
  protected _writeValue(v: string | number | null): boolean {
    //constraints
    if (v) {
      v = this._removeDecimalPlaces(v);
      v = this._applyNumberConstraint(v);
      v = this._applyMinMaxConstraints(v);
    }
    //update view
    const oldVal = this._value();
    this.setValue(v);
    return oldVal !== v;
  }
  rewriteValueAfterHostUpdate(): void {
    this._writeValue(this._value());
  }

  //! input element methods
  get caretPos(): number {
    return this._ardHostCmp.inputEl()?.nativeElement.selectionEnd ?? this.stringValue().length;
  }
  set caretPos(pos: number) {
    const el = this._ardHostCmp.inputEl()?.nativeElement;
    el?.setSelectionRange(pos, pos);
  }

  //! constraints
  private _removeDecimalPlaces(v: string | number | null): string | number {
    if (!v && v !== 0) return '';
    if (this._ardHostCmp.allowFloat()) return v;

    let num = isNumber(v) ? v : Number(v);

    if (!isNumber(v) && v.match(/[.,].+/)) {
      num = Number(v);
    }
    if (!isNaN(num)) return Math.round(num);
    return v;
  }
  private _applyNumberConstraint(v: string | number): string {
    if (!v && v !== 0) return '';

    const transformerFn = this._ardHostCmp.allowFloat() ? ArdTransformer.Float : ArdTransformer.Integer;
    const { text, caretPos } = transformerFn(String(v), this.stringValue(), this.caretPos);
    this.caretPos = caretPos;
    return text;
  }
  private _applyMinMaxConstraints(v: string): string {
    if (!v) return '';

    const numericValue = Number(v);
    if (numericValue > this._ardHostCmp.max()) return this._ardHostCmp.max().toString();
    if (numericValue < this._ardHostCmp.min()) return this._ardHostCmp.min().toString();
    return v;
  }
}

export function escapeAndCreateRegex(str: string, flags?: string, negated = true): RegExp {
  str = str.replace(/([\]]+)/g, '\\$1');
  return new RegExp(`[${negated ? '^' : ''}${str}]`, flags);
}
