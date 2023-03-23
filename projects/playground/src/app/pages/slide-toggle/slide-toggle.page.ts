import { Component, OnInit } from '@angular/core';
import { ComponentColor as CC } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.page.html',
  styleUrls: ['./slide-toggle.page.scss']
})
export class SlideTogglePage implements OnInit {
    colors: CC[] = Object.values(CC);

    constructor(private _logger: Logger) { }
    log = this._logger.log;

  ngOnInit(): void {
  }

}
