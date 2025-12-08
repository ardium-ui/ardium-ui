import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  HostBinding,
  Inject,
  Input,
  input,
  model,
  OnChanges,
  signal,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormValueControl } from '@angular/forms/signals';
import { BooleanLike, coerceBooleanProperty, coerceNumberProperty, NumberLike } from '@ardium-ui/devkit';
import { SimpleOneAxisAlignment } from 'dist/ui';
import { SimpleItemStorage, SimpleItemStorageHost } from '../_internal/item-storages/simple-item-storage';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ComponentColor } from '../types/colors.types';
import { ArdOptionSimple, CompareWithFn } from '../types/item-storage.types';
import { Nullable } from '../types/utility.types';
import { ARD_CHECKBOX_LIST_DEFAULTS, ArdCheckboxListDefaults } from './checkbox-list.defaults';
import { ArdCheckboxListCheckboxTemplateDirective } from './checkbox-list.directives';

@Component({
  standalone: false,
  selector: 'ard-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCheckboxListComponent
  extends _NgModelComponentBase
  implements SimpleItemStorageHost, AfterViewInit, FormValueControl<any[] | null>, OnChanges
{
  protected override readonly _DEFAULTS!: ArdCheckboxListDefaults;
  constructor(@Inject(ARD_CHECKBOX_LIST_DEFAULTS) defaults: ArdCheckboxListDefaults) {
    super(defaults);

    effect(() => {
      this.value();
      this._emitChange();
    });
  }

  @HostBinding('attr.id')
  get _htmlIdHostAttribute() {
    return this.htmlId();
  }

  readonly DEFAULTS = this._DEFAULTS;
  // static values. Not meant to be changed.
  readonly multiselectable = signal<true>(true);
  readonly isValueRequired = signal<false>(false);
  readonly _componentId = '300';
  readonly _componentName = 'checkbox-list';

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

  readonly compareWith = input<Nullable<CompareWithFn>>(this._DEFAULTS.compareWith);

  readonly invertDisabled = input<boolean, BooleanLike>(this._DEFAULTS.invertDisabled, {
    transform: v => coerceBooleanProperty(v),
  });

  readonly maxSelectedItems = input<number, NumberLike>(this._DEFAULTS.maxSelectedItems, {
    transform: v => coerceNumberProperty(v, this._DEFAULTS.maxSelectedItems),
  });

  //! appearance
  readonly color = input<ComponentColor>(this._DEFAULTS.color);
  readonly textAlign = input<SimpleOneAxisAlignment>(this._DEFAULTS.textAlign);
  readonly checkboxAlign = input<SimpleOneAxisAlignment>(this._DEFAULTS.checkboxAlign);

  readonly compact = input<boolean, BooleanLike>(this._DEFAULTS.compact, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed(() =>
    [
      `ard-color-${this.color()}`,
      `ard-align-text-${this.textAlign()}`,
      `ard-align-checkbox-${this.checkboxAlign()}`,
      this.compact() ? 'ard-compact' : '',
    ].join(' ')
  );

  //! value
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const v = changes['value'].currentValue;
      this.writeValue(v);
    }
  }

  readonly value = model<any>([]);

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
    const v = this.value();
    this._onChangeRegistered?.(v);
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
  }
  unselectItem(v: ArdOptionSimple): void {
    this._itemStorage.unselectItem(v);
  }
  toggleItem(v: ArdOptionSimple): void {
    if (v.selected()) {
      this.unselectItem(v);
      return;
    }
    this.selectItem(v);
  }

  //! templates
  readonly checkboxTemplate = contentChild(ArdCheckboxListCheckboxTemplateDirective);
}
