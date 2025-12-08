import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { form } from '@angular/forms/signals';
import { Logger } from '../../services/logger.service';

@Component({
  standalone: false,
  selector: 'app-checkbox-list',
  templateUrl: './checkbox-list.page.html',
  styleUrls: ['./checkbox-list.page.scss'],
})
export class CheckboxListPage implements OnInit {
  readonly fruitItems = ['Apple', 'Banana', 'Pear', 'Starfruit'];

  readonly log = inject(Logger).log;

  readonly formControl = new FormControl<string[]>(['Pear']);

  ngOnInit(): void {
    // this.formControl.valueChanges.subscribe(v => {
    //   this.log('FormControl valueChanges:', v);
    // });
  }

  readonly testValueObject = signal<{ fruits: string[] }>({ fruits: ['Banana'] });
  readonly signalForm = form(this.testValueObject);

  fkdjf = effect(() => {
    console.log('Signal Form Value:', this.testValueObject());
  });
}
