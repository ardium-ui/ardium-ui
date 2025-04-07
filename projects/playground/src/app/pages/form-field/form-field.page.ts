import { Component, OnInit, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.page.html',
  styleUrls: ['./form-field.page.scss'],
})
export class FormFieldPage implements OnInit {
  readonly control = new FormControl('Example text 1');
  readonly control2 = new FormControl('', [Validators.required]);
  readonly control3 = new FormControl('Example text 3');
  readonly controlSelect = new FormControl('');
  readonly controlDigit = new FormControl('123456');
  readonly controlSegment = new FormControl(['yes']);

  readonly options = ['Apple', 'Pear', 'Banana', 'Cherry'];

  readonly showHint = signal<boolean>(false);

  private _interval!: any;
  ngOnInit(): void {
    setTimeout(() => {
      this.control2.setErrors({ required: true });
    }, 3000);
    setInterval(() => {
      this.showHint.update(v => !v);
    }, 3000);
    this.control3.disable();
  }
}
