import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { _FocusableComponentBase } from '../_internal/focusable-component';
import { PaginationModel } from '../_internal/models/pagination.model';
import { ComponentColor } from '../types/colors.types';
import { CurrentItemsFormatFn, PaginationAlign } from './table-pagination.types';

@Component({
  selector: 'ard-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumTablePaginationComponent extends _FocusableComponentBase implements OnInit {
  private readonly _pagination = new PaginationModel();

  //! main settings
  @Input()
  set options(v: number[] | { value: number; label: string }[]) {
    this._pagination.setItemsPerPageOptions(v);
  }
  get options(): number[] | { value: number; label: string }[] {
    return this._pagination.getItemsPerPageOptions();
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
    throw new Error('Table pagination requires [totalItems] to be defined');
  }

  //! appearance
  @Input() color: ComponentColor = ComponentColor.Primary;
  @Input() align: PaginationAlign = PaginationAlign.Split;

  private _compact: boolean = false;
  @Input()
  get compact(): boolean {
    return this._compact;
  }
  set compact(v: any) {
    this._compact = coerceBooleanProperty(v);
  }

  get ngClasses(): string {
    return [`ard-color-${this.color}`, `ard-align-${this.align}`, this.compact ? 'ard-compact' : ''].join(' ');
  }

  //! miscellaneous
  private _useFirstLastButtons: boolean = false;
  @Input()
  get useFirstLastButtons(): boolean {
    return this._useFirstLastButtons;
  }
  set useFirstLastButtons(v: any) {
    this._useFirstLastButtons = coerceBooleanProperty(v);
  }

  @Input() isLoading?: boolean;

  @Input() itemsPerPageText: string = 'Items per page:';
  @Input() currentItemsFormatFn: CurrentItemsFormatFn = ({ currentItemsFirst, currentItemsLast, totalItems }) => {
    return `${currentItemsFirst} – ${currentItemsLast} of ${totalItems}`;
  };

  //! contexts
  getCurrentItemsContext() {
    return this._pagination.getCurrentItemsContext();
  }

  get firstPageDisabled(): boolean {
    return this._pagination.firstPageDisabled;
  }
  get lastPageDisabled(): boolean {
    return this._pagination.lastPageDisabled;
  }

  //! methods
  onItemsPerPageChange(newValue: number): void {
    if (this.isLoading) return;
    if (newValue == this.itemsPerPage) return;
    this._pagination.setItemsPerPage(newValue);
    this.itemsPerPageChangeEvent.emit(this.itemsPerPage);
    this._emitPageEvent();
  }

  private _emitPageEvent(): void {
    this.pageChangeEvent.emit(this.page);
  }
  onPageChange(newPage: number): void {
    if (this.isLoading) return;
    if (newPage == this.page) return;
    this._pagination.setPage(newPage);
    this._emitPageEvent();
  }
  onFirstPage(): void {
    if (this.isLoading) return;
    const newPage = this._pagination.firstPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
  onPrevPage(): void {
    if (this.isLoading) return;
    const newPage = this._pagination.prevPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
  onNextPage(): void {
    if (this.isLoading) return;
    const newPage = this._pagination.nextPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
  onLastPage(): void {
    if (this.isLoading) return;
    const newPage = this._pagination.lastPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
}
