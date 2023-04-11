
import { ChangeDetectorRef, Directive, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { coerceArrayProperty, coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { ArdOptionSimple, OptionContext } from '../types/item-storage.types';
import { SimpleItemStorage, SimpleItemStorageHost } from './item-storages/simple-item-storage';
import { _NgModelComponentBase } from './ngmodel-component';

@Directive()
export abstract class _SelectableListComponentBase extends _NgModelComponentBase implements ControlValueAccessor, SimpleItemStorageHost {

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


    //! items setter/getter
    @Input()
    get items(): any[] { return this.itemStorage.items }
    set items(value: any) {
        if (!Array.isArray(value)) value = coerceArrayProperty(value);

        let shouldPrintErrors = this.itemStorage.setItems(value);

        if (shouldPrintErrors) {
            this._printPrimitiveWarnings();
        }
    };
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

    //! multiselectable
    protected _multiselectable: boolean = false;
    abstract multiselectable: any;
    get singleselectable(): boolean { return !this._multiselectable };

    //! require value
    protected _requireValue: boolean | undefined = undefined;
    abstract requireValue: any;

    //! coerced properties
    //should the value that the "disabledFrom" path lead to be inverted?
    //useful when the property is e.g. "active", which is the oposite of "disabled"
    private _invertDisabled: boolean = false;
    @Input()
    get invertDisabled(): boolean { return this._invertDisabled; }
    set invertDisabled(v: any) { this._invertDisabled = coerceBooleanProperty(v); }

    private _maxSelectedItems: number | undefined = undefined;
    @Input()
    get maxSelectedItems(): number | undefined { return this._maxSelectedItems; }
    set maxSelectedItems(v: any) { this._maxSelectedItems = coerceNumberProperty(v); }

    //! control value accessor
    //override the writeValue and setDisabledState defined in _NgModelComponent
    override setDisabledState(state: boolean): void {
        this._disabled = state;
        this._cd.markForCheck();
    }
    writeValue(ngModel: any[]): void {
        this.itemStorage.writeValue(ngModel);
        this._cd.markForCheck();
    }

    //! change & touch event emitters
    private _touched: boolean = false;
    @HostBinding('class.ard-touched')
    get touched(): boolean { return this._touched };
    protected set touched(state: boolean) {
        this._touched = state;
    }

    protected _emitChanges(): void {
        let value = this.itemStorage.value;
        this._onChangeRegistered?.(value);
        this.changeEvent.emit(value);
        this.valueChange.emit(value);
    }
    protected _onTouched(): void {
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

    //! context providers
    getOptionContext(item: ArdOptionSimple): OptionContext {
        return {
            $implicit: item,
            item,
            itemData: item.itemData,
        }
    }

    //! value input & output
    @Input()
    set value(newValue: any) {
        if (!Array.isArray(newValue)) newValue = coerceArrayProperty(newValue);
        this.writeValue(newValue);
    }
    @Output() valueChange = new EventEmitter<any[]>();

    //! output events
    @Output('change') changeEvent = new EventEmitter<any[]>();
    @Output('add') addEvent = new EventEmitter<any[]>();
    @Output('remove') removeEvent = new EventEmitter<any[]>();


    //! item selection handlers
    toggleItem(item: ArdOptionSimple): void {
        if (item.selected) {
            this.unselectItem(item);
            return;
        }
        this.selectItem(item);
    }
    selectItem(...items: ArdOptionSimple[]): void {
        let [selected, unselected] = this.itemStorage.selectItem(...items);

        if (unselected.length > 0) this.removeEvent.emit(unselected);

        if (selected.length > 0) {
            this.addEvent.emit(selected);
            this._emitChanges();
        }
    }
    unselectItem(...items: ArdOptionSimple[]): void {
        let unselected = this.itemStorage.unselectItem(...items);

        this.removeEvent.emit(unselected);
        this._emitChanges();
    }

    //! highligh-related
    public isMouseBeingUsed: boolean = false;
    @HostListener('mousemove')
    onMouseMove() {
        this.isMouseBeingUsed = true;
    }
    onItemMouseEnter(option: ArdOptionSimple, event: MouseEvent): void {
        if (!this.isMouseBeingUsed) return;
        this.itemStorage.highlightSingleItem(option);
        event.stopPropagation();
    }
    onItemMouseLeave(option: ArdOptionSimple, event: MouseEvent): void {
        if (!this.isMouseBeingUsed) return;
        this.itemStorage.unhighlightItem(option);
        event.stopPropagation();
    }

    //! click handlers
    onItemClick(option: ArdOptionSimple, event: MouseEvent): void {
        event.stopPropagation();
        this.toggleItem(option);
    }

    //! key press handlers
    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Space':
            case 'Enter': {
                this._toggleHighlightedItems(event);
                return;
            }
            case 'ArrowRight': {
                this._highlightNext(event);
                return;
            }
            case 'ArrowLeft': {
                this._highlightPrevious(event);
                return;
            }
            case 'Home': {
                this._highlightFirst(event);
                return;
            }
            case 'End': {
                this._highlightLast(event);
                return;
            }
            case 'Tab': {
                this._skipToNextElement(event.shiftKey);
                return;
            }
            case 'KeyA': {
                if (event.ctrlKey) {
                    this._highlightAll(event);
                    return;
                }
            }
        }
    }
    private _toggleHighlightedItems(event: KeyboardEvent): void {
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
    private _highlightPrevious(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this.isMouseBeingUsed = false;

        this.itemStorage.highlightNextItem(-1, event.shiftKey);
    }
    private _highlightNext(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this.isMouseBeingUsed = false;

        this.itemStorage.highlightNextItem(+1, event.shiftKey);
    }
    private _highlightFirst(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this.isMouseBeingUsed = false;

        this.itemStorage.highlightFirstItem();
    }
    private _highlightLast(event: KeyboardEvent): void {
        if (!this.isFocused) return;

        event.preventDefault();
        this.isMouseBeingUsed = false;

        this.itemStorage.highlightLastItem();
    }
    private _highlightAll(event: KeyboardEvent): void {
        this.itemStorage.highlightAllItems();
    }
    private _skipToNextElement(hasShift: boolean): void {
        if (hasShift) {
            this.focusFirst();
            return;
        }
        this.focusLast();
    }
}