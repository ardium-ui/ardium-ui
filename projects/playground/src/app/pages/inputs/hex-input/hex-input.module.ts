import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HexInputPage } from './hex-input.page';
import { ArdiumFormFieldFrameModule, ArdiumHexInputModule, ArdiumIconModule } from '@ardium-ui/ui';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        HexInputPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ArdiumHexInputModule,
        ArdiumIconModule,
    ]
})
export class HexInputModule { }
