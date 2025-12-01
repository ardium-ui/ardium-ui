import { Component, computed, inject, input, signal } from '@angular/core';
import { FormElementVariant } from './../types/theming.types';
import { ARD_COMPOSITION_CHART_DEFAULTS } from './composition-chart.defaults';
import { ArdCompositionChartItem } from './composition-chart.types';

@Component({
  selector: 'ard-composition-chart',
  standalone: false,
  templateUrl: './composition-chart.component.html',
  styleUrl: './composition-chart.component.scss',
})
export class CompositionChartComponent {
  protected readonly _DEFAULTS = inject(ARD_COMPOSITION_CHART_DEFAULTS);

  //! appearance
  readonly variant = input<FormElementVariant>(FormElementVariant.Rounded);

  readonly ngClasses = computed<string>(() => [`ard-variant-${this.variant()}`].join(' '));

  //! config
  readonly labelFrom = input<string>(this._DEFAULTS.labelFrom);
  readonly valueFrom = input<string>(this._DEFAULTS.valueFrom);
  readonly colorFrom = input<string>(this._DEFAULTS.colorFrom);

  readonly items = input.required<ArdCompositionChartItem[], Record<string, unknown>[]>({
    transform: this._transformItemsInput.bind(this),
  });
  private readonly _highlightedItem = signal<ArdCompositionChartItem | null>(null);

  private _transformItemsInput(items: Record<string, unknown>[]): ArdCompositionChartItem[] {
    const mappedItems = items.map((item, index) => {
      const label = item[this.labelFrom()];
      const value = item[this.valueFrom()];
      const color = item[this.colorFrom()];

      if (label === undefined) {
        throw new Error(
          `ARD-FT6010L: <ard-composition-chart> is missing required property for label at index ${index}. Each item must have properties '${this.labelFrom()}' (label) and '${this.valueFrom()}' (value).`
        );
      }
      if (typeof label !== 'string') {
        throw new Error(
          `ARD-FT6011L: <ard-composition-chart> has invalid property for label. Property '${this.labelFrom()}' at index ${index} must be of type string.`
        );
      }
      if (value === undefined) {
        throw new Error(
          `ARD-FT6010V: <ard-composition-chart> is missing required property for value at index ${index}. Each item must have properties '${this.labelFrom()}' (label) and '${this.valueFrom()}' (value).`
        );
      }
      if (typeof value !== 'number') {
        throw new Error(
          `ARD-FT6011V: <ard-composition-chart> has invalid property for value. Property '${this.valueFrom()}' at index ${index} must be of type number.`
        );
      }
      if (value < 0) {
        throw new Error(
          `ARD-FT6012V: <ard-composition-chart> has invalid property for value. Property '${this.valueFrom()}' at index ${index} must be of greater than 0.`
        );
      }
      if (color !== undefined && typeof color !== 'string') {
        throw new Error(
          `ARD-FT6011C: <ard-composition-chart> has invalid property for color. Property '${this.colorFrom()}' at index ${index} must be of type string or undefined.`
        );
      }
      return {
        index,
        label,
        value,
        color,
        percentValue: 0,
        highlighted: signal<boolean>(false),
      } as ArdCompositionChartItem;
    });
    const totalValue = mappedItems.reduce((acc, item) => acc + item.value, 0);
    return mappedItems.map(item => ({
      ...item,
      percentValue: totalValue > 0 ? (item.value / totalValue) * 100 : 0,
    }));
  }

  highlightItem(item: ArdCompositionChartItem): void {
    this._highlightedItem()?.highlighted.set(false);
    this._highlightedItem.set(item);
    item.highlighted.set(true);
  }
  clearHighlightedItem(): void {
    this._highlightedItem()?.highlighted.set(false);
    this._highlightedItem.set(null);
  }
}
