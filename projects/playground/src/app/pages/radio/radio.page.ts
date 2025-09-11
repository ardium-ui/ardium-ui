import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-radio',
  templateUrl: './radio.page.html',
  styleUrls: ['./radio.page.scss'],
})
export class RadioPage {
  constructor() {
    setTimeout(() => {
      this.addMore = true;
    }, 3000);
  }

  readonly log = inject(Logger).log;

  addMore: boolean = false;

  readonly control = new FormControl();
}
