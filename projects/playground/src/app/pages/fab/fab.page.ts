import { Component, OnInit } from '@angular/core';
import { ButtonAppearance as BA, FABSize as FS, ComponentColor as CC } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
    selector: 'app-fab',
    templateUrl: './fab.page.html',
    styleUrls: ['./fab.page.scss']
})
export class FabPage implements OnInit {
    sizes: FS[] = Object.values(FS);
    appearances: BA[] = Object.values(BA);
    colors: CC[] = Object.values(CC);

    color: CC[] = [CC.Primary];
    appearance: BA[] = [BA.RaisedStrong];
    size: FS[] = [FS.Standard];
    extended: boolean = false;
    disabled: boolean = false;
    icon: string | null = "favorite";
    text: string | null = null;

    constructor(private _logger: Logger) { }
    log = this._logger.log;

    ngOnInit(): void {
    }

}
