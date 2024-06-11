import { coerceArrayProperty } from '@ardium-ui/devkit';
import { isAnyString, isArray, isDefined, isFunction, isNull, isNumber, isRegExp } from 'simple-bool';
import {
  DigitInputAcceptObject,
  DigitInputConfig,
  DigitInputOption,
  DigitInputPrimitiveOption,
  TransformType,
} from './digit-input.types';
import { DigitInputConfigDataType, DigitInputModelHost, _sanitizeRegExpString } from './digit-input.utils';

export class DigitInputModel {
  constructor(private _ardHost: DigitInputModelHost) {}

  private _configArray: DigitInputOption[] = [];
  private set configArray(arr: DigitInputOption[]) {
    this._configArray = arr;
    this._configArrayNoStatics = arr.filter(v => !('static' in v)) as DigitInputAcceptObject[];
    this.setConfigArrayData();
  }
  private _configArrayNoStatics: DigitInputAcceptObject[] = [];

  setConfigArrayData() {
    let inputIndex = 0;
    this._ardHost.configArrayData = this._configArray.map(v => {
      if ('static' in v) {
        return {
          type: DigitInputConfigDataType.Static,
          char: v.static,
        };
      }
      return {
        type: DigitInputConfigDataType.Input,
        index: inputIndex++,
      };
    });
  }
  get isConfigDefined(): boolean {
    return this._configArray.length > 0;
  }

  private _value: (string | null)[] | null = null;
  private set value(v: (string | null)[] | null) {
    this._value = v;
    this._stringValueMemo = null;
  }
  get value(): (string | null)[] | null {
    return this._value;
  }

  private _stringValueMemo: string | null = null;
  get stringValue(): string {
    if (isNull(this._stringValueMemo)) {
      const v =
        this.value
          ?.map(v => v ?? ' ')
          .join('')
          .trimEnd() ?? '';
      this._stringValueMemo = v;
    }
    return this._stringValueMemo;
  }

  get isValueFull(): boolean {
    return isDefined(this.value) && this.value.length === this._configArrayNoStatics.length;
  }

  isDefinedAtIndex(index: number): boolean {
    return Boolean(this.value?.[index]);
  }

  writeValue(v: any): boolean {
    if (!isArray(v) && !isAnyString(v) && !isNull(v)) {
      //warn when using non-string/non-null value
      console.warn(
        new Error(`ARD-WA0041: Trying to set <ard-digit-input>'s value to ${typeof v}, expected string or array strings.`)
      );
      //normalize the value
      v = v?.toString?.() ?? String(v);
    }
    const vArray = coerceArrayProperty(v);
    const problemIndex = vArray.findIndex(el => !isAnyString(el) || el.length > 1);
    if (problemIndex !== -1) {
      throw new Error(
        `ARD-FT0042: Array passed to <ard-digit-input>'s value must only contain strings of length 1 or 0. Element at index ${problemIndex} does not match those requirements.`
      );
    }
    return this._writeValue(vArray);
  }
  private _writeValue(v: string[] | null): boolean {
    const oldVal = this.value;
    this.value = v && v.map(el => el || null);
    this.validateValueAndUpdate();
    this._updateInputElements();
    return oldVal !== v;
  }

  private _updateInputElements() {
    const value = this.value ?? [];
    let i = 0;
    for (const inputEl of this._ardHost.inputs) {
      inputEl.nativeElement.value = value[i] ?? '';
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
      this.configArray = 'a'
        .repeat(configAsNumber)
        .split('')
        .map(() => ({ accept: str => /[0-9]/.test(str) }));
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
    this.configArray = configArr.map((v, i) => {
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
          throw new Error(`ARD-NF0043B: Found invalid string in <ard-digit-input>'s config: "${v}" at index ${i}`);
      }
    });
  }

  //! validate against the config
  validateInputAndSetValue(input: string, index: number): false | [boolean, string | null] {
    if (index < 0 || index > this._configArrayNoStatics.length) return false;

    //prepare the value array if does not exist
    if (!this.value) {
      this.value = [];
    }
    //prepare the characters before the current one (to be used in validation)
    const before = this.value
      .slice(0, index)
      .map(v => v ?? ' ')
      .join('');

    //remove the old character from the input element
    const oldVal = this.value[index];
    if (oldVal && input.length > 1 && input.match(oldVal)) {
      input = input.replace(oldVal, '');
    }
    //use only the first character (error safety)
    input = input.charAt(0);

    //validate and transform, if necessary
    const inputChar = this._validateSingleChar(input, before, this._configArrayNoStatics[index]);

    //get the corresponding HTML input element
    const inputEl = this._ardHost.inputs.get(index);
    if (!inputEl) {
      throw new Error(
        "ARD-IS0048: <ard-digit-input>'s value changed, but its corresponding input element could not be found. This is error is fatal to the functioning of Ardium UI. Please report this issue to the creators."
      );
    }
    //update the input element and value array
    const newVal = inputChar ?? oldVal;
    inputEl.nativeElement.value = newVal ?? '';
    this.value[index] = newVal;

    //return changes marker and validated value
    return [newVal !== oldVal, inputChar];
  }
  validateValueAndUpdate(): void {
    const v = this.value;
    if (!v) return;

    let before = '';
    const newValue: (string | null)[] = [];
    for (let i = 0; i < Math.min(this._configArrayNoStatics.length, v.length); i++) {
      const char = v[i];
      before += char ?? ' ';

      if (!char) {
        newValue.push(char);
        continue;
      }
      const config = this._configArrayNoStatics[i];

      const newChar = this._validateSingleChar(char, before, config);
      newValue.push(newChar);
    }
    this.value = newValue;
  }
  private _validateSingleChar(char: string | null, before: string, config: DigitInputAcceptObject): string | null {
    if (config.readonly) {
      throw new Error(
        `ARD-IS0049R: trying to set value of a digit-input's readonly field. This is error is fatal to the functioning of Ardium UI. Please report this issue to the creators.`
      );
    }
    if (!isFunction(config.accept)) {
      const regExp = isRegExp(config.accept) ? config.accept : new RegExp(`[${_sanitizeRegExpString(config.accept)}]`);
      config.accept = str => regExp.test(str);
      console.warn(
        `ARD-IS0049A: digit-input's value validator encountered an unexpected value of the config's "accept" property. Ardium UI was able to handle this issue, but please report it to the creators.`
      );
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
        `ARD-IS0049T: digit-input's value validator encountered an unexpected value of the config's "transform" property. Ardium UI was able to handle this issue, but please report it to the creators.`
      );
    }
    return char;
  }
}
