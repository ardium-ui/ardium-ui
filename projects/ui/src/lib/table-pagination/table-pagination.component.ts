import { ChangeDetectionStrategy, Component, ViewEncapsulation, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { PaginationModel } from '../_internal/models/pagination.model';
import { coerceNumberProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../_internal/focusable-component';

@Component({
  selector: 'ard-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumTablePaginationComponent extends _FocusableComponentBase implements OnInit {
    private readonly _pagination = new PaginationModel();

    @Input()
    set options(v: number[] | { value: number, label: string }[]) {
        this._pagination.setItemsPerPageOptions(v);
    }
    @Input()
    set itemsPerPage(v: any) {
        const num = coerceNumberProperty(v);
        this._pagination.setItemsPerPage(num);
    }
    get itemsPerPage(): number {
        return this._pagination.getItemsPerPage();
    }
    @Input()
    set page(v: any) {
        const num = coerceNumberProperty(v);
        this._pagination.setPage(num);
    }
    get page(): number {
        return this._pagination.getPage();
    }
    @Input()
    set totalItems(v: any) {
        const num = coerceNumberProperty(v);
        this._pagination.setTotalItems(num);
    }

    @Output('itemsPerPageChange') itemsPerPageChangeEvent = new EventEmitter<number>();
    @Output('pageChange') pageChangeEvent = new EventEmitter<number>();

    ngOnInit(): void {
        if (this._pagination.isTotalItemsDefined) return;
        throw new Error("Table pagination requires [totalItems] to be defined");
    }


    onItemsPerPageChange(newValue: number): void {
        if (newValue == this.itemsPerPage) return;
        this._pagination.setItemsPerPage(newValue);
        this.itemsPerPageChangeEvent.emit(this.itemsPerPage);
    }

    onPageChange(newPage: number): void {
        if (newPage == this.page) return;
        this._pagination.setPage(newPage);
        this.pageChangeEvent.emit(this.page);
    }
    onFirstPage(): void {
        const newPage = this._pagination.firstPage();
        if (!newPage) return;
        this.pageChangeEvent.emit(this.page);
    }
    onPrevPage(): void {
        const newPage = this._pagination.prevPage();
        if (!newPage) return;
        this.pageChangeEvent.emit(this.page);
    }
    onNextPage(): void {
        const newPage = this._pagination.nextPage();
        if (!newPage) return;
        this.pageChangeEvent.emit(this.page);
    }
    onLastPage(): void {
        const newPage = this._pagination.lastPage();
        if (!newPage) return;
        this.pageChangeEvent.emit(this.page);
    }
}
