import { computed, effect, signal } from '@angular/core';
import { coerceArrayProperty } from '@ardium-ui/devkit';
import { isAnyString, isArray, isFunction, isNull, isNumber, isRegExp } from 'simple-bool';
import {
  DigitInputAcceptObject,
  DigitInputConfig,
  DigitInputOption,
  DigitInputPrimitiveOption,
  TransformType,
} from './digit-input.types';
import { DigitInputConfigData, DigitInputConfigDataType, DigitInputModelHost, _sanitizeRegExpString } from './digit-input.utils';

export class DigitInputModel {
  constructor(private _ardHost: DigitInputModelHost) {
    //set the value array to be the same length
    effect(
      () => {
        const length = this.configArrayData().length;

        this.value.update(arr => {
          if (!arr) return new Array(length).fill(null);
          if (arr.length >= length) return arr.slice(0, length);
          return [...arr, ...new Array(length - arr.length).fill(null)];
        });
      },
      { allowSignalWrites: true }
    );
  }

  private readonly _configArray = signal<DigitInputOption[]>([]);

  readonly configArrayData = computed<DigitInputConfigData[]>(() => {
    let inputIndex = 0;
    return this._configArray().map(v => {
      if ('static' in v) {
        return {
          type: DigitInputConfigDataType.Static,
          char: v.static,
        } satisfies DigitInputConfigData;
      }
      return {
        type: DigitInputConfigDataType.Input,
        index: inputIndex++,
        readonly: v.readonly,
        placeholder: v.placeholder ?? '',
      } satisfies DigitInputConfigData;
    });
  });

  private readonly _configArrayNoStatics = computed<DigitInputAcceptObject[]>(
    () => this._configArray().filter(v => !('static' in v)) as DigitInputAcceptObject[]
  );

  readonly isConfigDefined = computed((): boolean => this._configArray().length > 0);

  readonly value = signal<(string | null)[] | null>(null);

  readonly stringValue = computed(
    (): string =>
      this.value()
        ?.map(v => v ?? ' ')
        .join('')
        .trimEnd() ?? ''
  );

  readonly isValueFull = computed((): boolean => this.value()?.filter(v => v).length === this._configArrayNoStatics().length);

  isDefinedAtIndex(index: number): boolean {
    return !!this.value()?.[index];
  }

  writeValue(v: any): boolean {
    if (!isArray(v) && !isAnyString(v) && !isNull(v)) {
      //warn when using non-string value
      console.warn(
        new Error(
          `ARD-WA0020: Trying to set <ard-digit-input>'s value to "${v}" (of type ${typeof v}), expected string or array of strings.`
        )
      );
      //normalize the value
      v = v?.toString?.() ?? String(v);
    }
    const vArray = coerceArrayProperty(v);
    const problemIndex = vArray.findIndex(el => !isAnyString(el) || el.length > 1);
    if (problemIndex !== -1) {
      throw new Error(
        `ARD-FT0042: Array passed to <ard-digit-input>'s value must only contain strings of length 1 or 0. Element "${vArray[problemIndex]}" at index ${problemIndex} does not match those requirements.`
      );
    }
    return this._writeValue(vArray);
  }
  private _writeValue(v: string[] | null): boolean {
    const oldVal = this.value();
    this.value.set(v && v.map(el => el || null));
    this.validateValueAndUpdate();
    this._updateInputElements();
    return oldVal !== v;
  }

  private _updateInputElements() {
    const value = this.value ?? [];
    let i = 0;
    for (const inputEl of this._ardHost.inputs()) {
      inputEl.nativeElement.value = value()?.[i] ?? '';
      i++;
    }
  }

  //! setting config
  setConfig(config: DigitInputConfig): void {
    this._setConfig(config);
    this.validateValueAndUpdate();
  }
  private _setConfig(config: DigitInputConfig): void {
    //map a number to ready objects
    let configAsNumber = isAnyString(config) ? Number(config) : null;
    if (isNumber(config) || isNumber(configAsNumber)) {
      configAsNumber = isNumber(config) ? config : configAsNumber!;
      this._configArray.set(new Array(configAsNumber).fill({ accept: (str: string) => /[0-9]/.test(str) }));
      return;
    }
    //map a string to an array
    let configArr: string[] | Exclude<DigitInputConfig, number | string>;
    if (isAnyString(config)) {
      configArr = coerceArrayProperty(config);
    } else {
      configArr = config;
    }
    //map array to ready objects
    this._configArray.set(
      configArr.map((v, i) => {
        if (!isAnyString(v)) {
          if ('accept' in v && !isFunction(v.accept)) {
            const regExp = isRegExp(v.accept) ? v.accept : new RegExp(`[${_sanitizeRegExpString(v.accept)}]`);
            v.accept = str => regExp.test(str);
          }
          return v;
        }

        switch (v) {
          case DigitInputPrimitiveOption.Number:
            return { accept: str => /[0-9]/.test(str) };
          case DigitInputPrimitiveOption.Letter:
            return { accept: str => /[a-zA-Z]/.test(str) };
          case DigitInputPrimitiveOption.Alphanumeric:
            return { accept: str => /[0-9a-zA-Z]/.test(str) };
          case DigitInputPrimitiveOption.Special:
            return { accept: str => /[!@#$%^&*-_=+/\\.,]/.test(str) };

          default:
            if (configArr.length === 1) {
              throw new Error(`ARD-NF0043S: <ard-digit-input>'s config is invalid. Expected number or array, got "${v}"`);
            }
            throw new Error(`ARD-NF0043B: Found invalid string "${v}" in <ard-digit-input>'s config at index ${i}`);
        }
      })
    );
  }

  //! validate against the config
  validateInputAndSetValue(input: string, index: number): null | { wasChanged: boolean, resultChar: string | null } {
    if (index < 0 || index > this._configArrayNoStatics().length) return null;

    let v = this.value();
    //prepare the value array if does not exist
    if (!v) {
      this.value.set([]);
    }
    v = [];
    //prepare the characters before the current one (to be used in validation)
    const before = this.stringValue().charAt(index);

    //remove the old character from the input element
    if (before && input.length > 1 && input.match(before)) {
      input = input.replace(before, '');
    }
    //use only the first or last character (error safety)
    const firstChar = input.charAt(0);
    const lastChar = input.charAt(input.length - 1);
    input = firstChar === before ? lastChar : firstChar;

    //validate and transform, if necessary
    const inputChar = this._validateSingleChar(input, before, this._configArrayNoStatics()[index]);

    //get the corresponding HTML input element
    const inputEl = this._ardHost.inputs()[index];
    if (!inputEl) {
      throw new Error(
        "ARD-IS0048: <ard-digit-input>'s value changed, but its corresponding input element could not be found. This is error is fatal to the functioning of Ardium UI. Please report this issue to the creators."
      );
    }
    //update the input element and value array
    const newVal = inputChar ?? before;
    inputEl.nativeElement.value = newVal ?? '';

    this.value.update(arr => {
      if (!arr) arr = [];
      const newArr = [...arr];
      newArr[index] = newVal || null;
      return newArr;
    });
    //return changes marker and validated value
    return { wasChanged: newVal !== before, resultChar: inputChar };
  }
  validateValueAndUpdate(): void {
    const v = this.value();
    if (!v) return;

    let before = '';
    const newValue: (string | null)[] = [];
    for (let i = 0; i < Math.min(this._configArrayNoStatics().length, v.length); i++) {
      const char = v[i];
      before += char ?? ' ';

      if (!char) {
        newValue.push(char);
        continue;
      }
      const config = this._configArrayNoStatics()[i];

      const newChar = this._validateSingleChar(char, before, config);
      newValue.push(newChar);
    }
    this.value.set(newValue);
  }
  private _validateSingleChar(char: string | null, before: string, config: DigitInputAcceptObject): string | null {
    if (config.readonly) {
      throw new Error(
        `ARD-IS0049R: trying to set value of a <ard-digit-input>'s readonly field. This is error is fatal to the functioning of Ardium UI. Please report this issue to the creators.`
      );
    }
    if (!isFunction(config.accept)) {
      const regExp = isRegExp(config.accept) ? config.accept : new RegExp(`[${_sanitizeRegExpString(config.accept)}]`);
      config.accept = str => regExp.test(str);
    }
    if (!char) return char;

    const canAccept = config.accept(char, before);
    if (!canAccept) return null;

    if (config.transform) {
      if (config.transform === TransformType.Lowercase) {
        return char.toLowerCase();
      }
      if (config.transform === TransformType.Uppercase) {
        return char.toUpperCase();
      }
      console.warn(
        `ARD-IS0049T: <ard-digit-input>'s value validator encountered an unexpected value of the config's "transform" property. Ardium UI was able to handle this issue, but please report it to the creators.`
      );
    }
    return char;
  }
}
