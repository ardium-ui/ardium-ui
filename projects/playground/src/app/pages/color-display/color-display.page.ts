import { Component, OnInit } from '@angular/core';
import { ColorDisplayAppearance } from '@ardium-ui/ui';
import * as Color from 'color';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-color-display',
  templateUrl: './color-display.page.html',
  styleUrls: ['./color-display.page.scss'],
})
export class ColorDisplayPage implements OnInit {
  appearances: ColorDisplayAppearance[] = Object.values(ColorDisplayAppearance);

  color$ = new BehaviorSubject(Color('red').hex());

  private currentHue: number = 0;

  ngOnInit(): void {
    setInterval(() => {
      const newColor = Color('red').hue(this.currentHue);
      this.color$.next(newColor.hex());

      this.currentHue += 2;
      if (this.currentHue >= 360) this.currentHue = 0;
    }, 40);
  }
}
