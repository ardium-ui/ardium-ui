import { Component } from '@angular/core';
import { FormElementAppearance as FA, FormElementVariant as FV } from '@ardium-ui/ui';
import { Logger } from '../../../services/logger.service';

@Component({
  templateUrl: './number-input.page.html',
  styleUrls: ['./number-input.page.scss']
})
export class NumberInputPage {
    appearances: FA[] = Object.values(FA);
    variants: FV[] = Object.values(FV);
    value: number | null = 0;
    min: number = -10;
    max: number = 100;
    stepSize: number = 5;

    constructor(private _logger: Logger) {  }
    log = this._logger.log;
}
