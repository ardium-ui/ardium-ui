import { Component } from '@angular/core';
import { Logger } from '../../../services/logger.service';
import { DigitInputConfig, TransformType } from '@ardium-ui/ui';

@Component({
  selector: 'app-digit-input',
  templateUrl: './digit-input.page.html',
  styleUrls: ['./digit-input.page.scss']
})
export class DigitInputPage {

    constructor(private _logger: Logger) {}
    log = this._logger.log;

    readonly simpleConfig = 'letter,number,number,number';

    readonly complexConfig: DigitInputConfig = [
        {
            accept: 'a-f0-9',
            transform: TransformType.Uppercase,
        },
        {
            accept: 'a-f0-9',
            transform: TransformType.Uppercase,
        },
        {
            accept: 'a-f0-9',
            transform: TransformType.Uppercase,
        },
        {
            accept: 'a-f0-9',
            transform: TransformType.Uppercase,
        },
    ]
}
