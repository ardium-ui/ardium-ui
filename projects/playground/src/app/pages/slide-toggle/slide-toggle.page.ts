import { Component } from '@angular/core';
import { ComponentColor as CC } from 'projects/ui/src/public-api';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.page.html',
  styleUrls: ['./slide-toggle.page.scss'],
})
export class SlideTogglePage {
  colors: CC[] = Object.values(CC);

  fontsize: number = 24;

  constructor(private _logger: Logger) {}
  log = this._logger.log;
}
