import { Component, inject } from '@angular/core';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.page.html',
  styleUrls: ['./checkbox-list.page.scss'],
})
export class CheckboxListPage {
  readonly fruitItems = ['Apple', 'Banana', 'Pear', 'Starfruit'];

  readonly log = inject(Logger).log;
}
