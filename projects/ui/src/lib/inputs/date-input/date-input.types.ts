export type ArdDateInputSerializeFn = (date: Date | null) => string;
export type ArdDateInputDeserializeFn = (date: string, prevValue: Date | null) => Date | null;

export interface ArdDateInputValueContext {
  $implicit: Date | null;
}

export interface ArdDateInputAcceptButtonsContext {
  $implicit: () => void;
  cancel: () => void;
  accept: () => void;
  disabled: boolean;
}

export const ArdDateInputMinMaxStrategy = {
  Allow: 'allow',
  Adjust: 'adjust',
} as const;
export type ArdDateInputMinMaxStrategy = (typeof ArdDateInputMinMaxStrategy)[keyof typeof ArdDateInputMinMaxStrategy];
