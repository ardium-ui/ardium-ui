import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumDigitInputComponent } from './digit-input.component';



@NgModule({
    declarations: [
        ArdiumDigitInputComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumDigitInputComponent
    ]
})
export class ArdiumDigitInputModule { }
