import { ChangeDetectionStrategy, Component, Directive, HostBinding, Input, ViewEncapsulation, computed, input } from '@angular/core';
import { CardAppearance, CardVariant } from './card.types';

@Directive({ selector: '[ard-card]' })
export class ArdiumCardDirective {
  //! appearance
  readonly appearance = input<CardAppearance>(CardAppearance.Raised);
  readonly variant = input<CardVariant>(CardVariant.Rounded);

  readonly ngClasses = computed(() => ['ard-card', `ard-appearance-${this.appearance()}`, `ard-variant-${this.variant()}`].join(' '));

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
