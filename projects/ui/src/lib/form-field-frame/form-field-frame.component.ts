import { ChangeDetectionStrategy, Component, ViewEncapsulation, ContentChild, TemplateRef, Input, HostBinding } from '@angular/core';
import { coerceBooleanProperty } from '@ardium-ui/devkit';
import { FormElementAppearance, FormElementVariant } from '../types/theming.types';
import { _DisablableComponentBase } from '../_internal/disablable-component';
import { ArdFormFieldPrefixTemplateDirective, ArdFormFieldSuffixTemplateDirective } from './form-field-frame.directives';

@Component({
    selector: 'ard-form-field-frame',
    templateUrl: './form-field-frame.component.html',
    styleUrls: ['./form-field-frame.component.scss'],
    encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldFrameComponent extends _DisablableComponentBase {
    //! focused state
    /**
     * Whether the component is currently focused.
    */
    @Input() isFocused: boolean = false;
    
    //! appearance
    /**
     * The appearance of the component, aka the styling.
    */
    @Input() appearance: FormElementAppearance = FormElementAppearance.Outlined;
    /**
     * The variant of the component, aka the shape.
    */
    @Input() variant: FormElementVariant = FormElementVariant.Rounded;

    /**
     * @private
     * Whether to use the compact styling or not.
    */
    private _compact: boolean = false;
    @Input()
    /**
     * Whether to use the compact styling or not.
    */
    get compact(): boolean { return this._compact; }
    /**
     * Whether to use the compact styling or not.
    */
    set compact(v: any) { this._compact = coerceBooleanProperty(v); }

    get ngClasses(): string {
        return [
            `ard-appearance-${this.appearance}`,
            `ard-variant-${this.variant}`,
            this.compact ? 'ard-compact' : '',
            this.isFocused ? 'ard-focused' : 'ard-unfocused',
        ].join(' ');
    }

    //! prefix & suffix
    @ContentChild(ArdFormFieldPrefixTemplateDirective) prefixTemplate: TemplateRef<any> | null = null;
    @ContentChild(ArdFormFieldSuffixTemplateDirective) suffixTemplate: TemplateRef<any> | null = null;
}
