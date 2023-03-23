import { Component, OnInit } from '@angular/core';
import { ButtonAppearance as BA, ButtonVariant as BV, ComponentColor as CC } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
    selector: 'app-button',
    templateUrl: './button.page.html',
    styleUrls: ['./button.page.scss']
})
export class ButtonPage implements OnInit {
    variants: BV[] = [BV.Basic, BV.Pill, BV.Sharp, BV.BasicVertical, BV.SharpVertical]
    appearances: BA[] = Object.values(BA)
    colors: CC[] = Object.values(CC);

    constructor(private _logger: Logger) { }
    log = this._logger.log;

    ngOnInit(): void {
    }

}
