import { Directive, TemplateRef } from "@angular/core";
import { OptionContext } from "../_internal/item-storages/item-storage.types";
import { GroupContext, ItemDisplayLimitContext, ItemLimitContext, SearchContext, StatsContext, ValueContext } from "./select.types";

//public (exported)
@Directive({ selector: 'ng-template[ard-value-tmp]' })
export class ArdValueTemplateDirective {
    constructor(public template: TemplateRef<ValueContext>) {}
}

@Directive({ selector: 'ng-template[ard-value-chip-tmp]' })
export class ArdValueChipTemplateDirective {
    constructor(public template: TemplateRef<ValueContext>) {}
}

@Directive({ selector: 'ng-template[ard-option-tmp]' })
export class ArdOptionTemplateDirective {
    constructor(public template: TemplateRef<OptionContext>) {}
}

@Directive({ selector: 'ng-template[ard-optgroup-tmp]' })
export class ArdOptgroupTemplateDirective {
    constructor(public template: TemplateRef<GroupContext>) {}
}

@Directive({ selector: 'ng-template[ard-placeholder-tmp]' })
export class ArdPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<StatsContext>) {}
}

@Directive({ selector: 'ng-template[ard-loading-spinner-tmp]' })
export class ArdLoadingSpinnerTemplateDirective {
    constructor(public template: TemplateRef<null>) {}
}

@Directive({ selector: 'ng-template[ard-loading-placeholder-tmp]' })
export class ArdLoadingPlaceholderTemplateDirective {
    constructor(public template: TemplateRef<SearchContext>) {}
}

@Directive({ selector: 'ng-template[ard-dropdown-header-tmp]' })
export class ArdDropdownHeaderTemplateDirective {
    constructor(public template: TemplateRef<SearchContext>) {}
}

@Directive({ selector: 'ng-template[ard-dropdown-footer-tmp]' })
export class ArdDropdownFooterTemplateDirective {
    constructor(public template: TemplateRef<SearchContext>) {}
}

@Directive({ selector: 'ng-template[ard-no-items-found-tmp]' })
export class ArdNoItemsFoundTemplateDirective {
    constructor(public template: TemplateRef<SearchContext>) {}
}

@Directive({ selector: 'ng-template[ard-item-limit-reached-tmp]' })
export class ArdItemLimitReachedTemplateDirective {
    constructor(public template: TemplateRef<ItemLimitContext>) {}
}

@Directive({ selector: 'ng-template[ard-item-display-limit-tmp]' })
export class ArdItemDisplayLimitTemplateDirective {
    constructor(public template: TemplateRef<ItemDisplayLimitContext>) {}
}