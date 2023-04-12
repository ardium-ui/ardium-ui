import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSimpleInputComponent } from './simple-input.component';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';
import { ArdSimpleInputPlaceholderTemplateDirective } from './simple-input.directives';



@NgModule({
    declarations: [
        ArdiumSimpleInputComponent,
        ArdSimpleInputPlaceholderTemplateDirective,
    ],
    imports: [
        CommonModule,
        _ClearButtonModule,
    ],
    exports: [
        ArdiumSimpleInputComponent,
        ArdSimpleInputPlaceholderTemplateDirective,
    ]
})
export class ArdiumSimpleInputModule { }
