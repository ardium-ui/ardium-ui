import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    HostBinding,
    Input,
    ViewEncapsulation,
} from '@angular/core';
import { CardAppearance, CardVariant } from './card.types';

@Directive({ selector: '[ard-card]' })
export class ArdiumCardDirective {
    //! appearance
    @Input() appearance: CardAppearance = CardAppearance.Raised;
    @Input() variant: CardVariant = CardVariant.Rounded;

    @HostBinding('class')
    get ngClasses(): string {
        return [
            'ard-card',
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
        ].join(' ');
    }
}

@Component({
    selector: 'ard-card',
    template: '<ng-content></ng-content>',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArdiumCardComponent extends ArdiumCardDirective {}
