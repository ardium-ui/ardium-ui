import { Component } from '@angular/core';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-color-picker',
  templateUrl: './color-picker.page.html',
  styleUrls: ['./color-picker.page.scss'],
})
export class ColorPickerPage {
  constructor(private _logger: Logger) {}
  readonly log = this._logger.log;
}
