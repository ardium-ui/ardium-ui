import { ChangeDetectionStrategy, Component, ContentChild, HostBinding, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { ArdOptionSimple } from '../_internal/item-storages/item-storage.types';
import { _SelectableListComponentBase } from '../_internal/selectable-list-component';
import { SimpleItemStorageHost } from './../_internal/item-storages/simple-item-storage';
import { ArdSegmentOptionTemplateDirective } from './segment.directives';
import { SegmentAppearance, SegmentVariant } from './segment.types';

type SegmentRow = {
    options: ArdOptionSimple[];
    isNotFull?: boolean;
}

@Component({
    selector: 'ard-segment',
    templateUrl: './segment.component.html',
    styleUrls: ['./segment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumSegmentComponent extends _SelectableListComponentBase implements SimpleItemStorageHost {

    //! appearance
    @Input() appearance: SegmentAppearance = SegmentAppearance.Outlined;
    @Input() variant: SegmentVariant = SegmentVariant.RoundedConnected;
    @Input() color: ComponentColor = ComponentColor.Primary;

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            `ard-color-${this.color}`,
        ].join(' ');
    }

    //! coerced properties
    @Input()
    @HostBinding('attr.multiple')
    @HostBinding('class.ard-multiselect')
    get multiselectable(): boolean { return this._multiselectable };
    set multiselectable(v: any) { this._multiselectable = coerceBooleanProperty(v); }

    private _autoFocus: boolean = false;
    @Input()
    get autoFocus(): boolean { return this._autoFocus; }
    set autoFocus(v: any) { this._autoFocus = coerceBooleanProperty(v); }

    private _uniformWidths: boolean = false;
    @Input()
    get uniformWidths(): boolean { return this._uniformWidths; }
    set uniformWidths(v: any) { this._uniformWidths = coerceBooleanProperty(v); }

    private _itemsPerRow: number | undefined = undefined;
    @Input()
    get itemsPerRow(): number { return this._itemsPerRow ?? Infinity; }
    set itemsPerRow(v: any) {
        const newValue = coerceNumberProperty(v, undefined)
        if (newValue == 0) throw new Error("Cannot set items per row to 0.");
        this._itemsPerRow = newValue;
    }
    get itemsInActualRow(): number { return this._itemsPerRow ?? this.items.length }
    

    //! option template
    @ContentChild(ArdSegmentOptionTemplateDirective, { read: TemplateRef }) optionTemplate?: TemplateRef<any>;

    //! lifecycle hooks
    ngAfterContentInit(): void {
        if (this.autoFocus) {
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
            if (this._itemsPerRow && currentRow.length == this.itemsPerRow) {
                itemRows.push({ options: currentRow });
                currentRow = [];
            }
        }
        //push the last row if it is not full
        if (currentRow.length != 0) {
            itemRows.push({
                options: currentRow,
                isNotFull: Boolean(this._itemsPerRow)
            });
        }

        this._itemRowsCache = itemRows;
        return itemRows;
    }
}
