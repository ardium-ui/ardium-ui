import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArdiumChipModule } from './../chip/chip.module';

import { ArdiumClickOutsideEventModule } from 'projects/devkit/src/public-api';
import { ArdiumDropdownPanelModule } from '../dropdown-panel/dropdown-panel.module';
import { ArdiumSelectComponent } from './select.component';
import {
    ArdDropdownFooterTemplateDirective,
    ArdDropdownHeaderTemplateDirective,
    ArdItemDisplayLimitTemplateDirective,
    ArdItemLimitReachedTemplateDirective,
    ArdLoadingPlaceholderTemplateDirective,
    ArdLoadingSpinnerTemplateDirective,
    ArdNoItemsFoundTemplateDirective,
    ArdOptgroupTemplateDirective,
    ArdOptionTemplateDirective,
    ArdSelectPlaceholderTemplateDirective,
    ArdValueChipTemplateDirective,
    ArdValueTemplateDirective
} from './select.directive';

import { ArdiumEscapeHTMLModule } from '../../../../devkit/src/lib/escape-html/escape-html.module';
import { _ClearButtonModule } from './../_internal/clear-button/clear-button.module';

@NgModule({
    declarations: [
        ArdiumSelectComponent,
        //tempalate directives
        ArdOptionTemplateDirective,
        ArdOptgroupTemplateDirective,
        ArdValueTemplateDirective,
        ArdSelectPlaceholderTemplateDirective,
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
        _ClearButtonModule,
        ArdiumEscapeHTMLModule,
    ],
    exports: [
        ArdiumSelectComponent,
        //tempalate directives
        ArdOptionTemplateDirective,
        ArdOptgroupTemplateDirective,
        ArdValueTemplateDirective,
        ArdSelectPlaceholderTemplateDirective,
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
