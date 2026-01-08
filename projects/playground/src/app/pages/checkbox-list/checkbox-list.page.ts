import { Component, inject, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.page.html',
  styleUrls: ['./checkbox-list.page.scss'],
})
export class CheckboxListPage implements OnDestroy {
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

  readonly control = new FormControl<string[]>(['Banana', 'Pear']);

  private readonly _controlSub = this.control.events.subscribe(event => {
    console.log('FormControl Event:', event);
  });

  ngOnDestroy(): void {
    this._controlSub.unsubscribe();
  }
}
