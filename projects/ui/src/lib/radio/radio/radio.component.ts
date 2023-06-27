import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { ComponentColor } from '@ardium-ui/ui';
import { _BooleanComponentBase } from '../../_internal/boolean-component';

@Component({
    selector: 'ard-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumRadioComponent extends _BooleanComponentBase {

    @ViewChild('radio') private _radioEl!: ElementRef<HTMLInputElement>;

    constructor(
        protected _changeDetector: ChangeDetectorRef,
    ) {
        super();
    }

    @Input() htmlId: string = crypto.randomUUID();

    @Input() value: any;

    //! appearance
    @Input() color: ComponentColor = ComponentColor.Primary;

    get ngClasses(): string {
        return [
            `ard-color-${this.color}`,
            `ard-radio-${this.selected ? 'selected' : 'unselected'}`,
        ].join(' ');
    }

    //! event handlers
    onMousedown(): void {
        this.focus();
    }
    onMouseup(): void {
        this.focus();
        
        if (this.selected) return;
        this.selected = true;

        this._emitChange();
    }

    log(...args: any[]): void {
        console.log(...args);
    }

    //! radio-group access points
    name: string | null = null;

    //! helpers
    /**
     * Marks the radio button as needing checking for change detection.
     * This method is exposed because the parent radio group will directly
     * update bound properties of the radio button.
     */
    markForCheck() {
        // When group value changes, the button will not be notified. Use `markForCheck` to explicit
        // update radio button's status
        this._changeDetector.markForCheck();
    }
}
