import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxPage } from './checkbox.page';
import { ArdiumCheckboxModule } from '@ardium-ui/ui';



@NgModule({
    declarations: [
        CheckboxPage
    ],
    imports: [
        CommonModule,
        ArdiumCheckboxModule,
    ]
})
export class CheckboxModule { }
