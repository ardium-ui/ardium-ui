import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ArdiumColorDisplayModule } from '@ardium-ui/ui';
import { ColorDisplayPage } from './color-display.page';



@NgModule({
    declarations: [
        ColorDisplayPage
    ],
    imports: [
        CommonModule,
        ArdiumColorDisplayModule,
    ]
})
export class ColorDisplayModule { }
