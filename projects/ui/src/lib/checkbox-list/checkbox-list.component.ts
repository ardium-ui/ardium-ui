import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { SimpleItemStorage, SimpleItemStorageHost } from '../_internal/item-storages/simple-item-storage';
import { _NgModelComponentBase } from '../_internal/ngmodel-component';
import { ComponentColor } from '../types/colors.types';
import { ArdOptionSimple, CompareWithFn } from '../types/item-storage.types';

@Component({
  selector: 'ard-checkbox-list',
  templateUrl: './checkbox-list.component.html',
  styleUrls: ['./checkbox-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumCheckboxListComponent extends _NgModelComponentBase implements SimpleItemStorageHost, AfterViewInit {
    @HostBinding('attr.id')
    @Input() htmlId: string = crypto.randomUUID();

    readonly DEFAULTS = {
        valueFrom: 'value',
        labelFrom: 'label',
        disabledFrom: 'disabled',
    }
    readonly multiselectable = true;
    readonly requireValue = false;

    private _itemStorage = new SimpleItemStorage(this);

    @Input()
    set items(v: any[]) { this._itemStorage.setItems(v); }
    get items(): ArdOptionSimple[] { return this._itemStorage.items; }

    compareWith?: CompareWithFn;

    private _invertDisabled: boolean = false;
    @Input()
    get invertDisabled(): boolean { return this._invertDisabled; }
    set invertDisabled(v: any) { this._invertDisabled = coerceBooleanProperty(v); }

    private _maxSelectedItems?: number;
    @Input()
    get maxSelectedItems(): number | undefined { return this._maxSelectedItems; }
    set maxSelectedItems(v: any) { this._maxSelectedItems = coerceNumberProperty(v); }

    //! appearance
    @Input() color: ComponentColor = ComponentColor.Primary;

    private _compact: boolean = false;
    @Input()
    get compact(): boolean { return this._compact; }
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-color-${this.color}`,
            this.compact ? 'ard-compact' : '',
        ].join(' ');
    }

    //! value
    @Input()
    get value(): any { return this._itemStorage.value; }
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

    private _isViewInit: boolean = false;
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

    onCheckboxSelect(v: ArdOptionSimple): void {
        this._itemStorage.selectItem(v);
    }
    onCheckboxUnselect(v: ArdOptionSimple): void {
        this._itemStorage.unselectItem(v);
    }
}
