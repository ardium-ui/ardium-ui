import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputPage } from './input.page';
import { ArdiumInputModule } from '@ardium-ui/ui';
import { FormsModule } from '@angular/forms';



@NgModule({
    declarations: [
        InputPage
    ],
    imports: [
        CommonModule,
        FormsModule,
        ArdiumInputModule,
    ]
})
export class InputModule { }
