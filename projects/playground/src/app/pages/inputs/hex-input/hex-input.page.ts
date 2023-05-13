import { Component } from '@angular/core';
import { Logger } from '../../../services/logger.service';
import { FormElementAppearance as FA, FormElementVariant as FV } from '@ardium-ui/ui';

@Component({
  selector: 'app-hex-input',
  templateUrl: './hex-input.page.html',
  styleUrls: ['./hex-input.page.scss']
})
export class HexInputPage {
    value: string | null = '000000';

    appearances: FA[] = Object.values(FA);
    variants: FV[] = Object.values(FV);

    constructor(private _logger: Logger) { }
    log = this._logger.log;
}
