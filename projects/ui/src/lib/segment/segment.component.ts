import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Input,
  TemplateRef,
  ViewEncapsulation,
  input,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { _SelectableListComponentBase } from '../_internal/selectable-list-component';
import { OneAxisAlignment } from '../types/alignment.types';
import { ComponentColor } from '../types/colors.types';
import { ArdOptionSimple } from '../types/item-storage.types';
import { SimpleItemStorageHost } from './../_internal/item-storages/simple-item-storage';
import { ArdSegmentOptionTemplateDirective } from './segment.directives';
import { SegmentAppearance, SegmentVariant } from './segment.types';

interface SegmentRow {
  options: ArdOptionSimple[];
  isNotFull?: boolean;
}

@Component({
  selector: 'ard-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumSegmentComponent extends _SelectableListComponentBase implements SimpleItemStorageHost, AfterContentInit {
  override readonly _componentId: string = '104';

  //! appearance
  @Input() appearance: SegmentAppearance = SegmentAppearance.Outlined;
  @Input() variant: SegmentVariant = SegmentVariant.RoundedConnected;
  @Input() color: ComponentColor = ComponentColor.Primary;
  @Input() align: OneAxisAlignment = OneAxisAlignment.Middle;

  private _iconBased = false;
  @Input()
  get iconBased(): boolean {
    return this._iconBased;
  }
  set iconBased(v: any) {
    this._iconBased = coerceBooleanProperty(v);
  }

  private _compact = false;
  @Input()
  get compact(): boolean {
    return this._compact;
  }
  set compact(v: any) {
    this._compact = coerceBooleanProperty(v);
  }

  get ngClasses(): string {
    return [
      `ard-appearance-${this.appearance}`,
      `ard-variant-${this.variant}`,
      `ard-color-${this.color}`,
      `ard-align-${this.align}`,
      this.iconBased ? 'ard-icon-based' : '',
      this.compact ? 'ard-compact' : '',
    ].join(' ');
  }

  //! coerced properties
  readonly autoFocus = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly uniformWidths = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly itemsPerRow = input<number, any>(Infinity, {
    transform: v => {
      const newValue = coerceNumberProperty(v, Infinity);
      if (newValue === 0) throw new Error('Cannot set items per row to 0.');
      return newValue;
    },
  });
  get itemsInActualRow(): number {
    return this.itemsPerRow() ?? this.items.length;
  }

  //! option template
  @ContentChild(ArdSegmentOptionTemplateDirective, { read: TemplateRef })
  optionTemplate?: TemplateRef<any>;

  //! lifecycle hooks
  ngAfterContentInit(): void {
    if (this.autoFocus()) {
      this.focus();
    }
  }

  //! item row getters
  private _itemRowsCache: SegmentRow[] | null = null;
  get itemRows(): SegmentRow[] {
    if (this._itemRowsCache) return this._itemRowsCache;

    const itemRows: SegmentRow[] = [];
    let currentRow: ArdOptionSimple[] = [];
    //get all rows
    for (const item of this.items) {
      //add item
      currentRow.push(item);

      //push if item amount reached the limit
      if (this.itemsPerRow() && currentRow.length === this.itemsPerRow()) {
        itemRows.push({ options: currentRow });
        currentRow = [];
      }
    }
    //push the last row if it is not full
    if (currentRow.length !== 0) {
      itemRows.push({
        options: currentRow,
        isNotFull: Boolean(this.itemsPerRow()),
      });
    }

    this._itemRowsCache = itemRows;
    return itemRows;
  }

  //! focus handler override
  override onFocus(event: FocusEvent): void {
    super.onFocus(event);

    if (this.itemStorage.isAnyItemHighlighted()) return;

    this.itemStorage.highlightFirstItem();
  }

  override onBlur(event: FocusEvent): void {
    super.onBlur(event);

    this.itemStorage.unhighlightAll();
  }
}
