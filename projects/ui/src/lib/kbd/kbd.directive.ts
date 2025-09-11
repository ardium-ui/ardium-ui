import { computed, Directive, effect, ElementRef, inject, input, Renderer2 } from '@angular/core';
import { FormElementAppearance } from './../types/theming.types';

@Directive({
  standalone: false,
  selector: '[ardKbd]',
})
export class ArdiumKbdDirective {
  readonly elementRef: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  readonly renderer: Renderer2 = inject(Renderer2);

  //! appearance
  readonly appearance = input<FormElementAppearance>(FormElementAppearance.Filled, { alias: 'ardKbdAppearance' });

  readonly ngClasses = computed<string[]>(() => ['ard-kbd', `ard-appearance-${this.appearance()}`]);

  constructor() {
    effect(() => {
      const classes = this.ngClasses();
      this.updateClasses(classes);
    });
  }

  private updateClasses(classes: string[]): void {
    const element = this.elementRef.nativeElement;

    const previousClasses = element.className.split(' ').filter(cls => cls.startsWith('ard-appearance-'));
    previousClasses.forEach(cls => this.renderer.removeClass(element, cls));

    classes.forEach(cls => {
      this.renderer.addClass(element, cls);
    });
  }
}
