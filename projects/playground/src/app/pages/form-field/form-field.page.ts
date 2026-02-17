import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  standalone: false,
  selector: 'app-form-field',
  templateUrl: './form-field.page.html',
  styleUrls: ['./form-field.page.scss'],
})
export class FormFieldPage implements OnInit, OnDestroy {
  readonly control = new FormControl('Example text 1');
  readonly control2 = new FormControl('', [Validators.required]);
  readonly control3 = new FormControl('Example text 3');
  readonly controlSelect = new FormControl('');
  readonly controlCharCount = new FormControl('', [Validators.pattern(/^[a-z0-9]{9}$/i)]);
  readonly controlDigit = new FormControl('123456');
  readonly controlSegment = new FormControl(['yes']);
  readonly controlNativeInput = new FormControl(['native'], [Validators.required]);
  readonly controlNativeTextarea = new FormControl(['textarea'], [Validators.required]);
  readonly controlAutoError = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(10),
    Validators.pattern(/^[a-z]+$/i),
  ]);

  readonly options = ['Apple', 'Pear', 'Banana', 'Cherry'];

  readonly showHint = signal<boolean>(false);

  private _interval!: any;
  ngOnInit(): void {
    setTimeout(() => {
      this.control2.setErrors({ required: true });
    }, 3000);
    this._interval = setInterval(() => {
      this.showHint.update(v => !v);
    }, 3000);
    this.control3.disable();
  }
  ngOnDestroy(): void {
    clearInterval(this._interval);
  }
}
