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

  readonly productItems = [
    { id: 1, name: 'Laptop', isInStock: true },
    { id: 2, name: 'Smartphone', isInStock: false },
    { id: 3, name: 'Tablet', isInStock: true },
    { id: 4, name: 'Smartwatch', isInStock: true },
    { id: 5, name: 'Headphones', isInStock: false },
    { id: 6, name: 'Camera', isInStock: true },
  ]

  readonly log = inject(Logger).log;
}
