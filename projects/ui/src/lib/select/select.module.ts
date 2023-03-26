import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArdiumChipModule } from './../chip/chip.module';

import {
    ArdDropdownFooterTemplateDirective,
    ArdDropdownHeaderTemplateDirective,
    ArdLoadingPlaceholderTemplateDirective,
    ArdLoadingSpinnerTemplateDirective,
    ArdNoItemsFoundTemplateDirective,
    ArdOptgroupTemplateDirective,
    ArdOptionTemplateDirective,
    ArdPlaceholderTemplateDirective,
    ArdValueChipTemplateDirective,
    ArdValueTemplateDirective,
    ArdItemLimitReachedTemplateDirective,
    ArdItemDisplayLimitTemplateDirective,
} from './select.directive';
import { ArdiumDropdownPanelModule } from '../dropdown-panel/dropdown-panel.module';
import { ArdiumClickOutsideEventModule } from 'projects/devkit/src/public-api';
import { ArdiumSelectComponent } from './select.component';

@NgModule({
    declarations: [
        ArdiumSelectComponent,
        //tempalate directives
        ArdOptionTemplateDirective,
        ArdOptgroupTemplateDirective,
        ArdValueTemplateDirective,
        ArdPlaceholderTemplateDirective,
        ArdLoadingSpinnerTemplateDirective,
        ArdLoadingPlaceholderTemplateDirective,
        ArdDropdownHeaderTemplateDirective,
        ArdDropdownFooterTemplateDirective,
        ArdNoItemsFoundTemplateDirective,
        ArdValueChipTemplateDirective,
        ArdItemLimitReachedTemplateDirective,
        ArdItemDisplayLimitTemplateDirective,
    ],
    imports: [
        CommonModule,
        ArdiumDropdownPanelModule,
        ArdiumChipModule,
        ArdiumClickOutsideEventModule,
    ],
    exports: [
        ArdiumSelectComponent,
        //tempalate directives
        ArdOptionTemplateDirective,
        ArdOptgroupTemplateDirective,
        ArdValueTemplateDirective,
        ArdPlaceholderTemplateDirective,
        ArdLoadingSpinnerTemplateDirective,
        ArdLoadingPlaceholderTemplateDirective,
        ArdDropdownHeaderTemplateDirective,
        ArdDropdownFooterTemplateDirective,
        ArdNoItemsFoundTemplateDirective,
        ArdValueChipTemplateDirective,
        ArdItemLimitReachedTemplateDirective,
        ArdItemDisplayLimitTemplateDirective,
    ],
})
export class ArdiumSelectModule { }
