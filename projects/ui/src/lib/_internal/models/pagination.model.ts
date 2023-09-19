import { isDefined } from "simple-bool";

export interface PaginationContext {
    itemsPerPageOptions: number[] | { value: number, label: string }[];
    itemsPerPage: number;
    onItemsPerPageChange: (newValue: number) => void;
    totalPages: number;
    totalItems: number;
    page: number;
    currentItemsFirst: number;
    currentItemsLast: number;
    firstPageDisabled: boolean;
    prevPageDisabled: boolean;
    nextPageDisabled: boolean;
    lastPageDisabled: boolean;
    onPageChange: (newPage: number) => void;
}

export class PaginationModel {
    private _totalItems?: number;
    private _itemsPerPageOptions: number[] | { value: number, label: string }[] = [10, 25, 50];
    private _itemsPerPage: number = 50;
    private _page: number = 1;

    //! total items
    setTotalItems(v: number): void {
        this._totalItems = v;
        this._lastPageNumMemo = null;
    }

    //! items per page
    setItemsPerPageOptions(v: number[] | { value: number, label: string }[]): void {
        this._itemsPerPageOptions = v;
    }
    setItemsPerPage(v: number): void {
        this._itemsPerPage = v;
        this._lastPageNumMemo = null;
    }

    private _itemsOnCurrentPageMemo: [number, number] | null = null;
    get itemsOnCurrentPage(): [number, number] | null {
        if (!isDefined(this._totalItems)) return null;
        if (!isDefined(this._itemsOnCurrentPageMemo)) [
            this._itemsOnCurrentPageMemo = [
                (this._page - 1) * this._itemsPerPage + 1,
                this._page * this._itemsPerPage,
            ]
        ]
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
            this._lastPageNumMemo = Math.ceil(this._totalItems / this._itemsPerPage);
        }
        return this._lastPageNumMemo;
    }
    get isLastPage(): boolean {
        if (!isDefined(this._totalItems)) return true;
        return this.lastPageNum === this._page;
    }
    setPage(v: number): void {
        this._page = v;
    }
    firstPage(): number | null {
        if (this.firstPageDisabled) return null;
        this._page = 1;
        return 1;
    }
    prevPage(): number | null {
        if (this.firstPageDisabled) return null;
        this._page -= 1;
        return this._page;
    }
    nextPage(): number | null {
        if (this.lastPageDisabled) return null;
        this._page += 1;
        return this._page;
    }
    lastPage(): number | null {
        if (this.lastPageDisabled) return null;
        this._page = this.lastPageNum!;
        return this._page;
    }

    //! context
    getPartialContext(): Omit<PaginationContext, 'onItemsPerPageChange' | 'onPageChange' | 'onFirstPage' | 'onPrevPage' | 'onNextPage' | 'onLastPage'> {
        if (!isDefined(this._totalItems)) throw new Error("Cannot use pagination model without defining total items first.");
        
        const pageItems = this.itemsOnCurrentPage!;
        return {
            itemsPerPageOptions: this._itemsPerPageOptions,
            itemsPerPage: this._itemsPerPage,
            totalPages: this.lastPageNum!,
            totalItems: this._totalItems,
            page: this._page,
            currentItemsFirst: pageItems[0],
            currentItemsLast: pageItems[1],
            firstPageDisabled: this.firstPageDisabled,
            prevPageDisabled: this.firstPageDisabled,
            nextPageDisabled: this.lastPageDisabled,
            lastPageDisabled: this.lastPageDisabled,
        }
    }
}