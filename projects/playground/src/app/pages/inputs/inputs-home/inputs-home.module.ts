import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsHomePage } from './inputs-home.page';
import { RouterModule } from '@angular/router';



@NgModule({
    declarations: [
        InputsHomePage
    ],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class InputsHomeModule { }
