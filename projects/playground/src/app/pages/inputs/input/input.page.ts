import { Component } from '@angular/core';
import { FormElementAppearance } from '@ardium-ui/ui';
import { Logger } from './../../../services/logger.service';
import { DataService } from './../../../services/data.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.page.html',
  styleUrls: ['./input.page.scss']
})
export class InputPage {
    appearances: FormElementAppearance[] = Object.values(FormElementAppearance);
    value: string = 'Hello world!';
    maxLength = 15;

    charlist = 'abcdef';
    charlistCaseInsensitive = true;
    valueForCharlist = 'Abcdef';

    fruitInputValue: string | null = 'Apple';

    private _fruitSuggestionSubject = new BehaviorSubject<string>('');
    public fruitSuggestion$ = this._fruitSuggestionSubject.asObservable();
    private _suggestions = this._dataService.fruitArray;
    onFruitInput(input: string | null) {
        if (!input) {
            this._fruitSuggestionSubject.next('');
            return;
        }
        let newSuggestion = this._getNewSuggestion();
        this._fruitSuggestionSubject.next(newSuggestion);
    }
    onFruitAcceptSuggestion(): void {
        this._fruitSuggestionSubject.next('');
    }
    private _getNewSuggestion(): string {
        return this._suggestions.find(v => this.fruitInputValue && v.startsWith(this.fruitInputValue)) ?? '';
    }

    constructor(private _logger: Logger, private _dataService: DataService) {  }
    log = this._logger.log;
}
