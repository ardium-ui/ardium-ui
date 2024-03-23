import { Directive, TemplateRef } from '@angular/core';
import { ColorPickerColorReferenceContext, ColorPickerIndicatorContext } from '../../color/color-picker/color-picker.types';
import { ColorInputActionButtonsContext } from './color-input.types';

@Directive({ selector: 'ard-color-input > ng-template[ard-placeholder-tmp]' })
export class ArdColorInputPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-color-input > ng-template[ard-prefix-tmp]' })
export class ArdColorInputPrefixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) {}
}

@Directive({ selector: 'ard-color-input > ng-template[ard-suffix-tmp]' })
export class ArdColorInputSuffixTemplateDirective {
    constructor(public template: TemplateRef<undefined>) {}
}

//! picker directives
@Directive({
    selector: 'ard-color-input > ng-template[ard-shade-indicator-tmp]',
})
export class ArdColorInputShadeIndicatorTemplateDirective {
    constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {}
}

@Directive({ selector: 'ard-color-input > ng-template[ard-hue-indicator-tmp]' })
export class ArdColorInputHueIndicatorTemplateDirective {
    constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {}
}

@Directive({
    selector: 'ard-color-input > ng-template[ard-opacity-indicator-tmp]',
})
export class ArdColorInputOpacityIndicatorTemplateDirective {
    constructor(public template: TemplateRef<ColorPickerIndicatorContext>) {}
}

@Directive({
    selector: 'ard-color-input > ng-template[ard-color-reference-tmp]',
})
export class ArdColorInputColorReferenceTemplateDirective {
    constructor(public template: TemplateRef<ColorPickerColorReferenceContext>) {}
}

//! action buttons
@Directive({
    selector: 'ard-color-picker > ng-template[ard-action-buttons-tmp]',
})
export class ArdColorInputActionButtonsTemplateDirective {
    constructor(public template: TemplateRef<ColorInputActionButtonsContext>) {}
}
