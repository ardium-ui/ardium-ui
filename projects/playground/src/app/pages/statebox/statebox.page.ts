import { Component, OnInit } from '@angular/core';
import { StateboxState } from '@ardium-ui/ui';
import { Logger } from '../../services/logger.service';

@Component({
  selector: 'app-statebox',
  templateUrl: './statebox.page.html',
  styleUrls: ['./statebox.page.scss'],
})
export class StateboxPage implements OnInit {
  states: StateboxState[] = [
    { value: 0, color: 'none' },
    { value: 1, customColor: 'red', character: 'R', filled: true },
    { value: 2, customColor: 'green', character: 'G' },
    { value: 3, color: 'info', icon: 'settings', keepFrame: true, filled: true },
  ];

  constructor(private _logger: Logger) {}
  log = this._logger.log;

  ngOnInit(): void {}
}
