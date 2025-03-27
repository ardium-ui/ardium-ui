import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.page.html',
  styleUrls: ['./form-field.page.scss'],
})
export class FormFieldPage implements OnInit {
  readonly control = new FormControl('');
  readonly control2 = new FormControl('');
  readonly controlSelect = new FormControl('');

  readonly options = ['Apple', 'Pear', 'Banana', 'Cherry']

  ngOnInit(): void {
    setTimeout(() => {
      this.control2.setErrors({ required: true });
    }, 3000);
  }
}
