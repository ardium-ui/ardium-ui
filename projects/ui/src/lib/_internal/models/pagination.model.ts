import { isDefined } from 'simple-bool';

export interface PaginationCurrentItemsContext {
    currentItemsFirst: number;
    currentItemsLast: number;
    totalItems: number;
    totalPages: number;
    page: number;
}

export interface PaginationContext extends PaginationCurrentItemsContext {
    itemsPerPageOptions: number[] | { value: number; label: string }[];
    itemsPerPage: number;
    onItemsPerPageChange: (newValue: number) => void;
    firstPageDisabled: boolean;
    prevPageDisabled: boolean;
    nextPageDisabled: boolean;
    lastPageDisabled: boolean;
    onPageChange: (newPage: number) => void;
}

export class PaginationModel {
    private _totalItems?: number;
    private _itemsPerPageOptions:
        | number[]
        | { value: number; label: string }[] = [10, 25, 50];
    private _itemsPerPage: number = 50;
    private _page: number = 1;

    //! total items
    setTotalItems(v: number): void {
        this._totalItems = v;
        this._lastPageNumMemo = null;
        this._itemsOnCurrentPageMemo = null;
    }
    get isTotalItemsDefined(): boolean {
        return isDefined(this._totalItems);
    }

    //! items per page
    setItemsPerPageOptions(
        v: number[] | { value: number; label: string }[],
    ): void {
        this._itemsPerPageOptions = v;
    }
    getItemsPerPageOptions(): number[] | { value: number; label: string }[] {
        return this._itemsPerPageOptions;
    }
    setItemsPerPage(v: number): void {
        this._itemsPerPage = v;
        this._lastPageNumMemo = null;
        this._itemsOnCurrentPageMemo = null;
        this.setPage(1);
    }
    getItemsPerPage(): number {
        return this._itemsPerPage;
    }

    private _itemsOnCurrentPageMemo: [number, number] | null = null;
    get itemsOnCurrentPage(): [number, number] | null {
        if (!isDefined(this._totalItems)) return null;
        if (!isDefined(this._itemsOnCurrentPageMemo))
            [
                (this._itemsOnCurrentPageMemo = [
                    Math.min(
                        this._totalItems,
                        (this._page - 1) * this._itemsPerPage + 1,
                    ),
                    Math.min(this._totalItems, this._page * this._itemsPerPage),
                ]),
            ];
        return this._itemsOnCurrentPageMemo;
    }

    //! action disabled states
    get firstPageDisabled(): boolean {
        return !isDefined(this._totalItems) || this._page == 1;
    }
    get lastPageDisabled(): boolean {
        return !isDefined(this._totalItems) || this._page == this.lastPageNum;
    }

    //! current page
    private _lastPageNumMemo: number | null = null;
    get lastPageNum(): number | null {
        if (!isDefined(this._totalItems)) return null;
        if (!isDefined(this._lastPageNumMemo)) {
            this._lastPageNumMemo = Math.ceil(
                this._totalItems / this._itemsPerPage,
            );
        }
        return this._lastPageNumMemo;
    }
    get isLastPage(): boolean {
        if (!isDefined(this._totalItems)) return true;
        return this.lastPageNum === this._page;
    }
    setPage(v: number): void {
        this._page = v;
        this._itemsOnCurrentPageMemo = null;
    }
    getPage(): number {
        return this._page;
    }
    firstPage(): number | null {
        if (this.firstPageDisabled) return null;
        this.setPage(1);
        return 1;
    }
    prevPage(): number | null {
        if (this.firstPageDisabled) return null;
        this.setPage(this._page - 1);
        return this._page;
    }
    nextPage(): number | null {
        if (this.lastPageDisabled) return null;
        this.setPage(this._page + 1);
        return this._page;
    }
    lastPage(): number | null {
        if (this.lastPageDisabled) return null;
        this.setPage(this.lastPageNum!);
        return this._page;
    }

    //! context
    getCurrentItemsContext(): PaginationCurrentItemsContext {
        if (!isDefined(this._totalItems))
            throw new Error(
                'Cannot use pagination model without defining total items first.',
            );

        const pageItems = this.itemsOnCurrentPage!;
        return {
            totalPages: this.lastPageNum!,
            totalItems: this._totalItems,
            page: this._page,
            currentItemsFirst: pageItems[0],
            currentItemsLast: pageItems[1],
        };
    }
    getPartialContext(): Omit<
        PaginationContext,
        'onItemsPerPageChange' | 'onPageChange'
    > {
        return {
            ...this.getCurrentItemsContext(),
            itemsPerPageOptions: this._itemsPerPageOptions,
            itemsPerPage: this._itemsPerPage,
            firstPageDisabled: this.firstPageDisabled,
            prevPageDisabled: this.firstPageDisabled,
            nextPageDisabled: this.lastPageDisabled,
            lastPageDisabled: this.lastPageDisabled,
        };
    }
}
