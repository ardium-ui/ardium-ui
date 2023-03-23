import { Component, OnInit } from '@angular/core';
import { Logger } from './../../services/logger.service';

@Component({
    selector: 'app-slider',
    templateUrl: './slider.page.html',
    styleUrls: ['./slider.page.scss']
})
export class SliderPage implements OnInit {

    constructor(private _logger: Logger) { }
    log = this._logger.log;

    ngOnInit(): void {
    }

}
