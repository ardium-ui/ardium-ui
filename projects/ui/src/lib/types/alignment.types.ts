export const SimpleOneAxisAlignment = {
    Left: 'left',
    Right: 'right',
} as const;
export type SimpleOneAxisAlignment = (typeof SimpleOneAxisAlignment)[keyof typeof SimpleOneAxisAlignment];

export const OneAxisAlignment = {
    Left: 'left',
    Middle: 'middle',
    Right: 'right',
} as const;
export type OneAxisAlignment = (typeof OneAxisAlignment)[keyof typeof OneAxisAlignment];
