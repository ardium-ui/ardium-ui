import { WritableSignal } from "@angular/core";

export interface ArdCompositionChartItem {
  readonly index: number;
  label: string;
  value: number;
  color?: string;
  percentValue: number;
  readonly highlighted: WritableSignal<boolean>;
}