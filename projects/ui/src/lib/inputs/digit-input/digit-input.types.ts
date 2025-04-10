export const DigitInputShape = {
  Square: 'square',
  Rectangle: 'rectangle',
} as const;
export type DigitInputShape = (typeof DigitInputShape)[keyof typeof DigitInputShape];

export const TransformType = {
  Uppercase: 'uppercase',
  Lowercase: 'lowercase',
} as const;
export type TransformType = (typeof TransformType)[keyof typeof TransformType];

export const DigitInputPrimitiveOption = {
  Number: 'number',
  Letter: 'letter',
  Alphanumeric: 'alphanumeric',
  Special: 'special',
} as const;
export type DigitInputPrimitiveOption = (typeof DigitInputPrimitiveOption)[keyof typeof DigitInputPrimitiveOption];

export interface DigitInputAcceptObject {
  accept: string | RegExp | ((char: string, charsBefore: string) => boolean);
  transform?: TransformType | ((char: string) => string) | null;
  readonly?: boolean;
  placeholder?: string;
}
export interface DigitInputStaticObject {
  static: string;
}

export type DigitInputOption = DigitInputAcceptObject | DigitInputStaticObject;

export type DigitInputConfig =
  /* (DigitInputPrimitiveOption | DigitInputOption)[][] */
  (DigitInputPrimitiveOption | DigitInputOption)[] | string | number;
