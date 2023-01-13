import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumButtonComponent } from './button.component';



@NgModule({
    declarations: [
        ArdiumButtonComponent
    ],
    imports: [
        CommonModule
    ],
    exports: [
        ArdiumButtonComponent,
    ]
})
export class ArdiumButtonModule { }
