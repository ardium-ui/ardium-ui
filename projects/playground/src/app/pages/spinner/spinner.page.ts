import { Component } from '@angular/core';
import { SimpleComponentColor as SCC } from 'projects/ui/src/public-api';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.page.html',
  styleUrls: ['./spinner.page.scss'],
})
export class SpinnerPage {
  readonly colors = Object.values(SCC);
}
