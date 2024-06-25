import {
  ChangeDetectorRef,
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
  computed,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { coerceArrayProperty, coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { ArdOptionSimple, CompareWithFn, OptionContext } from '../types/item-storage.types';
import { Nullable } from '../types/utility.types';
import { SimpleItemStorage, SimpleItemStorageHost } from './item-storages/simple-item-storage';
import { _NgModelComponentBase } from './ngmodel-component';

@Directive()
export abstract class _SelectableListComponentBase
  extends _NgModelComponentBase
  implements ControlValueAccessor, SimpleItemStorageHost
{
  //! public constants
  readonly itemStorage = new SimpleItemStorage(this);
  readonly htmlId = crypto.randomUUID();
  readonly element!: HTMLElement;
  readonly DEFAULTS = {
    valueFrom: 'value',
    labelFrom: 'label',
    disabledFrom: 'disabled',
  };

  abstract readonly _componentId: string;
  abstract readonly _componentName: string;

  constructor(private _cd: ChangeDetectorRef) {
    super();
  }

  //! binding-related inputs
  readonly valueFrom = input<Nullable<string>>(undefined);
  readonly labelFrom = input<Nullable<string>>(undefined);
  readonly disabledFrom = input<Nullable<string>>(undefined);
  readonly compareWith = input<Nullable<CompareWithFn>>(undefined);

  //! items setter/getter
  @Input()
  get items(): any[] {
    return this.itemStorage.items();
  }
  set items(value: any) {
    if (!Array.isArray(value)) value = coerceArrayProperty(value);

    const shouldPrintErrors = this.itemStorage.setItems(value);

    if (shouldPrintErrors) {
      this._printPrimitiveWarnings();
    }
  }
  private _printPrimitiveWarnings() {
    const makeWarning = (str: string): void => {
      console.warn(`ARD-WA${this._componentId} Skipped using [${str}] property bound to <ard-${this._componentName}>, as some provided items are of primitive type`);
    }
    if (this.valueFrom()) {
      makeWarning('valueFrom');
    }
    if (this.labelFrom()) {
      makeWarning('labelFrom');
    }
    if (this.disabledFrom()) {
      makeWarning('disabledFrom');
    }
    if (this.invertDisabled()) {
      makeWarning('invertDisabled');
    }
  }

  //! multiselectable
  readonly multiselectable = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  @HostBinding('attr.multiple')
  @HostBinding('class.ard-multiselect')
  get _multiselectableHostAttribute() {
    return this.multiselectable();
  }

  readonly singleselectable = computed(() => !this.multiselectable());

  //! require value
  readonly requireValue = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly isValueRequired = computed(() => this.requireValue() || !this.multiselectable());

  @HostBinding('class.ard-require-value')
  get _requireValueHostAttribute() {
    return this.requireValue();
  }

  //! coerced properties
  readonly invertDisabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly maxSelectedItems = input<Nullable<number>, any>(undefined, { transform: v => coerceNumberProperty(v, undefined) });

  //! control value accessor
  //override the writeValue and setDisabledState defined in _NgModelComponent
  override setDisabledState(state: boolean): void {
    this.disabled.set(state);
    this._cd.markForCheck();
  }
  writeValue(ngModel: any[]): void {
    this.itemStorage.writeValue(ngModel);
    this._cd.markForCheck();
  }

  //! change & touch event emitters
  readonly touched = signal<boolean>(false);

  @HostBinding('class.ard-touched')
  get _touchedHostAttribute(): boolean {
    return this.touched();
  }

  protected _emitChange(): void {
    const value = this.itemStorage.value();
    this._onChangeRegistered?.(value);
    this.changeEvent.emit(value);
    this.valueChange.emit(value);
  }
  protected _onTouched(): void {
    if (this.touched()) return;

    this._onTouchedRegistered?.();
    this.touched.set(true);
  }

  //! focus & blur handlers
  private readonly lastBlurTimestamp = signal<Nullable<number>>(undefined);
  override onFocus(event: FocusEvent): void {
    super.onFocus(event);

    const lbt = this.lastBlurTimestamp();
    if (this.touched() || !lbt || lbt + 1 < Date.now()) return;
    this.lastBlurTimestamp.set(null);

    this._onTouched();
  }
  override onBlur(event: FocusEvent): void {
    super.onBlur(event);

    if (!this.touched()) this.lastBlurTimestamp.set(Date.now());
  }

  //! getters
  readonly highlightedItems = computed<ArdOptionSimple[]>(() => this.itemStorage.highlightedItems());
  readonly firstHighlightedItem = computed<Nullable<ArdOptionSimple>>(() => this.highlightedItems()?.first());
  readonly isItemLimitReached = computed(() => this.itemStorage.isItemLimitReached());

  //! context providers
  getOptionContext(item: ArdOptionSimple): OptionContext<ArdOptionSimple> {
    return {
      $implicit: item,
      item,
      itemData: item.itemData(),
    };
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
    if (item.selected()) {
      this.unselectItem(item);
      return;
    }
    this.selectItem(item);
  }
  selectItem(...items: ArdOptionSimple[]): void {
    const [selected, unselected] = this.itemStorage.selectItem(...items);

    if (unselected.length > 0) this.removeEvent.emit(unselected);

    if (selected.length > 0) {
      this.addEvent.emit(selected);
      this._emitChange();
    }
  }
  unselectItem(...items: ArdOptionSimple[]): void {
    const unselected = this.itemStorage.unselectItem(...items);

    this.removeEvent.emit(unselected);
    this._emitChange();
  }

  //! highligh-related

  readonly isMouseBeingUsed = signal<boolean>(false);
  @HostListener('mousemove')
  onMouseMove() {
    this.isMouseBeingUsed.set(true);
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
      case 'KeyA': {
        if (event.ctrlKey) {
          this._highlightAll();
          return;
        }
      }
    }
  }
  private _toggleHighlightedItems(event: KeyboardEvent): void {
    if (!this.isFocused) return;

    event.preventDefault();

    const highlightedItems = this.highlightedItems();

    if (highlightedItems.every(item => item.selected)) {
      this.unselectItem(...highlightedItems);
    } else {
      this.selectItem(...highlightedItems);
    }
  }
  private _highlightPrevious(event: KeyboardEvent): void {
    if (!this.isFocused) return;

    event.preventDefault();
    this.isMouseBeingUsed.set(false);

    this.itemStorage.highlightNextItem(-1, event.shiftKey);
  }
  private _highlightNext(event: KeyboardEvent): void {
    if (!this.isFocused) return;

    event.preventDefault();
    this.isMouseBeingUsed.set(false);

    this.itemStorage.highlightNextItem(+1, event.shiftKey);
  }
  private _highlightFirst(event: KeyboardEvent): void {
    if (!this.isFocused) return;

    event.preventDefault();
    this.isMouseBeingUsed.set(false);

    this.itemStorage.highlightFirstItem();
  }
  private _highlightLast(event: KeyboardEvent): void {
    if (!this.isFocused) return;

    event.preventDefault();
    this.isMouseBeingUsed.set(false);

    this.itemStorage.highlightLastItem();
  }
  private _highlightAll(): void {
    this.itemStorage.highlightAllItems();
  }
}
