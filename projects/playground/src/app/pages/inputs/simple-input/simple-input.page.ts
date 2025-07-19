import { Component } from '@angular/core';
import { FormElementAppearance } from 'projects/ui/src/public-api';
import { Logger } from './../../../services/logger.service';

@Component({
  selector: 'app-simple-input',
  templateUrl: './simple-input.page.html',
  styleUrls: ['./simple-input.page.scss'],
})
export class SimpleInputPage {
  appearances: FormElementAppearance[] = Object.values(FormElementAppearance);
  value: string = 'Hello world!';
  maxLength = 15;

  constructor(private _logger: Logger) {}
  log = this._logger.log;
}
