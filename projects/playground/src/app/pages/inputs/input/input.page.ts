import { Component } from '@angular/core';
import { FormElementAppearance } from '@ardium-ui/ui';
import { Logger } from './../../../services/logger.service';
import { DataService } from './../../../services/data.service';
import { BehaviorSubject } from 'rxjs';
import { findBestSuggestions } from '@ardium-ui/devkit';

@Component({
  selector: 'app-input',
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss'],
})
export class InputPage {
  appearances: FormElementAppearance[] = Object.values(FormElementAppearance);
  value: string = 'Hello world!';
  maxLength = 15;

  charlist = 'abcdef';
  charlistCaseInsensitive = true;
  valueForCharlist = 'Abcdef';

  fruitInputValue: string | null = 'Apple';

  private _fruitAutocompleteSubject = new BehaviorSubject<string>('');
  public fruitAutocomplete$ = this._fruitAutocompleteSubject.asObservable();
  private _autocompletes = this._dataService.fruitArray;
  onFruitInput(input: string | null) {
    if (!input) {
      this._fruitAutocompleteSubject.next('');
      return;
    }
    const newSuggestion = this._getNewAutocomplete();
    this._fruitAutocompleteSubject.next(newSuggestion);
  }
  onFruitAcceptAutocomplete(): void {
    this._fruitAutocompleteSubject.next('');
  }
  private _getNewAutocomplete(): string {
    return this._autocompletes.find(v => this.fruitInputValue && v.startsWith(this.fruitInputValue)) ?? '';
  }

  colorInputValue: string | null = 'Red';

  private _colorSuggestionsSubject = new BehaviorSubject<any[]>([]);
  public colorSuggestions$ = this._colorSuggestionsSubject.asObservable();
  private _suggestions = this._dataService.colorsArray;
  onColorInput(input: string | null) {
    if (!input) {
      this._colorSuggestionsSubject.next([]);
      return;
    }
    const newSuggestions = this._getNewSuggestions();
    this._colorSuggestionsSubject.next(newSuggestions);
  }
  onColorAcceptSuggestion(): void {
    this._colorSuggestionsSubject.next([]);
  }
  private _getNewSuggestions(): any[] {
    if (!this.colorInputValue) return [];
    return findBestSuggestions(this.colorInputValue, this._suggestions, v => v.name).slice(0, 7);
  }

  constructor(
    private _logger: Logger,
    private _dataService: DataService
  ) {}
  log = this._logger.log;
}
