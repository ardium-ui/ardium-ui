

import { InjectionToken, Provider } from '@angular/core';
import { _tableDefaults, ArdTableDefaults } from './../table/table.defaults';

export interface ArdTableFromCsvDefaults extends ArdTableDefaults {
  separator: string;
}

const _tableFromCsvDefaults: ArdTableFromCsvDefaults = {
  ..._tableDefaults,
  separator: ',',
};

export const ARD_TABLE_FROM_CSV_DEFAULTS = new InjectionToken<ArdTableFromCsvDefaults>('ard-table-from-csv-defaults', {
  factory: () => ({
    ..._tableFromCsvDefaults
  }),
});

export function provideTableFromCsvDefaults(config: Partial<ArdTableFromCsvDefaults>): Provider {
  return { provide: ARD_TABLE_FROM_CSV_DEFAULTS, useValue: { ..._tableFromCsvDefaults, ...config } };
}