import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, input, computed, viewChild } from '@angular/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@ardium-ui/devkit';
import { isDefined } from 'simple-bool';
import { Nullable } from '../types/utility.types';

type WeightNumber = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type WeightString = '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';

type GradeNumber = -25 | 0 | 200;
type GradeString = '-25' | '0' | '200';

type OpticalSizeNumber = 20 | 24 | 40 | 48;
type OpticalSizeString = '20' | '24' | '40' | '48';

@Component({
  selector: 'ard-icon',
  templateUrl: `./icon.component.html`,
  styleUrls: ['./icon.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumIconComponent implements AfterViewInit {
  readonly ariaLabel = input<string>('');
  readonly icon = input<Nullable<string>>('');

  readonly filled = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });
  readonly weight = input<WeightNumber | undefined, Nullable<WeightNumber | WeightString>>(400, {
    transform: v => coerceNumberProperty(v, 400) as WeightNumber,
  });
  readonly grade = input<GradeNumber | undefined, Nullable<GradeNumber | GradeString>>(0, {
    transform: v => coerceNumberProperty(v, 0) as GradeNumber,
  });
  readonly opticalSize = input<OpticalSizeNumber | undefined, Nullable<OpticalSizeNumber | OpticalSizeString>>(40, {
    transform: v => coerceNumberProperty(v, 40) as OpticalSizeNumber,
  });

  readonly fontVariationSettings = computed<string>(() => {
    //map values to different properties defined by google icons
    const propObject = {
      FILL: isDefined(this.filled) ? Number(this.filled) : undefined,
      wght: this.weight,
      GRAD: this.grade,
      opsz: this.opticalSize,
    };
    //map the object to an array of strings
    const propObjectAsArray = Object.entries(propObject) //object to array
      .filter(v => isDefined(v[1])) //filter undefined values
      .map(v => `"${v[0]}" ${v[1]}`) //map key-value pairs to strings
      .flat(); //flatten

    //create the final string only if any of the properties are defined
    return propObjectAsArray.length === 0 ? '' : ['font-variation-settings: ', ...propObjectAsArray].join('');
  });

  readonly contentWrapper = viewChild<ElementRef<HTMLElement>>('contentWrapperEl');

  ngAfterViewInit(): void {
    if (!this.icon() && !this.contentWrapper()?.nativeElement.innerText) {
      console.warn(`Using <ard-icon> without specifying the [icon] field.`); //TODO error
    }
  }
}
