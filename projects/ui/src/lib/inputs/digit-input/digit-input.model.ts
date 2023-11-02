import { coerceArrayProperty } from "@ardium-ui/devkit";
import { isAnyString, isArray, isFunction, isNull, isNumber, isRegExp, isString } from "simple-bool";
import { _sanitizeRegExpString } from "./digit-input.utils";
import { QueryList } from '@angular/core';

export interface DigitInputModelHost {
    inputs: QueryList<HTMLInputElement>;
}

export const TransformType = {
    Uppercase: 'uppercase',
    Lowercase: 'lowercase',
} as const;
export type TransformType = typeof TransformType[keyof typeof TransformType];

export const DigitInputPrimitiveOption = {
    Number: 'number',
    Letter: 'letter',
    Alphanumeric: 'alphanumeric',
    Special: 'special',
} as const;
export type DigitInputPrimitiveOption = typeof DigitInputPrimitiveOption[keyof typeof DigitInputPrimitiveOption];

type DigitInputAcceptObject = {
    accept: string | RegExp | ((char: string, charsBefore: string) => boolean);
    transform?: TransformType | null;
};
type DigitInputStaticObject = { static: string; };

export type DigitInputOption = DigitInputAcceptObject | DigitInputStaticObject;

export type DigitInputConfig = (DigitInputPrimitiveOption | DigitInputOption)[] | string | number;

export const DigitInputConfigDataType = {
    Input: 'input',
    Static: 'static',
} as const;
export type DigitInputConfigDataType = typeof DigitInputConfigDataType[keyof typeof DigitInputConfigDataType];

export type DigitInputConfigData = {
    type: DigitInputConfigDataType;
    char?: string;
    index?: number;
}

export class DigitInputModel {

    constructor(private _ardParentEl: DigitInputModelHost) {}

    private _configArray: DigitInputOption[] = [];
    private set configArray(arr: DigitInputOption[]) {
        this._configArray = arr;
        this._configArrayNoStatics = arr.filter(v => !('static' in v)) as DigitInputAcceptObject[];
    }
    private _configArrayNoStatics: DigitInputAcceptObject[] = [];
    
    get configArrayData(): DigitInputConfigData[] {
        let inputIndex = 0;
        return this._configArray.map(v => {
            if ('static' in v) {
                return {
                    type: DigitInputConfigDataType.Static,
                    char: v.static,
                };
            }
            return {
                type: DigitInputConfigDataType.Input,
                index: inputIndex++,
            }
        });
    }

    private _value: (string | null)[] | null = null;
    private set value(v: (string | null)[] | null) { this._value = v; }
    get value(): (string | null)[] | null { return this._value; }

    get stringValue(): string {
        return this.value?.map(v => v ?? ' ').join('').trimEnd() ?? '';
    }

    writeValue(v: any): boolean {
        if (!isArray(v) && !isAnyString(v) && !isNull(v)) {
            //warn when using non-string/non-null value
            console.warn(new Error(`Trying to set digit-input's value to ${typeof v}, expected string or array of strings.`));
            //normalize the value
            v = v?.toString?.() ?? String(v);
        }
        const vArray = coerceArrayProperty(v);
        if (vArray.every(el => isAnyString(el))) {
            const problemIndex = vArray.findIndex(el => !isAnyString(el) || el.length > 1);
            throw new Error(`Array passed to digit-input's value must only contain strings of length 1 or 0. Element at index ${problemIndex} does not match those requirements.`);
        }
        return this._writeValue(vArray);
    }
    private _writeValue(v: string[] | null): boolean {
        let oldVal = this.value;
        this.value = v && v.map(el => el || null);
        this.validateValueAndUpdate();
        this._updateInputElements();
        return oldVal !== v;
    }

    private _updateInputElements() { //TODO

    }

    //! setting config
    setConfig(config: DigitInputConfig): void {
        this._setConfig(config);
        this.validateValueAndUpdate();
    }
    private _setConfig(config: DigitInputConfig): void {
        //map a number to ready objects
        if (isNumber(config)) {
            this._configArray = 'a'
                .repeat(config)
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
                    throw new Error(`Found invalid string in digit-input's config: "${v}" at index ${i}`);
            }
        });
    }

    //! validate against the config
    validateInputAndSetValue(input: string, index: number): boolean {
        if (index < 0 || index > this._configArrayNoStatics.length) return false;
        input = input.charAt(0);

        if (!this.value) {
            this.value = [];
        }
        const before = this.value.slice(0, index).map(v => v ?? ' ').join('');

        const oldVal = this.value[index];
        const transformed = this._validateSingleChar(input, before, this._configArrayNoStatics[index]);
        this.value[index] = transformed;

        return transformed != oldVal;
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
        if (!isFunction(config.accept)) {
            const regExp = isRegExp(config.accept) ? config.accept : new RegExp(`[${_sanitizeRegExpString(config.accept)}]`);
            config.accept = str => regExp.test(str);
            console.warn(`ARD-NF090A: digit-input's value validator encountered an unexpected value of the config's "accept" property. This is not fatal to the functioning of Ardium UI, but please report this issue to the creators.`);
        }
        if (!char) return char;

        const canAccept = config.accept(char, before);
        if (!canAccept) return null;

        if (config.transform) {
            if (config.transform == TransformType.Lowercase) {
                return char.toLowerCase();
            }
            if (config.transform == TransformType.Uppercase) {
                return char.toUpperCase();
            }
            console.warn(`ARD-NF090T: digit-input's value validator encountered an unexpected value of the config's "transform" property. This is not fatal to the functioning of Ardium UI, but please report this issue to the creators.`)
        }
        return char;
    }
}