export const ClickStrategy = {
  Noop: 'noop',
  Default: 'default',
} as const;
export type ClickStrategy = (typeof ClickStrategy)[keyof typeof ClickStrategy];

/**
 * Represents an array type that must contain at least one element.
 *
 * @template T - The type of elements in the array.
 */
export type NonEmptyArray<T> = [T, ...T[]];

export type Nullable<T> = T | undefined | null;
