import { isAnyString, isDefined, isNull, isNumber } from 'simple-bool';
import { ArdTransformer, RegExpTransformer } from './input-transformers';
import { ElementRef, computed, signal, Signal, effect } from '@angular/core';

export interface SimpleInputModelHost {
  maxLength?: number;
}
export class SimpleInputModel {
  protected _hostComp!: SimpleInputModelHost;
  constructor(protected inputEl: HTMLInputElement, hostComp: SimpleInputModelHost) {
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
      console.warn(
        new Error(
          `ARD-WA0020: Trying to set <ard-simple-input>'s value to "${v}" (of type ${typeof v}), expected string or null.`
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
    const oldVal = this.value;
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
  //! constraints
  protected _applyLengthTransformer(v: string | null): string | null {
    //exit if max length not specified
    if (this._hostComp.maxLength === undefined) return v;
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
    const oldVal = this.value;
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
    const { text, caretPos } = new RegExpTransformer(this._hostComp.charlist).apply(v, prev, this.caretPos);
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
  constructor(protected readonly _ardHostCmp: NumberInputModelHost) {
    effect(() => {
      const el = this._ardHostCmp.inputEl()?.nativeElement;
      if (!el) return;
      el.value = this.stringValue();
    });
  }

  //! value setters/getters
  protected readonly _value = signal<string | null>(null);
  readonly value = this._value.asReadonly();
  readonly stringValue = computed(() => this._value() ?? '');
  readonly numberValue = computed(() => (this._value() === null ? null : Number(this._value())));

  setValue(v: string | number | null): void {
    const stringV = isDefined(v) && !isAnyString(v) ? String(v) : v;
    this._value.set(stringV);
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
    this._ardHostCmp.inputEl()?.nativeElement.setSelectionRange(pos, pos);
  }

  //! constraints
  private _removeDecimalPlaces(v: string | number | null): string | number {
    if (!v) return '';
    if (this._ardHostCmp.allowFloat()) return v;

    let num = isNumber(v) ? v : Number(v);

    if (!isNumber(v) && v.match(/[.,].+/)) {
      num = Number(v);
    }
    if (!isNaN(num)) num = Math.round(num);
    return num;
  }
  private _applyNumberConstraint(v: string | number): string {
    if (!v) return '';

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
