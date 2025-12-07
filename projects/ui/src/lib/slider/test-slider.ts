import { Component, computed, input, model, OnChanges, SimpleChanges } from "@angular/core";
import { FormValueControl } from "@angular/forms/signals";
import { coerceNumberProperty, NumberLike } from "@ardium-ui/devkit";

@Component({
  selector: 'ard-test-slider',
  template: `<p>{{ value() }}</p>`,
})
export class TestSliderComponent implements FormValueControl<number>, OnChanges {
  readonly componentId = '105';
  readonly componentName = 'slider';

  readonly value = model<number>(0);
  
  readonly min = input<number | undefined, NumberLike>(0, { transform: v => coerceNumberProperty(v, 0) });
  readonly minNumber = computed<number>(() => this.min() ?? 0);

  readonly max = input<number | undefined, NumberLike>(100, { transform: v => coerceNumberProperty(v, 100) });
  readonly maxNumber = computed<number>(() => this.max() ?? 100);

  writeValue(v: any): void {
    v = Number(v);
    if (isNaN(v)) {
      v = this.minNumber();
    }
    v = Math.min(Math.max(v, this.minNumber()), this.maxNumber());
    this.value.set(v);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      const v = changes['value'].currentValue;
      this.writeValue(v);
    }
  }
}