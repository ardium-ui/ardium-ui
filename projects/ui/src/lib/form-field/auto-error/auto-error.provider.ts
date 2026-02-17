import { InjectionToken, Provider } from '@angular/core';

export interface ArdErrorMap {
  $fallback?: string;
  [key: string]: string | ((errorData: any) => string) | undefined;
}

export const ARD_ERROR_MAP = new InjectionToken<ArdErrorMap>('ard-error-map', {
  factory: () => ({ $fallback: 'Provide error messages using provideErrorMap' }),
});

export function provideErrorMap(errorMap: ArdErrorMap): Provider {
  return { provide: ARD_ERROR_MAP, useValue: errorMap };
}
