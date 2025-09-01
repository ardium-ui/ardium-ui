import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.page.html',
  styleUrls: ['./file-input.page.scss'],
})
export class FileInputPage {
  readonly control = new FormControl<File | null>(null);
}
