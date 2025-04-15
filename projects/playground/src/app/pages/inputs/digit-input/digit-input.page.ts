import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DigitInputConfig, DigitInputPrimitiveOption, TransformType } from '@ardium-ui/ui';
import { Logger } from '../../../services/logger.service';

@Component({
  selector: 'app-digit-input',
  templateUrl: './digit-input.page.html',
  styleUrls: ['./digit-input.page.scss'],
})
export class DigitInputPage {
  constructor(private _logger: Logger) {}
  log = this._logger.log;

  readonly control = new FormControl();
  readonly group = new FormGroup({
    zipCode: new FormControl(),
  });

  readonly simpleConfig = 'letter,number,number,number';

  readonly complexConfig: DigitInputConfig = [
    {
      accept: 'a-fA-F0-9',
      transform: TransformType.Uppercase,
      placeholder: '0',
    },
    {
      accept: 'a-fA-F0-9',
      transform: TransformType.Uppercase,
      placeholder: '0',
    },
    {
      accept: 'a-fA-F0-9',
      transform: TransformType.Uppercase,
      placeholder: '0',
    },
    {
      accept: 'a-fA-F0-9',
      transform: TransformType.Uppercase,
      placeholder: '0',
    },
  ];

  readonly configWithStatics: DigitInputConfig = [
    DigitInputPrimitiveOption.Number,
    DigitInputPrimitiveOption.Number,
    { static: '-' },
    DigitInputPrimitiveOption.Number,
    DigitInputPrimitiveOption.Number,
    DigitInputPrimitiveOption.Number,
  ];
}
