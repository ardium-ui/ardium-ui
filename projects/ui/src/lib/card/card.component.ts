import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  HostBinding,
  ViewEncapsulation,
  computed,
  inject,
  input,
} from '@angular/core';
import { ARD_CARD_DEFAULTS } from './card.defaults';
import { CardAppearance, CardVariant } from './card.types';

@Directive({ selector: '[ard-card]' })
export class ArdiumCardDirective {
  private readonly _DEFAULTS = inject(ARD_CARD_DEFAULTS);

  //! appearance
  readonly appearance = input<CardAppearance>(this._DEFAULTS.appearance);
  readonly variant = input<CardVariant>(this._DEFAULTS.variant);

  readonly ngClasses = computed(() =>
    ['ard-card', `ard-appearance-${this.appearance()}`, `ard-variant-${this.variant()}`].join(' ')
  );

  @HostBinding('class')
  get _ngClassesHostAttribute() {
    return this.ngClasses();
  }
}

@Component({
  selector: 'ard-card',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCardComponent extends ArdiumCardDirective {}
