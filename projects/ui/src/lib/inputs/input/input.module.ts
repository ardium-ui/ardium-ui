import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumInputComponent } from './input.component';
import { _ClearButtonModule } from '../../_internal/clear-button/clear-button.module';



@NgModule({
    declarations: [
        ArdiumInputComponent
    ],
    imports: [
        CommonModule,
        _ClearButtonModule,
    ],
    exports: [
        ArdiumInputComponent
    ]
})
export class ArdiumInputModule { }
