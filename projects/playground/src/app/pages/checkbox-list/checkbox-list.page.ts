import { Component } from '@angular/core';

@Component({
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.page.html',
  styleUrls: ['./checkbox-list.page.scss'],
})
export class CheckboxListPage {
  readonly fruitItems = ['Apple', 'Banana', 'Pear', 'Starfruit'];
}
