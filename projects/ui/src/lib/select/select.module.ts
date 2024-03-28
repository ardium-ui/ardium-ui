import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ArdiumChipModule } from './../chip/chip.module';

import { ArdiumClickOutsideEventModule, ArdiumInnerHTMLModule } from '@ardium-ui/devkit';
import { ArdiumDropdownPanelModule } from '../dropdown-panel/dropdown-panel.module';
import { ArdiumSelectComponent } from './select.component';
import {
  ArdAddCustomTemplateDirective,
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
  ArdSelectPrefixTemplateDirective,
  ArdSelectSuffixTemplateDirective,
  ArdValueChipTemplateDirective,
  ArdValueTemplateDirective,
} from './select.directive';

import { _ClearButtonModule } from './../_internal/clear-button/clear-button.module';
import { ArdiumFormFieldFrameModule } from '../form-field-frame/form-field-frame.module';

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
    ArdAddCustomTemplateDirective,
    ArdSelectPrefixTemplateDirective,
    ArdSelectSuffixTemplateDirective,
  ],
  imports: [
    CommonModule,
    ArdiumFormFieldFrameModule,
    ArdiumDropdownPanelModule,
    ArdiumChipModule,
    ArdiumClickOutsideEventModule,
    _ClearButtonModule,
    ArdiumInnerHTMLModule,
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
    ArdAddCustomTemplateDirective,
    ArdSelectPrefixTemplateDirective,
    ArdSelectSuffixTemplateDirective,
  ],
})
export class ArdiumSelectModule {}
