import { ComponentRef, Directive, Input, TemplateRef } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { _DisablableComponentBase } from '../_internal/disablable-component';
import { ComponentColor } from '../types/colors.types';
import { BadgePosition, BadgeSize } from './badge.types';

@Directive({
    selector: '[ardBadge]'
})
export class ArdiumBadgeDirective extends _DisablableComponentBase {

    @Input('ardBadge') text!: string | TemplateRef<unknown> | ComponentRef<unknown>;

    @Input('ardBadgeSize') size: BadgeSize = BadgeSize.Medium;
    @Input('ardBadgeColor') color: ComponentColor = ComponentColor.Primary;
    @Input('ardBadgePosition') position: BadgePosition = BadgePosition.After;

    @Input('ardBadgeAriaDescription') ariaDescription?: string;
    @Input('ardBadgeAriaLabel') ariaLabel?: string;

    private _hidden: boolean = false;
    @Input('ardBadgeHidden')
    get hidden(): boolean { return this._hidden; }
    set hidden(v: any) { this._hidden = coerceBooleanProperty(v); }

    private _overlap: boolean = false;
    @Input('ardBadgeOverlap')
    get overlap(): boolean { return this._overlap; }
    set overlap(v: any) { this._overlap = coerceBooleanProperty(v); }

}
