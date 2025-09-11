import { Component, inject } from '@angular/core';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-tabber',
  templateUrl: './tabber.page.html',
  styleUrl: './tabber.page.scss',
})
export class TabberPage {
  private readonly _logger = inject(Logger);
  public log = this._logger.log;
}
