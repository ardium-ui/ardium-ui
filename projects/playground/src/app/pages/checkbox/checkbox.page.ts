import { Component } from '@angular/core';
import { CheckboxState, SimpleComponentColor as SCC } from 'projects/ui/src/public-api';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-checkbox',
  templateUrl: './checkbox.page.html',
  styleUrls: ['./checkbox.page.scss'],
})
export class CheckboxPage {
  states: CheckboxState[] = Object.values(CheckboxState);
  colors: SCC[] = Object.values(SCC);

  fontsize: number = 24;

  constructor(private _logger: Logger) {}
  log = this._logger.log;
}
