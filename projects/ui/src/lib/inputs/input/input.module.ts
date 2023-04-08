import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumClickOutsideEventModule } from '@ardium-ui/devkit';
import { ArdiumDropdownPanelModule } from '../../dropdown-panel/dropdown-panel.module';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdiumInputComponent } from './input.component';
import { ArdSuggestionTemplateDirective } from './input.directives';



@NgModule({
    declarations: [
        ArdiumInputComponent,
        ArdSuggestionTemplateDirective,
    ],
    imports: [
        CommonModule,
        _ClearButtonModule,
        ArdiumDropdownPanelModule,
        ArdiumClickOutsideEventModule,
    ],
    exports: [
        ArdiumInputComponent,
        ArdSuggestionTemplateDirective,
    ]
})
export class ArdiumInputModule { }
