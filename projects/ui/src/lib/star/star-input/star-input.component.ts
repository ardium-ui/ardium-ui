import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
    HostListener,
    ViewEncapsulation,
    ViewChildren,
    ElementRef,
    QueryList,
    forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ArdiumStarButtonComponent } from '../star-button/star-button.component';
import { _NgModelComponentBase } from './../../_internal/ngmodel-component';
import { StarColor } from './../star.types';

type StarInputObject = {
    filled: boolean;
    isInValue: boolean;
};

@Component({
    selector: 'ard-star-input',
    templateUrl: './star-input.component.html',
    styleUrls: ['./star-input.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ArdiumStarInputComponent),
            multi: true,
        },
    ],
})
export class ArdiumStarInputComponent extends _NgModelComponentBase implements OnChanges, ControlValueAccessor {
    @Input() wrapperClasses: string = '';

    //* appearance
    @Input() color: StarColor = StarColor.Star;

    get ngClasses(): string {
        return [`ard-color-${this.color}`].join(' ');
    }

    @ViewChildren('starButton')
    starButtonInstances!: QueryList<ArdiumStarButtonComponent>;

    //* events
    @Output('change') changeEvent = new EventEmitter<number>();
    @Output('highlight') highlightEvent = new EventEmitter<number>();

    @Input() value: number = 0;
    @Output() valueChange = new EventEmitter<number>();

    //* stars
    @Input() max: number = 5;
    starArray: StarInputObject[] = this.createFirstStarArray();

    setStarArrayFromNumber(targetIndex: number): void {
        targetIndex = Math.round(targetIndex);
        this.starArray.forEach((v, i) => {
            if (i < targetIndex) {
                v.filled = true;
                v.isInValue = true;
            } else if (i < this.value) {
                v.filled = false;
                v.isInValue = true;
            } else {
                v.filled = false;
                v.isInValue = false;
            }
        });
    }
    createFirstStarArray(): StarInputObject[] {
        let arr = new Array(this.max);
        for (let i = 0; i < this.max; i++) {
            arr[i] = { filled: false, isInValue: false };
        }
        return arr;
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['max']) {
            this.starArray = this.createFirstStarArray();
        }
        if (changes['value']) {
            this.setStarArrayFromNumber(this.value);
        }
    }
    //* implement ControlValueAccessor's writeValue
    writeValue(v: number): void {
        this.setStarArrayFromNumber(v);
    }
    onStarClick(index: number): void {
        this.value = index + 1;
        this.setStarArrayFromNumber(this.value);
        this._emitChange();
    }
    private _currentHoverIndex: number | null = null;
    onStarHighlight(index: number): void {
        if (this._currentHoverIndex == index) return;
        this._currentHoverIndex = index;
        this.setStarArrayFromNumber(index + 1);
        this.highlightEvent.emit(index + 1);
    }
    setDisplayToValue() {
        this._currentHoverIndex = null;
        this.setStarArrayFromNumber(this.value);
    }
    protected _emitChange(): void {
        this._onChangeRegistered?.(this.value);
        this.changeEvent.emit(this.value);
        this.valueChange.emit(this.value);
    }

    //* focus handlers
    private _isFocusEventSuppressed: boolean = false;
    private _isBlurEventSuppressed: boolean = false;
    private _wasComponentBlurred: boolean = true;
    private _currentFocusIndex: number | null = null;
    onStarButtonFocus(index: number) {
        this._currentFocusIndex = index;
        this._wasComponentBlurred = false;
        if (this._isFocusEventSuppressed) {
            this._isFocusEventSuppressed = false;
            return;
        }
        this.focusEvent.emit();
    }
    onStarButtonBlur(): void {
        this._currentFocusIndex = null;
        if (this._isBlurEventSuppressed) {
            this._isBlurEventSuppressed = false;
            return;
        }
        this._wasComponentBlurred = true;
        this.blurEvent.emit();
    }
    focusStarButtonByIndex(index: number): void {
        if (!this.starButtonInstances) return;
        this.starButtonInstances.get(index)!.focus();
    }
    focusNextStarButton(offset: number): void {
        if (!this.starButtonInstances || this._currentFocusIndex == null) return;

        let nextIndex = this._currentFocusIndex + offset;
        nextIndex = Math.min(nextIndex, this.max - 1);
        nextIndex = Math.max(nextIndex, 0);

        this.focusStarButtonByIndex(nextIndex);
    }
    private _suppressFocusEvents(): void {
        this._isFocusEventSuppressed = true;
        this._isBlurEventSuppressed = true;
    }

    override focus(): void {
        this.focusStarButtonByIndex(0);
    }
    override blur(): void {
        if (!this.starButtonInstances || this._currentFocusIndex == null) return;
        this.starButtonInstances.get(this._currentFocusIndex)!.blur();
    }

    //* key press handlers
    @HostListener('keydown', ['$event'])
    onKeyPress(event: KeyboardEvent): void {
        switch (event.code) {
            case 'Tab': {
                this._onTabPress(event);
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
        }
    }
    private _onArrowRightPress(event: KeyboardEvent): void {
        event.preventDefault();
        this._suppressFocusEvents();
        this.focusNextStarButton(+1);
    }
    private _onArrowLeftPress(event: KeyboardEvent): void {
        event.preventDefault();
        this._suppressFocusEvents();
        this.focusNextStarButton(-1);
    }
    private _onHomePress(event: KeyboardEvent): void {
        event.preventDefault();
        this._suppressFocusEvents();
        this.focusStarButtonByIndex(0);
    }
    private _onEndPress(event: KeyboardEvent): void {
        event.preventDefault();
        this._suppressFocusEvents();
        this._onTabPress(event);
    }
    private _onTabPress(event: KeyboardEvent): void {
        this.focusStarButtonByIndex(this.max - 1);
    }
}
