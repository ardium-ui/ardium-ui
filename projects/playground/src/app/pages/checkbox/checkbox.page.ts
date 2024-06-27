import { Component } from '@angular/core';
import { CheckboxState, SimpleComponentColor as SCC } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
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
