import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorInputPage } from './color-input.page';
import { ArdiumColorInputModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        ColorInputPage
    ],
    imports: [
        CommonModule,
        ArdiumColorInputModule,
    ]
})
export class ColorInputModule { }
