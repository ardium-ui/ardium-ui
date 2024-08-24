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
import { coerceArrayProperty, coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance } from '../types/theming.types';
import { Nullable } from '../types/utility.types';

@Component({
  selector: 'ard-kbd-shortcut',
  templateUrl: './kbd-shortcut.component.html',
  styleUrls: ['./kbd-shortcut.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumKbdShortcutComponent implements AfterViewInit {
  readonly contentWrapper = viewChild<ElementRef<HTMLElement>>('contentWrapperEl');

  ngAfterViewInit(): void {
    if (!this.keys() && !this.contentWrapper()?.nativeElement.innerText) {
      throw new Error(`ARD-FT5040: Using <ard-kbd-shortcut> without specifying the [keys] field is not allowed.`);
    }
  }

  readonly keys = input<Nullable<string[]>, Nullable<string | string[]>>(undefined, {
    transform: v => coerceArrayProperty(v, /[+, ]/),
  });

  readonly full = input<boolean, any>(false, { transform: v => coerceBooleanProperty(v) });

  //! appearance
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Filled);

  readonly ngClasses = computed<string>(() => [`ard-appearance-${this.appearance}`].join(' '));
}
