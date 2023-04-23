import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumColorPickerComponent } from './color-picker.component';
import {  } from './color-picker.directives';



@NgModule({
    declarations: [
        ArdiumColorPickerComponent,
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumColorPickerComponent
    ]
})
export class ArdiumColorPickerModule { }
