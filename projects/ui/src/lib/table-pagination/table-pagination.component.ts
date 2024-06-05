import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, input, model, output } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
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
  private readonly _pagination = new PaginationModel(this);

  //! main settings
  readonly totalItems = input.required<number>();
  readonly options = input<number[] | { value: number; label: string }[]>([10, 25, 50]);
  readonly itemsPerPage = model<number>(50);
  readonly page = model<number>(1);

  readonly itemsPerPageChangeEvent = output<number>({ alias: 'itemsPerPageChange' });
  readonly pageChangeEvent = output<number>({ alias: 'pageChange' });

  ngOnInit(): void {
    if (this._pagination.isTotalItemsDefined()) return;
    throw new Error('Table pagination requires [totalItems] to be defined'); // TODO
  }

  //! appearance
  readonly color = input<ComponentColor>(ComponentColor.Primary);
  readonly align = input<PaginationAlign>(PaginationAlign.Split);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() => [`ard-color-${this.color()}`, `ard-align-${this.align()}`, this.compact() ? 'ard-compact' : ''].join(' '));

  //! miscellaneous
  readonly useFirstLastButtons = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly isLoading = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly itemsPerPageText = input<string>('Items per page:');

  readonly currentItemsFormatFn = input<CurrentItemsFormatFn>(
    ({ currentItemsFirst, currentItemsLast, totalItems }) => `${currentItemsFirst} – ${currentItemsLast} of ${totalItems}`
  );

  //! contexts
  readonly getCurrentItemsContext = this._pagination.getCurrentItemsContext;

  readonly firstPageDisabled = this._pagination.firstPageDisabled;
  readonly lastPageDisabled = this._pagination.lastPageDisabled;

  //! methods
  onItemsPerPageChange(newValue: number): void {
    if (this.isLoading()) return;
    if (newValue == this.itemsPerPage()) return;
    this.itemsPerPage.set(newValue);
    this.itemsPerPageChangeEvent.emit(this.itemsPerPage());
    this._emitPageEvent();
  }

  private _emitPageEvent(): void {
    this.pageChangeEvent.emit(this.page());
  }
  onPageChange(newPage: number): void {
    if (this.isLoading()) return;
    if (newPage == this.page()) return;
    this._pagination.setPage(newPage);
    this._emitPageEvent();
  }
  onFirstPage(): void {
    if (this.isLoading()) return;
    const newPage = this._pagination.goToFirstPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
  onPrevPage(): void {
    if (this.isLoading()) return;
    const newPage = this._pagination.goToPrevPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
  onNextPage(): void {
    if (this.isLoading()) return;
    const newPage = this._pagination.goToNextPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
  onLastPage(): void {
    if (this.isLoading()) return;
    const newPage = this._pagination.goToLastPage();
    if (!newPage) return;
    this._emitPageEvent();
  }
}
