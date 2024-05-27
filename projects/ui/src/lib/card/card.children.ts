import { ChangeDetectionStrategy, Component, Directive, ElementRef, HostBinding, Input, Renderer2, ViewEncapsulation, computed, input } from '@angular/core';
import { OneAxisAlignment } from '../types/alignment.types';

@Component({
  selector: 'ard-card-header',
  templateUrl: 'card-header.template.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCardHeaderComponent {}

@Directive({ selector: 'ard-card-subtitle, [ard-card-subtitle]' })
export class ArdiumCardSubtitleDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-subtitle');
  }
}

@Directive({ selector: 'ard-card-title, [ard-card-title]' })
export class ArdiumCardTitleDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-title');
  }
}

@Directive({ selector: '[ard-card-avatar]' })
export class ArdiumCardAvatarDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-avatar');
  }
}

@Directive({ selector: 'ard-card-content, [ard-card-content]' })
export class ArdiumCardContentDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-content');
  }
}

@Directive({ selector: '[ard-card-image]' })
export class ArdiumCardImageDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-image');
  }
}

@Directive({ selector: 'ard-card-action-buttons, [ard-card-action-buttons]' })
export class ArdiumCardActionButtonsDirective {
  readonly align = input<OneAxisAlignment>(OneAxisAlignment.Right);

  @HostBinding('class') readonly alignClass = computed(() => `ard-card-action-buttons ard-align-${this.align}`);
}

@Directive({ selector: 'ard-card-footer, [ard-card-footer]' })
export class ArdiumCardFooterDirective {
  constructor(renderer: Renderer2, hostElement: ElementRef) {
    renderer.addClass(hostElement.nativeElement, 'ard-card-footer');
  }
}
