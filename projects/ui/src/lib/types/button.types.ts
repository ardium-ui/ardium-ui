

export const ButtonType = {
  Button: 'button',
  Submit: 'submit',
  Reset: 'reset',
} as const;
export type ButtonType = typeof ButtonType[keyof typeof ButtonType];