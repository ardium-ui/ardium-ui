import { Component } from '@angular/core';
import { ArdSearchFunction } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';
import { DataService } from './../../services/data.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.page.html',
  styleUrls: ['./select.page.scss'],
})
export class SelectPage {
  constructor(
    private _logger: Logger,
    private _dataService: DataService
  ) {}
  readonly log = this._logger.log;

  //* item lists
  animals = Array.from(this._dataService.animalsArray);
  fruits = Array.from(this._dataService.fruitArray);
  colors = Array.from(this._dataService.colorsArray);

  //* color search fn
  readonly colorSearchFn = ArdSearchFunction.byLabelAndGroup;

  //* add custom fn
  readonly addCustomFn = (search: string) => {
    return { value: { value: search, custom: true }, label: search };
  };

  isFetchingFromBackend: boolean = false;
  readonly addCustomBackendFn = (search: string) => {
    return new Promise<any>(resolve => {
      this.isFetchingFromBackend = true;

      setTimeout(() => {
        this.isFetchingFromBackend = false;
        resolve(search);
      }, 1000);
    });
  };
}
