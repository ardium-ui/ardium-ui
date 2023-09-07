import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArdiumCheckboxListComponent } from './checkbox-list.component';
import { ArdiumCheckboxModule } from '../checkbox/checkbox.module';



@NgModule({
    declarations: [
        ArdiumCheckboxListComponent
    ],
    imports: [
        CommonModule,
        ArdiumCheckboxModule,
    ],
    exports: [
        ArdiumCheckboxListComponent
    ]
})
export class ArdiumCheckboxListModule { }
