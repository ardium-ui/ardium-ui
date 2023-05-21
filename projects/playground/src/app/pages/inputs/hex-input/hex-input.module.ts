import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HexInputPage } from './hex-input.page';
import { ArdiumHexInputModule } from '@ardium-ui/ui';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        HexInputPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ArdiumHexInputModule,
    ]
})
export class HexInputModule { }
