import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    ElementRef,
    Renderer2,
    ViewEncapsulation,
    computed,
    inject,
    input,
} from '@angular/core';
import { OneAxisAlignment } from '../types/alignment.types';
import { ARD_CARD_DEFAULTS } from './card.defaults';

@Component({
  standalone: false,
  selector: 'ard-card-header',
  templateUrl: 'card-header.template.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCardHeaderComponent {}

@Directive({ standalone: false, selector: 'ard-card-subtitle, [ard-card-subtitle]' })
export class ArdiumCardSubtitleDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-subtitle');
  }
}

@Directive({ standalone: false, selector: 'ard-card-title, [ard-card-title]' })
export class ArdiumCardTitleDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-title');
  }
}

@Directive({ standalone: false, selector: '[ard-card-avatar]' })
export class ArdiumCardAvatarDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-avatar');
  }
}

@Directive({ standalone: false, selector: 'ard-card-content, [ard-card-content]' })
export class ArdiumCardContentDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-content');
  }
}

@Directive({ standalone: false, selector: '[ard-card-image]' })
export class ArdiumCardImageDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-image');
  }
}

@Directive({
  standalone: false,
  selector: 'ard-card-action-buttons, [ard-card-action-buttons]',
  host: {
    '[class]': 'alignClass()',
  },
})
export class ArdiumCardActionButtonsDirective {
  private readonly _DEFAULTS = inject(ARD_CARD_DEFAULTS);

  readonly align = input<OneAxisAlignment>(this._DEFAULTS.actionButtonsAlign);

  readonly alignClass = computed(() => `ard-card-action-buttons ard-align-${this.align()}`);
}

@Directive({ standalone: false, selector: 'ard-card-footer, [ard-card-footer]' })
export class ArdiumCardFooterDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-footer');
  }
}
