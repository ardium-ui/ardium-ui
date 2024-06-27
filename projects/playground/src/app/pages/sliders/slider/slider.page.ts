import { Component } from '@angular/core';
import { SliderTooltipFormatFn } from '@ardium-ui/ui';
import { Logger } from '../../../services/logger.service';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage {
  constructor(private _logger: Logger) {}
  log = this._logger.log;

  readonly tooltipFormatFn: SliderTooltipFormatFn = (v: number): string => String(v / 1000) + 'k';
}
