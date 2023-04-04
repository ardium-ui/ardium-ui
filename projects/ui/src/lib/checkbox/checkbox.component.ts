import { Component, EventEmitter, Input, Output, ViewEncapsulation, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { coerceBooleanProperty } from '../../../../devkit/src/public-api';
import { SimpleComponentColor } from '../types/colors.types';
import { _BooleanComponentBase } from './../_internal/boolean-component';
import { CheckboxState } from './checkbox.types';

@Component({
    selector: 'ard-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumCheckboxComponent),
            multi: true
        }
    ]
})
export class ArdiumCheckboxComponent extends _BooleanComponentBase implements ControlValueAccessor {
    @Input() wrapperClasses: string = '';

    //* appearance
    @Input() color: SimpleComponentColor = SimpleComponentColor.Primary;

    get ngClasses(): string {
        return [
            `ard-color-${this.color}`,
            `ard-checkbox-${this.state}`,
        ].join(' ');
    }

    //override the "selected" setter, so it changes the state too.
    override set selected(v: any) {
        this._selected = coerceBooleanProperty(v);
        this.state = this._selected ? 'selected' : 'unselected';
    }
    override get selected(): boolean { return this._selected }

    @Input() state: CheckboxState = 'unselected';
    @Output() stateChange = new EventEmitter<CheckboxState>();

    //* click action
    toggleState() {
        if (this.state == 'selected' || this.state == 'indeterminate') this.state = 'unselected';
        else this.state = 'selected';
        this._selected = this.state == 'selected';

        this._emitChange();
    }
    protected override _emitChange(): void {
        super._emitChange();
        this.stateChange.emit(this.state);
    }
}
