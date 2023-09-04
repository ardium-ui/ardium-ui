import { Component, OnInit } from '@angular/core';
import { ComponentColor as CC } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
    selector: 'app-icon-button',
    templateUrl: './icon-button.page.html',
    styleUrls: ['./icon-button.page.scss']
})
export class IconButtonPage implements OnInit {
    colors: CC[] = Object.values(CC);

    color: CC[] = [CC.Primary];
    compact: boolean = false;
    disabled: boolean = false;
    icon: string | null = "favorite";
    text: string | null = null;

    constructor(private _logger: Logger) { }
    log = this._logger.log;

    ngOnInit(): void {
    }
}
