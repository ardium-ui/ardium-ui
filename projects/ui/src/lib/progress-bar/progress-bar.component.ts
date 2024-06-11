import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  TemplateRef,
  ViewEncapsulation,
  computed,
  effect,
  input,
} from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { SimpleComponentColor } from '../types/colors.types';
import { ArdProgressBarValueTemplateDirective } from './progress-bar.directive';
import { ProgressBarMode, ProgressBarSize, ProgressBarValueContext, ProgressBarVariant } from './progress-bar.types';

@Component({
  selector: 'ard-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumProgressBarComponent {
  readonly value = input<number, any>(0, { transform: v => coerceNumberProperty(v) });
  readonly bufferValue = input<number, any>(0, { transform: v => coerceNumberProperty(v) });

  //! appearance
  readonly color = input<SimpleComponentColor>(SimpleComponentColor.Primary);
  readonly variant = input<ProgressBarVariant>(ProgressBarVariant.Pill);
  readonly size = input<ProgressBarSize>(ProgressBarSize.Default);
  readonly mode = input<ProgressBarMode>(ProgressBarMode.Determinate);

  readonly hideValue = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed<string>(() =>
    [
      `ard-variant-${this.variant()}`,
      `ard-color-${this.color()}`,
      `ard-progress-bar__size-${this.size()}`,
      `ard-progress-bar__mode-${this.mode()}`,
      this.hideValue() ? 'ard-progress-bar__hide-value' : '',
    ].join(' ')
  );

  //! error detection
  constructor() {
    effect(() => {
      if (this.mode() === ProgressBarMode.Buffer && this.size() === ProgressBarSize.Auto) {
        console.error(
          `Forbidden param combination in <ard-progress-bar>: cannot use 'mode="buffer"' and 'size="auto"' at the same time.`
        );
        //TODO error
      }
    });
  }

  //! bar styling
  readonly cssVariables = computed<string>(() => {
    if (this.mode() === ProgressBarMode.Indeterminate || this.mode() === ProgressBarMode.Query) {
      return '--ard-_progress-bar-main: 0;';
    }
    const mainVariable = `--ard-_progress-bar-main: ${this.value()}%;`;
    if (this.mode() === ProgressBarMode.Buffer) {
      return mainVariable + `--ard-_progress-bar-buffer: ${this.bufferValue()}%;`;
    }
    return mainVariable;
  });

  //! templates
  @ContentChild(ArdProgressBarValueTemplateDirective, { read: TemplateRef })
  valueTemplate?: TemplateRef<any>;

  readonly getValueContext = computed<ProgressBarValueContext>(() => ({
    value: this.value(),
    $implicit: this.value(),
  }));
}
