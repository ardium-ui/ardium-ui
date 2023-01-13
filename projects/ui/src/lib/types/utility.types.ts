export const ClickStrategy = {
    None: 'none',
    Default: 'default',
} as const;
export type ClickStrategy = typeof ClickStrategy[keyof typeof ClickStrategy];