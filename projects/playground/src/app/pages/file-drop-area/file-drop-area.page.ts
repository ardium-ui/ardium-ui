import { Component } from '@angular/core';

@Component({
  selector: 'app-file-drop-area',
  templateUrl: './file-drop-area.page.html',
  styleUrls: ['./file-drop-area.page.scss'],
})
export class FileDropAreaPage {
  readonly exampleFile = new File([], 'example.txt');
}
