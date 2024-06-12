import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  ViewEncapsulation,
  computed,
  input,
  signal,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { SimpleItemStorage, SimpleItemStorageHost } from '../_internal/item-storages/simple-item-storage';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ComponentColor } from '../types/colors.types';
import { ArdOptionSimple, CompareWithFn } from '../types/item-storage.types';
import { CheckboxListAlignType } from './checkbox-list.types';
import { Nullable } from '../types/utility.types';

@Component({
  selector: 'ard-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCheckboxListComponent extends _NgModelComponentBase implements SimpleItemStorageHost, AfterViewInit {
  readonly htmlId = input<string>(crypto.randomUUID());

  @HostBinding('attr.id')
  get _htmlIdHostAttribute() {
    return this.htmlId();
  }

  readonly DEFAULTS = {
    valueFrom: 'value',
    labelFrom: 'label',
    disabledFrom: 'disabled',
  };
  // static values. Not meant to be changed.
  readonly multiselectable = signal<true>(true);
  readonly isValueRequired = signal<false>(false);
  readonly _componentId = '300';

  private readonly _itemStorage = new SimpleItemStorage(this);

  readonly valueFrom = input<string>(this.DEFAULTS.valueFrom);
  readonly labelFrom = input<string>(this.DEFAULTS.labelFrom);
  readonly disabledFrom = input<string>(this.DEFAULTS.disabledFrom);

  @Input()
  set items(v: any[]) {
    this._itemStorage.setItems(v);
  }
  get items(): ArdOptionSimple[] {
    return this._itemStorage.items();
  }

  readonly compareWith = input<Nullable<CompareWithFn>>(undefined);

  readonly invertDisabled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly maxSelectedItems = input<number, any>(Infinity, { transform: v => coerceNumberProperty(v) });

  //! appearance
  readonly color = input<ComponentColor>(ComponentColor.Primary);
  readonly align = input<CheckboxListAlignType>(CheckboxListAlignType.LeftClumped);

  readonly compact = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [`ard-color-${this.color()}`, `ard-align-${this.align()}`, this.compact() ? 'ard-compact' : ''].join(' ')
  );

  //! value
  @Input()
  get value(): any {
    return this._itemStorage.value();
  }
  set value(v: any) {
    this.writeValue(v);
  }

  @Output() valueChange = new EventEmitter<any>();
  @Output('change') changeEvent = new EventEmitter<any>();

  private _valueBeforeInit: any;
  writeValue(v: any): void {
    if (!this._isViewInit) {
      this._valueBeforeInit = v;
      return;
    }
    this._itemStorage.writeValue(v);
  }

  private _isViewInit = false;
  ngAfterViewInit(): void {
    this._isViewInit = true;

    if (this._valueBeforeInit) {
      this.writeValue(this._valueBeforeInit);
    }
  }

  protected _emitChange(): void {
    const v = this.value;
    this._onChangeRegistered?.(v);
    this.changeEvent.emit(v);
    this.valueChange.emit(v);
  }

  onItemHighlight(v: ArdOptionSimple): void {
    this._itemStorage.highlightSingleItem(v);
  }
  onItemFocus(v: ArdOptionSimple): void {
    this._itemStorage.highlightSingleItem(v);
  }
  onItemBlur(): void {
    this._itemStorage.unhighlightAll();
  }
  selectItem(v: ArdOptionSimple): void {
    this._itemStorage.selectItem(v);
    this._emitChange();
  }
  unselectItem(v: ArdOptionSimple): void {
    this._itemStorage.unselectItem(v);
    this._emitChange();
  }
  toggleItem(v: ArdOptionSimple): void {
    if (v.selected()) {
      this.unselectItem(v);
      return;
    }
    this.selectItem(v);
  }
}
