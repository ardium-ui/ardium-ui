import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewEncapsulation,
  computed,
  input,
  viewChild,
} from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance } from './../types/theming.types';

@Component({
  selector: 'ard-kbd',
  templateUrl: './kbd.component.html',
  styleUrls: ['./kbd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumKbdComponent implements AfterViewInit {
  readonly contentWrapper = viewChild<ElementRef<HTMLElement>>('contentWrapperEl');

  ngAfterViewInit(): void {
    if (!this.key() && !this.contentWrapper()!.nativeElement.innerText) {
      console.warn(`Using <ard-kbd> without specifying the [key] field.`); //TODO error
    }
  }

  readonly key = input<string>('');
  readonly full = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! appearance
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Filled);

  readonly ngClasses = computed<string>(() => [`ard-appearance-${this.appearance}`].join(' '));
}
