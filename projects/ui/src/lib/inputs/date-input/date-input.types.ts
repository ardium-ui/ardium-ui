export type ArdDateInputSerializeFn = (date: Date | null) => string;
export type ArdDateInputDeserializeFn = (date: string, prevValue: Date | null) => Date | null;

export interface ArdDateInputValueContext {
  $implicit: Date | null;
}
