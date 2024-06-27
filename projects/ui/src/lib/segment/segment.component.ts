import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  contentChild,
  input
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
  override readonly _componentName: string = 'segment';

  //! appearance
  readonly appearance = input<SegmentAppearance>(SegmentAppearance.Outlined);
  readonly variant = input<SegmentVariant>(SegmentVariant.RoundedConnected);
  readonly color = input<ComponentColor>(ComponentColor.Primary);
  readonly align = input<OneAxisAlignment>(OneAxisAlignment.Middle);

  readonly iconBased = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed<string>(() =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-variant-${this.variant()}`,
      `ard-color-${this.color()}`,
      `ard-align-${this.align()}`,
      this.iconBased() ? 'ard-icon-based' : '',
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );

  //! coerced properties
  readonly autoFocus = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly uniformWidths = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly itemsPerRow = input<number, any>(Infinity, {
    transform: v => {
      const newValue = coerceNumberProperty(v, Infinity);
      if (newValue === 0) throw new Error(`ARD-FT1040a: Cannot set <ard-segment>'s [itemsPerRow] to 0.`);
      if (newValue < 0)
        throw new Error(`ARD-FT1040b: Cannot set <ard-segment>'s [itemsPerRow] to a negative value, got "${newValue}".`);
      if (newValue % 1 !== 0) {
        const roundedValue = Math.round(newValue) || 1; // round to nearest int, but never round to zero
        console.warn(
          new Error(
            `ARD-WA1040c: Cannot set <ard-segment>'s [itemsPerRow] to a non-interger value, got "${newValue}". The value was rounded to "${roundedValue}".`
          )
        );
        return Math.ceil(newValue);
      }
      return newValue;
    },
  });
  get itemsInActualRow(): number {
    return this.itemsPerRow() === Infinity ? this.items.length : this.itemsPerRow();
  }

  //! option template
  readonly optionTemplate = contentChild(ArdSegmentOptionTemplateDirective);

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
