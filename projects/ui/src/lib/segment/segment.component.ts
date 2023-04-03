import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, HostBinding, HostListener, Input, Output, TemplateRef, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { ComponentColor } from '../types/colors.types';
import { ArdOption, ArdOptionSimple, OptionContext } from '../_internal/item-storages/item-storage.types';
import { _NgModelComponent } from '../_internal/ngmodel-component';
import { SimpleItemStorage, SimpleItemStorageHost } from './../_internal/item-storages/simple-item-storage';
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
export class ArdiumSegmentComponent extends _NgModelComponent implements SimpleItemStorageHost {

    //! public constants
    readonly itemStorage = new SimpleItemStorage(this);
    readonly htmlId = crypto.randomUUID();
    readonly element!: HTMLElement;
    readonly DEFAULTS = {
        valueFrom: 'value',
        labelFrom: 'label',
        disabledFrom: 'disabled',
    }

    constructor(
        private _cd: ChangeDetectorRef,
    ) {
        super();
    }

    //! binding-related inputs
    @Input() valueFrom?: string;
    @Input() labelFrom?: string;
    @Input() disabledFrom?: string;
    //should the value that the "disabledFrom" path lead to be inverted?
    //useful when the property is e.g. "active", which is the oposite of "disabled"
    @Input() invertDisabled: boolean = false;
    //! other inputs
    @Input() maxSelectedItems?: number;
    @Input() name?: string = this.htmlId;

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

    //! items setter/getter
    @Input()
    get items(): any[] { return this.itemStorage.items }
    set items(value: any[] | null) {
        if (value == null) value = [];
        let shouldPrintErrors = this.itemStorage.setItems(value);

        this._itemRowsCache = null;

        if (shouldPrintErrors) {
            this._printPrimitiveWarnings();
        }
    };

    //! coerced properties
    private _multiselectable: boolean = false;
    @Input()
    @HostBinding('attr.multiple')
    @HostBinding('class.ard-multiselect')
    get multiselectable(): boolean { return this._multiselectable };
    set multiselectable(v: any) { this._multiselectable = coerceBooleanProperty(v); }
    @HostBinding('class.ard-singleselect')
    get singleselectable(): boolean { return !this._multiselectable };

    private _touched: boolean = false;
    @HostBinding('class.ard-touched')
    get touched(): boolean { return this._touched };
    private set touched(state: boolean) {
        this._touched = state;
    }

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

    //! control value accessor
    //override the writeValue and setDisabledState defined in _NgModelComponent
    override setDisabledState(state: boolean): void {
        this._disabled = state;
        this._cd.markForCheck();
    }
    writeValue(ngModel: any[]): void {
        this.itemStorage.handleWriteValue(ngModel);
        this._cd.markForCheck();
    }
    //! change & touch event emitters
    private _emitChanges(): void {
        let value = this.itemStorage.value;
        this._onChangeRegistered?.(value);
        this.changeEvent.emit(value);
        this.valueChange.emit(value);
    }
    private _onTouched(): void {
        if (this.touched) return;

        this._onTouchedRegistered?.();
        this.touched = true;
    }

    //! focus & blur handlers
    lastBlurTimestamp: number | null = null;
    override onFocus(event: FocusEvent): void {
        super.onFocus(event);

        if (this.touched || !this.lastBlurTimestamp || this.lastBlurTimestamp + 1 < Date.now()) return;
        this.lastBlurTimestamp = null;

        this._onTouched();
    }
    override onBlur(event: FocusEvent): void {
        super.onBlur(event);

        if (!this.touched) this.lastBlurTimestamp = Date.now();
    }

    //! value input & output
    @Input()
    set value(newValue: any[]) {
        this.writeValue(newValue);
    }
    @Output() valueChange = new EventEmitter<any[]>();

    //! output events
    @Output('change') changeEvent = new EventEmitter<any[]>();
    @Output('add') addEvent = new EventEmitter<any[]>();
    @Output('remove') removeEvent = new EventEmitter<any[]>();

    //! context providers
    getOptionContext(item: ArdOption): OptionContext {
        return {
            $implicit: item,
            item,
            itemData: item.itemData,
        }
    }

    //! lifecycle hooks
    ngAfterContentInit(): void {
        if (this.autoFocus) {
            this.focus();
        }
    }
    private _printPrimitiveWarnings() {
        function makeWarning(str: string): void {
            console.warn(`Skipped using [${str}] property bound to <ard-segment>, as some provided items are of primitive type`);
        }
        if (this.valueFrom) {
            makeWarning('valueFrom');
        }
        if (this.labelFrom) {
            makeWarning('labelFrom');
        }
        if (this.disabledFrom) {
            makeWarning('disabledFrom');
        }
        if (this.invertDisabled) {
            makeWarning('invertDisabled');
        }
    }

    //! getters
    get firstHighlightedItem(): ArdOptionSimple | undefined {
        return this.itemStorage.highlightedItems?.first();
    }
    get highlightedItems(): ArdOptionSimple[] {
        return this.itemStorage.highlightedItems;
    }
    get isItemLimitReached(): boolean {
        return this.itemStorage.isItemLimitReached;
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

    //! item selection handlers
    toggleItem(item: ArdOption): void {
        if (item.selected) {
            this.unselectItem(item);
            return;
        }
        this.selectItem(item);
    }
    selectItem(...items: ArdOption[]): void {
        let [selected, unselected] = this.itemStorage.selectItem(...items);

        if (unselected.length > 0) this.removeEvent.emit(unselected);

        if (selected.length > 0) {
            this.addEvent.emit(selected);
            this._emitChanges();
        }
    }
    unselectItem(...items: ArdOption[]): void {
        let unselected = this.itemStorage.unselectItem(...items);

        this.removeEvent.emit(unselected);
        this._emitChanges();
    }

    //! highligh-related
    private _isMouseBeingUsed: boolean = false;
    @HostListener('mousemove')
    onMouseMove() {
        this._isMouseBeingUsed = true;
    }
    onItemMouseEnter(option: ArdOption, event: MouseEvent): void {
        console.log(option);
        if (!this._isMouseBeingUsed) return;
        this.itemStorage.highlightSingleItem(option);
        console.log(option);
        event.stopPropagation();
    }
    onItemMouseLeave(option: ArdOption, event: MouseEvent): void {
        if (!this._isMouseBeingUsed) return;
        this.itemStorage.unhighlightItem(option);
        event.stopPropagation();
    }

    //! click handlers
    onItemClick(option: ArdOption, event: MouseEvent): void {
        event.stopPropagation();
        this.toggleItem(option);
    }

    //! key press handlers
    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Space':
            case 'Enter': {
                this._onSpaceOrEnterPress(event);
                return;
            }
            case 'ArrowRight': {
                this._onArrowRightPress(event);
                return;
            }
            case 'ArrowLeft': {
                this._onArrowLeftPress(event);
                return;
            }
            case 'Home': {
                this._onHomePress(event);
                return;
            }
            case 'End': {
                this._onEndPress(event);
                return;
            }
            case 'Tab': {
                this._onTabPress();
                return;
            }
            case 'KeyA': {
                if (event.ctrlKey) {
                    this._onCtrlAPress(event);
                    return;
                }
            }
        }
    }
    private _onSpaceOrEnterPress(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();

        const highlightedItems = this.highlightedItems;

        if (highlightedItems.every(item => item.selected)) {
            this.unselectItem(...highlightedItems);
        }
        else {
            this.selectItem(...highlightedItems);
        }
    }
    private _onArrowLeftPress(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this._isMouseBeingUsed = false;

        this.itemStorage.highlightNextItem(-1, event.shiftKey);
    }
    private _onArrowRightPress(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this._isMouseBeingUsed = false;

        this.itemStorage.highlightNextItem(+1, event.shiftKey);
    }
    private _onHomePress(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this._isMouseBeingUsed = false;

        this.itemStorage.highlightFirstItem();
    }
    private _onEndPress(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this._isMouseBeingUsed = false;

        this.itemStorage.highlightLastItem();
    }
    private _onCtrlAPress(event: KeyboardEvent): void {
        this.itemStorage.highlightAllItems();
    }
    private _onTabPress(): void {
        this.focusLast();
    }
}
