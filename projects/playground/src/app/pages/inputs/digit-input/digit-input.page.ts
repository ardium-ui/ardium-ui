import { Component } from '@angular/core';
import { Logger } from '../../../services/logger.service';

@Component({
  selector: 'app-digit-input',
  templateUrl: './digit-input.page.html',
  styleUrls: ['./digit-input.page.scss']
})
export class DigitInputPage {

    constructor(private _logger: Logger) {}
    log = this._logger.log;
}
