import { Component } from '@angular/core';
import { SliderTooltipFormatFn } from '@ardium-ui/ui';
import { Logger } from '../../../services/logger.service';

@Component({
  selector: 'app-range-slider',
  templateUrl: './range-slider.page.html',
  styleUrls: ['./range-slider.page.scss'],
})
export class RangeSliderPage {
  constructor(private _logger: Logger) {}
  log = this._logger.log;

  readonly tooltipFormatFn: SliderTooltipFormatFn = (v: number): string => String(v / 1000) + 'k';
}
