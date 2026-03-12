export const SimpleOneAxisAlignment = {
  Left: 'left',
  Right: 'right',
} as const;
export type SimpleOneAxisAlignment = (typeof SimpleOneAxisAlignment)[keyof typeof SimpleOneAxisAlignment];

export const OneAxisAlignment = {
  Left: 'left',
  Center: 'center',
  Right: 'right',
} as const;
export type OneAxisAlignment = (typeof OneAxisAlignment)[keyof typeof OneAxisAlignment];

export const OneAxisAlignmentOrientational = {
  Start: 'start',
  Center: 'center',
  End: 'end',
} as const;
export type OneAxisAlignmentOrientational = (typeof OneAxisAlignmentOrientational)[keyof typeof OneAxisAlignmentOrientational];
