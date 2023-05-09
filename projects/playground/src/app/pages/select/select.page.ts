import { Component, OnInit } from '@angular/core';
import { ArdSearchFunction } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';
import { DataService } from './../../services/data.service';

@Component({
    selector: 'app-select',
    templateUrl: './select.page.html',
    styleUrls: ['./select.page.scss']
})
export class SelectPage implements OnInit {

    constructor(private _logger: Logger, private _dataService: DataService) { }
    readonly log = this._logger.log;


    currentFruit: string = 'Apple';
    currentFruitDisabled: boolean = false;
    ngOnInit(): void {
        setTimeout(() => {
            this.currentFruit = 'Watermelon';
            console.log('changing name');
        }, 3000);
        setTimeout(() => {
            this.currentFruitDisabled = true;
            console.log('changing disabled true');
        }, 6000);
        setTimeout(() => {
            this.currentFruitDisabled = false;
            console.log('changing disabled false');
        }, 9000);
    }

    //* item lists
    animals = Array.from(this._dataService.animalsArray);
    fruits = Array.from(this._dataService.fruitArray);
    colors = Array.from(this._dataService.colorsArray);

    //* color search fn
    readonly colorSearchFn = ArdSearchFunction.byLabelAndGroup;
}
