import { Component } from '@angular/core';
import { homedir } from 'os';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.page.html',
  styleUrls: ['./icon.page.scss']
})
export class IconPage {
    iconValue: string = 'home';
}
