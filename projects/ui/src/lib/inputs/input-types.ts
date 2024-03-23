export const CaseTransformerType = {
    NoChange: 'nochange',
    Uppercase: 'uppercase',
    Lowercase: 'lowercase',
} as const;
export type CaseTransformerType = (typeof CaseTransformerType)[keyof typeof CaseTransformerType];
