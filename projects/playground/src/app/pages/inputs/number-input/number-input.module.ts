import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberInputPage } from './number-input.page';
import { FormsModule } from '@angular/forms';
import { ArdiumNumberInputModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        NumberInputPage,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ArdiumNumberInputModule,
    ]
})
export class NumberInputModule { }
