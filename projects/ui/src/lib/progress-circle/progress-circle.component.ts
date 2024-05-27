import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef, ViewEncapsulation, computed, input } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { SimpleComponentColor } from '../types/colors.types';
import { ArdProgressCircleValueTemplateDirective } from './progress-circle.directive';
import { ProgressCircleAppearance, ProgressCircleValueContext, ProgressCircleVariant } from './progress-circle.types';

@Component({
  selector: 'ard-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumProgressCircleComponent {
  readonly value = input<number, any>(0, { transform: v => coerceNumberProperty(v, 0) });
  readonly max = input<number, any>(100, { transform: v => coerceNumberProperty(v, 100) });

  readonly percentValue = computed<number>(() => (this.value() / this.max()) * 100);

  //! appearance
  readonly appearance = input<ProgressCircleAppearance>(ProgressCircleAppearance.Transparent);
  readonly color = input<SimpleComponentColor>(SimpleComponentColor.Primary);
  readonly variant = input<ProgressCircleVariant>(ProgressCircleVariant.Full);

  readonly hideValue = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly reverse = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  readonly ngClasses = computed<string>(() =>
    [
      `ard-appearance-${this.appearance()}`,
      `ard-progress-circle-variant-${this.variant()}`,
      `ard-color-${this.color()}`,
      this.hideValue() ? 'ard-progress-circle-hide-value' : '',
      this.reverse() ? 'ard-progress-circle-reversed' : '',
    ].join(' ')
  );

  readonly fillPercentVariable = computed<string>(() => {
    const fillAmount = this.reverse() ? 100 - this.percentValue() : this.percentValue();
    return `--ard-_progress-circle-fill-amount: ${fillAmount}%`;
  });

  //! templates
  @ContentChild(ArdProgressCircleValueTemplateDirective, {
    read: TemplateRef,
  })
  valueTemplate?: TemplateRef<any>;

  readonly getValueContext = computed<ProgressCircleValueContext>(() => ({
    value: this.value(),
    percentValue: Math.round(this.percentValue()),
    max: this.max(),
    $implicit: Math.round(this.percentValue()),
  }));
}
