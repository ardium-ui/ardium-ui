import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumSlideToggleComponent } from './slide-toggle.component';



@NgModule({
    declarations: [
        ArdiumSlideToggleComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumSlideToggleComponent
    ]
})
export class ArdiumSlideToggleModule { }
