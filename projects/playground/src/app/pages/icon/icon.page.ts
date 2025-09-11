import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-icon',
  templateUrl: './icon.page.html',
  styleUrls: ['./icon.page.scss'],
})
export class IconPage {
  iconValue: string = 'home';
}
