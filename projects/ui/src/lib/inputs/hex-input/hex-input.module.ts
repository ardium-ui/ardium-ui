import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumHexInputComponent } from './hex-input.component';
import { ArdHexInputPlaceholderTemplateDirective } from './hex-input.directives';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';



@NgModule({
    declarations: [
        ArdiumHexInputComponent,
        ArdHexInputPlaceholderTemplateDirective,
    ],
    imports: [
        CommonModule,
        _ClearButtonModule
    ],
    exports: [
        ArdiumHexInputComponent,
        ArdHexInputPlaceholderTemplateDirective,
    ]
})
export class ArdiumHexInputModule { }
