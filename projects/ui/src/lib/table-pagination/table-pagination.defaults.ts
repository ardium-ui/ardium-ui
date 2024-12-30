import { InjectionToken, Provider } from '@angular/core';
import { ComponentColor, CurrentItemsFormatFn, PaginationAlign } from '@ardium-ui/ui';
import { _focusableComponentDefaults, _FocusableComponentDefaults } from '../_internal/focusable-component';

export interface ArdTablePaginationDefaults extends _FocusableComponentDefaults {
  options: number[] | { value: number; label: string }[];
  itemsPerPage: number;
  page: number;
  color: ComponentColor;
  align: PaginationAlign;
  compact: boolean;
  useFirstLastButtons: boolean;
  itemsPerPageText: string;
  currentItemsFormatFn: CurrentItemsFormatFn;
}

const _tablePaginationDefaults: ArdTablePaginationDefaults = {
  ..._focusableComponentDefaults,
  options: [10, 25, 50],
  itemsPerPage: 50,
  page: 1,
  color: ComponentColor.None,
  align: PaginationAlign.Split,
  compact: false,
  useFirstLastButtons: false,
  itemsPerPageText: 'Items per page:',
  currentItemsFormatFn: ({ currentItemsFrom, currentItemsTo, totalItems }) =>
    `${currentItemsFrom} – ${currentItemsTo} of ${totalItems}`,
};

export const ARD_TABLE_PAGINATION_DEFAULTS = new InjectionToken<ArdTablePaginationDefaults>('ard-table-pagination-defaults', {
  factory: () => ({
    ..._tablePaginationDefaults,
  }),
});

export function provideTablePaginationDefaults(config: Partial<ArdTablePaginationDefaults>): Provider {
  return { provide: ARD_TABLE_PAGINATION_DEFAULTS, useValue: { ..._tablePaginationDefaults, ...config } };
}
