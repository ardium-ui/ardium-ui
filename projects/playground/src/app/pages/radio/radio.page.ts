import { Component } from '@angular/core';

@Component({
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

  addMore: boolean = false;
}
