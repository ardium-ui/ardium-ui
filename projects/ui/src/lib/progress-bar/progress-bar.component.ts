import { ChangeDetectionStrategy, Component, ContentChild, Input, OnChanges, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { SimpleComponentColor } from '../types/colors.types';
import { ArdProgressBarValueTemplateDirective } from './progress-bar.directive';
import { ProgressBarAppearance, ProgressBarMode, ProgressBarSize, ProgressBarValueContext, ProgressBarVariant } from './progress-bar.types';

@Component({
  selector: 'ard-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArdiumProgressBarComponent implements OnChanges {

    private _value: number = 0;
    @Input()
    get value(): number { return this._value; }
    set value(v: any) { this._value = coerceNumberProperty(v); }

    private _bufferValue: number = 0;
    @Input()
    get bufferValue(): number { return this._bufferValue; }
    set bufferValue(v: any) { this._bufferValue = coerceNumberProperty(v); }

    //! appearance
    @Input() color: SimpleComponentColor = SimpleComponentColor.Primary;
    @Input() variant: ProgressBarVariant = ProgressBarVariant.Pill;
    @Input() size: ProgressBarSize = ProgressBarSize.Default;
    @Input() mode: ProgressBarMode = ProgressBarMode.Determinate;

    private _hideValue: boolean = false;
    @Input()
    get hideValue(): boolean { return this._hideValue; }
    set hideValue(v: any) { this._hideValue = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-variant-${this.variant}`,
            `ard-color-${this.color}`,
            `ard-progress-bar__size-${this.size}`,
            `ard-progress-bar__mode-${this.mode}`,
            this.hideValue ? 'ard-progress-bar__hide-value' : '',
        ].join(' ');
    }

    //! error detection
    ngOnChanges(changes: SimpleChanges): void {
        if (!changes['size'] && !changes['mode']) return
        if ((changes['mode']?.currentValue ?? this.mode) == ProgressBarMode.Buffer && (changes['size']?.currentValue ?? this.size) == ProgressBarSize.Auto) {
            console.error(`Forbidden param combination in <ard-progress-bar>: cannot use 'mode="buffer"' and 'size="auto"' at the same time.`);
        }
    }    

    //! bar styling
    get cssVariables(): string {
        if (this.mode == ProgressBarMode.Indeterminate || this.mode == ProgressBarMode.Query) {
            return '--ard-_progress-bar-main: 0;';
        }
        const mainVariable = `--ard-_progress-bar-main: ${this.value}%;`;
        if (this.mode == ProgressBarMode.Buffer) {
            return mainVariable + `--ard-_progress-bar-buffer: ${this.bufferValue}%;`
        }
        return mainVariable;
    }

    //! templates
    @ContentChild(ArdProgressBarValueTemplateDirective, { read: TemplateRef }) valueTemplate?: TemplateRef<any>;

    getValueContext(): ProgressBarValueContext {
        return {
            value: this.value,
            $implicit: this.value,
        }
    }
}
