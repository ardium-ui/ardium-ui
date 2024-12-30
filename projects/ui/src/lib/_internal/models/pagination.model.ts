import { ModelSignal, Signal, computed } from '@angular/core';
import { isDefined } from 'simple-bool';

export interface PaginationModelHost {
  readonly componentId: string;
  readonly totalItems: Signal<number>;
  readonly options: Signal<number[] | { value: number; label: string }[]>;
  readonly itemsPerPage: ModelSignal<number>;
  readonly page: ModelSignal<number>;
}

export interface PaginationCurrentItemsContext {
  readonly currentItemsFrom: number;
  readonly currentItemsTo: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly page: number;
}

export interface PaginationContext extends PaginationCurrentItemsContext {
  readonly itemsPerPageOptions: number[] | { value: number; label: string }[];
  readonly itemsPerPage: number;
  readonly onItemsPerPageChange: (newValue: number) => void;
  readonly firstPageDisabled: boolean;
  readonly prevPageDisabled: boolean;
  readonly nextPageDisabled: boolean;
  readonly lastPageDisabled: boolean;
  readonly onPageChange: (newPage: number) => void;
}

export class PaginationModel {
  constructor(private readonly _ardHostCmp: PaginationModelHost) {}

  readonly isTotalItemsDefined = computed<boolean>(() => isDefined(this._ardHostCmp.totalItems()));

  readonly lastPageNum = computed<number | null>(() => {
    const total = this._ardHostCmp.totalItems();
    if (!total) return null;
    return Math.ceil(total / this._ardHostCmp.itemsPerPage());
  });
  readonly isLastPage = computed<boolean>(() => {
    return !isDefined(this._ardHostCmp.totalItems()) || this.lastPageNum() === this._ardHostCmp.page();
  });
  readonly itemsOnCurrentPage = computed<[number, number] | null>(() => {
    const total = this._ardHostCmp.totalItems();
    if (!total) return null;
    return [
      Math.min(total, (this._ardHostCmp.page() - 1) * this._ardHostCmp.itemsPerPage() + 1),
      Math.min(total, this._ardHostCmp.page() * this._ardHostCmp.itemsPerPage()),
    ];
  });

  //! action disabled states
  readonly firstPageDisabled = computed<boolean>(() => {
    return !isDefined(this._ardHostCmp.totalItems()) || this._ardHostCmp.page() === 1;
  });
  readonly lastPageDisabled = computed<boolean>(() => {
    return !isDefined(this._ardHostCmp.totalItems()) || this._ardHostCmp.page() === this.lastPageNum();
  });

  //! current page
  setPage(v: number): void {
    this._ardHostCmp.page.set(v);
  }
  getPage(): number {
    return this._ardHostCmp.page();
  }
  goToFirstPage(): number | null {
    if (this.firstPageDisabled()) return null;
    this.setPage(1);
    return 1;
  }
  goToPrevPage(): number | null {
    if (this.firstPageDisabled()) return null;
    this.setPage(this._ardHostCmp.page() - 1);
    return this._ardHostCmp.page();
  }
  goToNextPage(): number | null {
    if (this.lastPageDisabled()) return null;
    this.setPage(this._ardHostCmp.page() + 1);
    return this._ardHostCmp.page();
  }
  goToLastPage(): number | null {
    if (this.lastPageDisabled()) return null;
    this.setPage(this.lastPageNum()!);
    return this._ardHostCmp.page();
  }

  //! context
  readonly getCurrentItemsContext = computed<PaginationCurrentItemsContext>(() => {
    const total = this._ardHostCmp.totalItems();
    if (!total)
      throw new Error(`ARD-FT${this._ardHostCmp.componentId}90: Cannot use pagination model without defining total items first.`);

    const pageItems = this.itemsOnCurrentPage()!;
    return {
      totalPages: this.lastPageNum()!,
      totalItems: total,
      page: this._ardHostCmp.page(),
      currentItemsFrom: pageItems[0],
      currentItemsTo: pageItems[1],
    };
  });
  readonly getPartialContext = computed<Omit<PaginationContext, 'onItemsPerPageChange' | 'onPageChange'>>(() => {
    return {
      ...this.getCurrentItemsContext(),
      itemsPerPageOptions: this._ardHostCmp.options(),
      itemsPerPage: this._ardHostCmp.itemsPerPage(),
      firstPageDisabled: this.firstPageDisabled(),
      prevPageDisabled: this.firstPageDisabled(),
      nextPageDisabled: this.lastPageDisabled(),
      lastPageDisabled: this.lastPageDisabled(),
    };
  });
}
