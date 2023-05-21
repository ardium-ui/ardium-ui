import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HexInputModule } from './hex-input/hex-input.module';
import { InputModule } from './input/input.module';

import { InputsHomeModule } from './inputs-home/inputs-home.module';
import { InputsRoutingModule } from './inputs-routing.module';
import { InputsPage } from './inputs.page';
import { NumberInputModule } from './number-input/number-input.module';
import { SimpleInputModule } from './simple-input/simple-input.module';


@NgModule({
    declarations: [
        InputsPage,
    ],
    imports: [
        CommonModule,
        InputsRoutingModule,
        InputsHomeModule,
        SimpleInputModule,
        InputModule,
        NumberInputModule,
        HexInputModule,
    ],
    exports: [
        InputsPage,
    ]
})
export class InputsModule { }
