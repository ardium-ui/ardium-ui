import { InjectionToken, Provider } from '@angular/core';

export interface ArdCompositionChartDefaults {
  labelFrom: string;
  valueFrom: string;
  colorFrom: string;
}

const _compositionChartDefaults: ArdCompositionChartDefaults = {
  labelFrom: 'label',
  valueFrom: 'value',
  colorFrom: 'color',
};

export const ARD_COMPOSITION_CHART_DEFAULTS = new InjectionToken<ArdCompositionChartDefaults>('ard-composition-chart-defaults', {
  factory: () => ({
    ..._compositionChartDefaults,
  }),
});

export function provideCompositionChartDefaults(config: Partial<ArdCompositionChartDefaults>): Provider {
  return { provide: ARD_COMPOSITION_CHART_DEFAULTS, useValue: { ..._compositionChartDefaults, ...config } };
}
