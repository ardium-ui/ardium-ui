import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSimpleInputComponent } from './simple-input.component';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';



@NgModule({
    declarations: [
        ArdiumSimpleInputComponent
    ],
    imports: [
        CommonModule,
        _ClearButtonModule,
    ],
    exports: [
        ArdiumSimpleInputComponent
    ]
})
export class ArdiumSimpleInputModule { }
