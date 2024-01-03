import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSearchBarComponent } from './search-bar.component';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumFormFieldFrameModule } from '../../form-field-frame/form-field-frame.module';
import { ArdSearchBarPlaceholderTemplateDirective, ArdSearchBarPrefixTemplateDirective, ArdSearchBarSuffixTemplateDirective } from './search-bar.directives';
import { ArdiumIconModule } from '../../icon/icon.module';
import { ArdiumDropdownPanelModule } from '../../dropdown-panel/dropdown-panel.module';



@NgModule({
    declarations: [
        ArdiumSearchBarComponent,
        ArdSearchBarPlaceholderTemplateDirective,
        ArdSearchBarPrefixTemplateDirective,
        ArdSearchBarSuffixTemplateDirective,
    ],
    imports: [
        CommonModule,
        _ClearButtonModule,
        ArdiumFormFieldFrameModule,
        ArdiumIconModule,
        ArdiumDropdownPanelModule,
    ],
    exports: [
        ArdiumSearchBarComponent,
        ArdSearchBarPlaceholderTemplateDirective,
        ArdSearchBarPrefixTemplateDirective,
        ArdSearchBarSuffixTemplateDirective,
    ]
})
export class ArdiumSearchBarModule { }
