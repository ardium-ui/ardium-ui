import { Component } from '@angular/core';
import { SliderTooltipFormatFn } from 'projects/ui/src/public-api';
import { Logger } from '../../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-slider',
  templateUrl: './slider.page.html',
  styleUrls: ['./slider.page.scss'],
})
export class SliderPage {
  constructor(private _logger: Logger) {}
  log = this._logger.log;

  readonly tooltipFormatFn: SliderTooltipFormatFn = (v: number): string => String(v / 1000) + 'k';
}
