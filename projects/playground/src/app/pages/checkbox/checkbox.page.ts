import { Component, OnInit } from '@angular/core';
import { SimpleComponentColor as SCC, CheckboxState } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.page.html',
    styleUrls: ['./checkbox.page.scss']
})
export class CheckboxPage implements OnInit {
    states: CheckboxState[] = Object.values(CheckboxState);
    colors: SCC[] = Object.values(SCC);

    constructor(private _logger: Logger) { }
    log = this._logger.log;

    ngOnInit(): void {
    }

}
