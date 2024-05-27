import { AfterViewInit, ChangeDetectionStrategy, Component, Input, ViewEncapsulation, input } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import * as Color from 'color';
import { ColorDisplayAppearance } from './color-display.types';
import { Nullable } from '../../types/utility.types';

@Component({
  selector: 'ard-color-display',
  templateUrl: './color-display.component.html',
  styleUrls: ['./color-display.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumColorDisplayComponent implements AfterViewInit {
  readonly ariaLabel = input<string>('');

  readonly withLabel = input<any, boolean>(false, { transform: v => coerceBooleanProperty(v) });

  //! appearance
  readonly appearance = input<ColorDisplayAppearance>(ColorDisplayAppearance.Rounded);

  get ngClasses(): string {
    const apprncParts = this.appearance().split(' ');
    return `ard-appearance-${apprncParts[0]} ${apprncParts[1] ? 'ard-with-border' : ''}`;
  }

  //! color
  readonly color = input<Nullable<string>, any>(undefined, { transform: v => Color(v).hex() });

  ngAfterViewInit(): void {
    if (!this.color()) console.warn(`ARD-WA3000: Using <ard-color-display> without specifying the [color] field.`);
  }
}
